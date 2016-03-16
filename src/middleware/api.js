import fetch from 'isomorphic-fetch';
import invariant from 'invariant';
import { getItem, setItem } from './localStorageCache';
import merge from 'lodash.merge';
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

//header helpers for fetch

//set default options for testing (jsdom doesn't set cookies on fetch)
let defaultOptions = {};
if (process.env.NODE_ENV === 'test') {
  defaultOptions = { headers: { Cookie: 'sess=mock-auth' } };
}

const headersGet = (overrides) => merge({}, defaultOptions, {
  method: 'GET',
  credentials: 'same-origin',
}, overrides);

const headersPost = (body, overrides) => merge({}, defaultOptions, {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
}, overrides);

const headersPut = (body, overrides) => merge({}, defaultOptions, {
  method: 'PUT',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
}, overrides);

const headersDelete = (overrides) => merge({}, defaultOptions, {
  method: 'DELETE',
  credentials: 'same-origin',
}, overrides);

/*************************
 Authentication API
 *************************/

// login with email and password and set the sessionKey (cookie) for later use
export const login = (user, password) => {
  const body = {
    email: user,
    password: password,
  };
  const stringified = JSON.stringify(body);

  return fetch(serverRoot + `auth/login`, headersPost(stringified))
    .then(resp => resp.json())
    .then(json => {
      if (json.message) {
        return Promise.reject(json);
      }
      return json;
    });
};

export const register = (user) => {
  invariant(user.email && user.password && user.firstName && user.lastName, 'wrong format user');
  const stringified = JSON.stringify(user);
  return fetch(serverRoot + `auth/register`, headersPost(stringified))
    .then(resp => resp.json())
    .then(json => {
      if (json.message) {
        return Promise.reject(json);
      }
      return json;
    });
};

export const forgot = (email) => {
  const body = { email };
  const stringified = JSON.stringify(body);
  return fetch(serverRoot + `auth/forgot-password`, headersPost(stringified))
    .then(resp => resp.json());
};

export const reset = (email, forgotPasswordHash, newPassword) => {
  const body = { email, forgotPasswordHash, newPassword }
  const stringified = JSON.stringify(body);
  return fetch(serverRoot + `auth/reset-password`, headersPost(stringified))
    .then(resp => resp.json());
};

// login with email and password and set the sessionKey (cookie) for later use
export const updateAccount = (payload) => {
  const body = payload;
  const stringified = JSON.stringify(body);

  return fetch(serverRoot + `auth/update-all`, headersPost(stringified))
    .then(resp => resp.json());
};

export const logout = () => {
  return fetch(serverRoot + `auth/logout`, headersGet());
};

// use established sessionKey to get the user object
export const getUser = () => {
  return fetch(serverRoot + `auth/current-user`, headersGet())
    .then(resp => resp.json());
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

  return fetch(url, headersPost(stringified))
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
export const writeFile = (fileName, contents) => {
  invariant(fileName, 'file name is required');

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
