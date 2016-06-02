import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { dataApiPath } from './paths';
import * as instanceCache from '../store/instanceCache';

/******
 save state
 ******/

//track information about saving e.g. time
const saveState = new Map();

const noteSave = (projectId, sha = null) => {
  invariant(projectId, 'must pass project ID');
  const lastState = saveState.get(projectId) || {};

  saveState.set(projectId, Object.assign(lastState, {
    lastSaved: +Date.now(),
    sha,
  }));
};

const noteFailure = (projectId, err) => {
  invariant(projectId, 'must pass project ID');
  const lastState = saveState.get(projectId) || {};

  saveState.set(projectId, Object.assign(lastState, {
    lastFailed: +Date.now(),
    lastErr: err,
  }));
};

export const getProjectSaveState = (projectId) => {
  invariant(projectId, 'must pass project ID');
  const state = saveState.get(projectId) || {};
  const { lastSaved = 0, lastFailed = 0, sha = null, lastErr = null } = state;

  return {
    lastSaved,
    sha,
    lastFailed,
    lastErr,
    saveDelta: +Date.now() - lastSaved,
    saveSuccessful: lastFailed <= lastSaved,
  };
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
      instanceCache.saveRollup(rollup);
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
  if (!instanceCache.isRollupNew(rollup)) {
    return Promise.resolve(null);
  }

  instanceCache.saveRollup(rollup);

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

  if (rollup.project && rollup.blocks) {
    instanceCache.saveRollup(rollup);
  }

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

//todo - remove from cache? impact on undo? this should probably change the route, which would kill undo stack, which is probably not ok.
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
export const loadBlock = (blockId, withContents = false, onlyComponents = false, projectId = 'block') => {
  invariant(projectId, 'Project ID is required');
  invariant(blockId, 'Block ID is required');

  if (withContents === true) {
    if (onlyComponents === true) {
      return infoQuery('components', blockId)
        .then(components => ({
          components,
          options: {},
        }));
    }
    return infoQuery('contents', blockId);
  }

  const url = dataApiPath(`${projectId}/${blockId}`);

  return rejectingFetch(url, headersGet())
    .then(resp => resp.json());
};
