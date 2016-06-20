import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { dataApiPath } from './paths';
import { noteSave, noteFailure } from '../store/saveState';

/******
 API requests
 ******/

/***** info query - low level API call *****/

export const infoQuery = (type, detail, additional) => {
  const url = dataApiPath(`info/${type}${detail ? `/${detail}` : ''}${additional ? `/${additional}` : ''}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

/***** queries *****/

//returns metadata of projects
export const listProjects = () => {
  const url = dataApiPath('projects');
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json())
    .then(projects => projects.filter(project => !!project));
};

/***** rollups - loading + saving projects *****/

//returns a rollup
export const loadProject = (projectId) => {
  if (!projectId) {
    return Promise.reject(null);
  }

  const url = dataApiPath(`projects/${projectId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};

//expects a rollup
//autosave
//returns the commit with sha, message, or null if no need to save
//resolves to null if the project has not changed
export const saveProject = (projectId, rollup) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(rollup, 'Rollup is required to save');
  invariant(rollup.project && typeof rollup.blocks === 'object', 'rollup in wrong form');

  const url = dataApiPath(`projects/${projectId}`);
  const stringified = JSON.stringify(rollup);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(commit => {
      const { sha } = commit;
      noteSave(projectId, sha);
      return commit;
    })
    .catch(err => {
      noteFailure(projectId, err);
      return Promise.reject(err);
    });
};

//rollup is optional, will be saved if provided
//explicit, makes a git commit with special message to differentiate
//returns the commit wth sha, message
export const snapshot = (projectId, message = 'Project Snapshot', rollup = {}) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(!message || typeof message === 'string', 'optional message for snapshot must be a string');

  const stringified = JSON.stringify({ message, rollup });
  const url = dataApiPath(`${projectId}/commit`);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(commit => {
      const { sha } = commit;
      noteSave(projectId, sha);
      return commit;
    })
    .catch(err => {
      noteFailure(projectId, err);
      return Promise.reject(err);
    });
};

export const deleteProject = (projectId) => {
  invariant(projectId, 'Project ID required to delete');

  const url = dataApiPath(`${projectId}`);

  return rejectingFetch(url, headersDelete())
    .then(resp => resp.json());
};

/***** loading / saving - not rollups *****/

//Promise
// returns object {
//   components : { <blockId> : <block> } //including the parent requested
//   options: { <blockId> : <block> }
// }
export const loadBlock = (blockId, projectId, withContents = false) => {
  invariant(projectId, 'Project ID is required');
  invariant(blockId, 'Block ID is required');

  if (withContents === true) {
    return infoQuery('contents', blockId, projectId);
  }

  const url = dataApiPath(`${projectId}/${blockId}`);

  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};
