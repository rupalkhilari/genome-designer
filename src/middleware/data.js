import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { dataApiPath } from './paths';
import Project from '../models/Project';

/******
 caching + checks
 ******/

//unforunately, the reducers run after the promise resolutions in these loading / saving functions, so project.version will increment immediately after the roll is set here, but that is ok - we handle that check below in isRollSame.

//project rollup cache
//track the last versions saved so we aren't saving over and over
const rollMap = new Map();

//compares two rollups for effective changes
const isRollSame = (oldRoll, newRoll) => {
  if (!oldRoll || !newRoll) return false;
  //check projects same
  if (!Project.compare(oldRoll.project, newRoll.project)) return false;
  //check all blocks same
  return oldRoll.blocks.every(oldBlock => {
    const analog = newRoll.blocks.find(newBlock => newBlock.id === oldBlock.id);
    return analog && analog === oldBlock;
  });
};

/******
 API requests
 ******/

/***** info query - low level API call *****/

export const infoQuery = (type, detail) => {
  const url = dataApiPath(`info/${type}${detail ? `/${detail}` : ''}`);
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
  const url = dataApiPath(`projects/${projectId}`);
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json())
    .then(rollup => {
      rollMap.set(projectId, rollup);
      return rollup;
    });
};

//expects a rollup
//autosave
//returns the commit with sha, message, or null if no need to save
export const saveProject = (projectId, rollup) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(rollup, 'Rollup is required to save');
  invariant(rollup.project && Array.isArray(rollup.blocks), 'rollup in wrong form');

  //check if project is new, and save if it is
  const oldRoll = rollMap.get(projectId);
  if (isRollSame(oldRoll, rollup)) {
    return Promise.resolve(null);
  }

  const url = dataApiPath(`projects/${projectId}`);
  const stringified = JSON.stringify(rollup);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(commitInfo => {
      rollMap.set(projectId, rollup);
      return commitInfo;
    });
};

//expects a rollup
//explicit, makes a git commit with special message to differentiate
//returns the commit wth sha, message
export const snapshot = (projectId, message = 'Project Snapshot', rollup = {}) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(!message || typeof message === 'string', 'optional message for snapshot must be a string');

  const stringified = JSON.stringify({ message, rollup });
  const url = dataApiPath(`${projectId}/commit`);

  return rejectingFetch(url, headersPost(stringified))
    .then(resp => resp.json())
    .then(commitInfo => {
      rollMap.set(projectId, rollup);
      return commitInfo;
    });
};

/***** loading / saving - not rollups *****/

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
