import uuid from 'node-uuid';
import fetch from 'isomorphic-fetch';
import invariant from 'invariant';
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

//let this get flashed in
let user = {};

export const getUserInfo  = () => {
  return Object.assign({}, user);
};

//future - dont expose this
export const setUserInfo = () => {
  
};

const headersGet = () => ({
  method: 'GET',
  credentials: 'include',
});

const headersPost = (body, mimeType = 'application/json') => ({
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': mimeType,
  },
  body,
});

const headersPut = (body, mimeType = 'application/json') => ({
  method: 'PUT',
  credentials: 'include',
  headers: {
    'Content-Type': mimeType,
  },
  body,
});

const headersDelete = () => ({
  method: 'DELETE',
  credentials: 'include',
});

/*************************
 Authentication API
 *************************/

// login with email and password and set the sessionKey (cookie) for later use
export const login = (user, password) => {
  var body = {
    email: user,
    password: password,
  };

  var fetchOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  };

  return fetch(serverRoot + `auth/login`, fetchOptions)
    .then(resp => resp.json())
    .then(json => {
      user = {
        userid: json.uuid,
        email: json.email,
        firstName: json.firstName,
        lastName: json.lastName,
      };
    })
    .catch(function (e) {
      console.log('fetch login error', e);
      throw e;
    });
};

//todo - rewrite
// use established sessionKey to get the user object
export const getUser = () => {
  var headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Cookie', sessionKey);

  var fetchOptions = {
    method: 'GET',
    headers: headers,
    credentials: "same-origin"
  };

  return fetch(serverRoot + `auth/current-user`, fetchOptions)
    .then(resp => {
      return resp.json();
    }).catch(function (e) {
      console.log('fetch user error', e);
      throw e;
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
    .then(resp => resp.json());
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

  const stringified = JSON.stringify({message});
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

  return fetch(url, headersGet())
    .then((resp) => resp.text());
};

export const writeSequence = (md5, sequence, blockId) => {
  const url = getSequenceUrl(md5, blockId);
  const stringified = JSON.stringify({sequence});

  return fetch(url, headersPost(stringified));
};

/*************************
 File API
 *************************/

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
  try {
    const stringified = JSON.stringify(inputs);
    return fetch(computePath(`${id}`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const exportBlock = (id, inputs) => {
  try {
    const stringified = JSON.stringify(inputs);
    return fetch(exportPath(`block/${id}`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const exportProject = (id, inputs) => {
  try {
    const stringified = JSON.stringify(inputs);
    return fetch(exportPath(`project/${id}`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const importBlock = (id, input) => {
  try {
    return fetch(importPath(`block/${id}`), headersPost(JSON.stringify({text: input})));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const importProject = (id, input) => {
  try {
    return fetch(importPath(`project/${id}`), headersPost(JSON.stringify({text: input})));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const search = (id, inputs) => {
  try {
    const stringified = JSON.stringify(inputs);
    return fetch(searchPath(`${id}`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

export const getManifests = (id) => {
  try {
    return fetch(serverRoot + id + '/manifests', headersGet());
  } catch (err) {
    return Promise.reject('no such extension category: ' + id);
  }
};
