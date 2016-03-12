import uuid from 'node-uuid';
import fetch from 'isomorphic-fetch';
import invariant from 'invariant';
import { getItem, setItem } from './localStorageCache';
import ProjectDefinition from '../schemas/Project';
import BlockDefinition from '../schemas/Block';

/*************************
 Utils
 *************************/

//fetch only supports absolute paths
//include a check for tests, hardcode for now
const serverRoot = (/http/gi).test(window.location.protocol) ?
  `${window.location.protocol}//${window.location.host}/` :
  'http://localhost:3000/';

//paths related to extensions
export const computePath = (id) => serverRoot + 'compute/' + id;
export const importPath = (id) => serverRoot + 'import/' + id;
export const exportPath = (id) => serverRoot + 'export/' + id;
export const searchPath = (id) => serverRoot + 'search/' + id;

//main API
export const dataApiPath = (path) => serverRoot + 'data/' + path;
export const fileApiPath = (path) => serverRoot + 'file/' + path;

//hack - set testing stub from start for now so all requests work
let sessionKey = 'testingStub';

export const getSessionKey = () => {
  return sessionKey;
};

const headersGet = () => ({
  method: 'GET',
  headers: {
    sessionkey: sessionKey,
  },
});

const headersPost = (body, mimeType = 'application/json') => ({
  method: 'POST',
  headers: {
    'Content-Type': mimeType,
    sessionkey: sessionKey,
  },
  body,
});

const headersPut = (body, mimeType = 'application/json') => ({
  method: 'PUT',
  headers: {
    'Content-Type': mimeType,
    sessionkey: sessionKey,
  },
  body,
});

const headersDelete = () => ({
  method: 'DELETE',
  headers: {
    sessionkey: sessionKey,
  },
});

/*************************
 Authentication API
 *************************/

export const login = (user, password) => {
  return fetch(serverRoot + `auth/login?user=${user}&password=${password}`, headersGet())
    .then(resp => resp.json())
    .then(json => {
      sessionKey = json.sessionkey;
      return sessionKey;
    });
};

/*************************
 Data API
 *************************/

export const createBlock = (block, projectId) => {
  invariant(projectId, 'Project ID is required');
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);

  try {
    const stringified = JSON.stringify(block);
    const url = dataApiPath(`${projectId}/${block.id}`);

    return fetch(url, headersPut(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

export const loadBlock = (blockId, projectId = 'block') => {
  invariant(projectId, 'Project ID is required');
  invariant(blockId, 'Block ID is required');

  const url = dataApiPath(`${projectId}/${blockId}`);

  return fetch(url, headersGet())
    .then(resp => resp.json());
};

//in general, youll probably want to save the whole project? but maybe not.
export const saveBlock = (block, projectId, overwrite = false) => {
  invariant(projectId, 'Project ID is required');
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);

  try {
    const stringified = JSON.stringify(block);
    const url = dataApiPath(`${projectId}/${block.id}`);
    const headers = !!overwrite ? headersPut : headersPost;

    return fetch(url, headers(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

//returns metadata of projects
export const listProjects = () => {
  const url = dataApiPath('projects');
  return fetch(url, headersGet())
    .then(resp => resp.json())
    .then(projects => projects.filter(project => !!project));
};

//saves just the project manifest to file system
export const saveProjectManifest = (project) => {
  invariant(ProjectDefinition.validate(project), 'Project does not pass validation: ' + project);

  try {
    const stringified = JSON.stringify(project);
    const url = dataApiPath(`${project.id}`);

    return fetch(url, headersPost(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying project');
  }
};

//returns a rollup
export const loadProject = (projectId) => {
  const url = dataApiPath(`projects/${projectId}`);
  return fetch(url, headersGet())
    .then(resp => resp.json());
};

//expects a rollup
//autosave
export const saveProject = (projectId, rollup) => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(rollup, 'Rollup is required to save');
  invariant(rollup.project && Array.isArray(rollup.blocks), 'rollup in wrong form');

  const url = dataApiPath(`projects/${projectId}`);
  const stringified = JSON.stringify(rollup);

  return fetch(url, headersPost(stringified));
};

//explicit, makes a git commit
//returns the commit
export const snapshot = (projectId, rollup, message = 'Project Snapshot') => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(!message || typeof message === 'string', 'optional message for snapshot must be a string');

  const stringified = JSON.stringify({ message });
  const url = dataApiPath(`${projectId}/commit`);

  return saveProject(projectId, rollup)
    .then(() => fetch(url, headersPost(stringified)))
    .then(resp => resp.json());
};

/*************************
 Sequence API
 *************************/

//future - support format
const getSequenceUrl = (md5, blockId, format) => dataApiPath(`sequence/${md5}` + (!!blockId ? `/${blockId}` : ''));

export const getSequence = (md5, format) => {
  const url = getSequenceUrl(md5, undefined, format);

  const cached = getItem(md5);
  if (cached) {
    return Promise.resolve(cached);
  }

  return fetch(url, headersGet())
    .then((resp) => resp.text())
    .then(sequence => {
      setItem(md5, sequence);
      return sequence;
    });
};

export const writeSequence = (md5, sequence, blockId) => {
  const url = getSequenceUrl(md5, blockId);
  const stringified = JSON.stringify({ sequence });

  setItem(md5, sequence);

  return fetch(url, headersPost(stringified));
};

/*************************
 File API
 *************************/

//note - you need to unpack the responses yourself (e.g. resp => resp.json())

//returns a fetch object, for you to parse yourself (doesnt automatically convert to json)
export const readFile = (fileName) => {
  return fetch(fileApiPath(fileName), headersGet());
};

// if contents === null, then the file is deleted
// Set contents to '' to empty the file
export const writeFile = (fileName = uuid.v4(), contents) => {
  const filePath = fileApiPath(fileName);

  if (contents === null) {
    return fetch(filePath, headersDelete());
  }

  return fetch(filePath, headersPost(contents));
};

/**************************
 Running extensions
 **************************/
//todo - these should be in their own file...

export const computeWorkflow = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return fetch(computePath(`${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const exportBlock = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return fetch(exportPath(`block/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const exportProject = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return fetch(exportPath(`project/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const importBlock = (id, input) => {
  const stringified = JSON.stringify({ text: input });
  return fetch(importPath(`block/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const importProject = (id, input) => {
  const stringified = JSON.stringify({ text: input });
  return fetch(importPath(`project/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const search = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return fetch(searchPath(`${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const getExtensionsInfo = () => {
  return fetch(serverRoot + 'extensions/list', headersGet())
    .then(resp => resp.json());
};
