import rejectingFetch from './rejectingFetch';
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

const authFetch = (...args) => {
  return rejectingFetch(...args)
    .then(resp => resp.json())
    .then(json => {
      if (json.message) {
        return Promise.reject(json);
      }
      return json;
    });
};

// login with email and password and set the sessionKey (cookie) for later use
export const login = (user, password) => {
  const body = {
    email: user,
    password: password,
  };
  const stringified = JSON.stringify(body);

  return authFetch(serverRoot + `auth/login`, headersPost(stringified));
};

export const register = (user) => {
  invariant(user.email && user.password && user.firstName && user.lastName, 'wrong format user');
  const stringified = JSON.stringify(user);

  return authFetch(serverRoot + `auth/register`, headersPost(stringified));
};

export const forgot = (email) => {
  const body = { email };
  const stringified = JSON.stringify(body);

  return authFetch(serverRoot + `auth/forgot-password`, headersPost(stringified));
};

export const reset = (email, forgotPasswordHash, newPassword) => {
  const body = { email, forgotPasswordHash, newPassword };
  const stringified = JSON.stringify(body);

  return authFetch(serverRoot + `auth/reset-password`, headersPost(stringified));
};

// update account
export const updateAccount = (payload) => {
  const body = payload;
  const stringified = JSON.stringify(body);

  return authFetch(serverRoot + `auth/update-all`, headersPost(stringified));
};

export const logout = () => {
  return rejectingFetch(serverRoot + `auth/logout`, headersGet());
};

// use established sessionKey to get the user object
export const getUser = () => {
  return authFetch(serverRoot + `auth/current-user`, headersGet());
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

    return rejectingFetch(url, headersPut(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

export const loadBlock = (blockId, projectId = 'block') => {
  invariant(projectId, 'Project ID is required');
  invariant(blockId, 'Block ID is required');

  const url = dataApiPath(`${projectId}/${blockId}`);

  return rejectingFetch(url, headersGet())
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

    return rejectingFetch(url, headers(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

//returns metadata of projects
export const listProjects = () => {
  const url = dataApiPath('projects');
  return rejectingFetch(url, headersGet())
    .then(resp => resp.json())
    .then(projects => projects.filter(project => !!project));
};

//saves just the project manifest to file system
export const saveProjectManifest = (project) => {
  invariant(ProjectDefinition.validate(project), 'Project does not pass validation: ' + project);

  try {
    const stringified = JSON.stringify(project);
    const url = dataApiPath(`${project.id}`);

    return rejectingFetch(url, headersPost(stringified))
      .then(resp => resp.json());
  } catch (err) {
    return Promise.reject('error stringifying project');
  }
};

//returns a rollup
export const loadProject = (projectId) => {
  const url = dataApiPath(`projects/${projectId}`);
  return rejectingFetch(url, headersGet())
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

  return rejectingFetch(url, headersPost(stringified));
};

//explicit, makes a git commit
//returns the commit
export const snapshot = (projectId, rollup, message = 'Project Snapshot') => {
  invariant(projectId, 'Project ID required to snapshot');
  invariant(!message || typeof message === 'string', 'optional message for snapshot must be a string');

  const stringified = JSON.stringify({ message });
  const url = dataApiPath(`${projectId}/commit`);

  return rejectingFetch(url, headersPost(stringified))
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

  return rejectingFetch(url, headersGet())
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

  return rejectingFetch(url, headersPost(stringified));
};

/*************************
 File API
 *************************/

//note - you need to unpack the responses yourself (e.g. resp => resp.json())

//returns a fetch object, for you to parse yourself (doesnt automatically convert to json)
export const readFile = (fileName) => {
  return rejectingFetch(fileApiPath(fileName), headersGet());
};

// if contents === null, then the file is deleted
// Set contents to '' to empty the file
export const writeFile = (fileName, contents) => {
  invariant(fileName, 'file name is required');

  const filePath = fileApiPath(fileName);

  if (contents === null) {
    return rejectingFetch(filePath, headersDelete());
  }

  return rejectingFetch(filePath, headersPost(contents));
};

/**************************
 Running extensions
 **************************/
//todo - these should be in their own file...

export const computeWorkflow = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return rejectingFetch(computePath(`${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const exportBlock = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return rejectingFetch(exportPath(`block/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const exportProject = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return rejectingFetch(exportPath(`project/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const importBlock = (id, input) => {
  const stringified = JSON.stringify({ text: input });
  return rejectingFetch(importPath(`block/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const importProject = (id, input) => {
  const stringified = JSON.stringify({ text: input });
  return rejectingFetch(importPath(`project/${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const search = (id, inputs) => {
  const stringified = JSON.stringify(inputs);
  return rejectingFetch(searchPath(`${id}`), headersPost(stringified))
    .then(resp => resp.json());
};

export const getExtensionsInfo = () => {
  return rejectingFetch(serverRoot + 'extensions/list', headersGet())
    .then(resp => resp.json());
};
