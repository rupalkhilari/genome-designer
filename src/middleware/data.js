import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { dataApiPath } from './paths';
import ProjectDefinition from '../schemas/Project';
import BlockDefinition from '../schemas/Block';

/* info query - low level API call */

export const infoQuery = (type, detail) => {
  const url = dataApiPath(`info/${type}${detail ? `/${detail}` : ''}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

/* queries */

export const loadBlock = (blockId, withComponents = false, projectId = 'block') => {
  invariant(projectId, 'Project ID is required');
  invariant(blockId, 'Block ID is required');

  if (withComponents === true) {
    return infoQuery('components', blockId);
  }

  const url = dataApiPath(`${projectId}/${blockId}`);

  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

//returns metadata of projects
export const listProjects = () => {
  const url = dataApiPath('projects');
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json())
    .then(projects => projects.filter(project => !!project));
};

/* rollups - loading + saving projects */

//returns a rollup
export const loadProject = (projectId) => {
  const url = dataApiPath(`projects/${projectId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

//expects a rollup
//autosave
//returns the commit with sha, message
export const saveProject = (projectId, rollup) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(rollup, 'Rollup is required to save');
  invariant(rollup.project && Array.isArray(rollup.blocks), 'rollup in wrong form');

  const url = dataApiPath(`projects/${projectId}`);
  const stringified = JSON.stringify(rollup);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json());
};

//expects a rollup
//explicit, makes a git commit with special message to differentiate
//returns the commit wth sha, message
export const snapshot = (projectId, rollup, message = 'Project Snapshot') => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(!message || typeof message === 'string', 'optional message for snapshot must be a string');

  const stringified = JSON.stringify({ message });
  const url = dataApiPath(`${projectId}/commit`);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json());
};
