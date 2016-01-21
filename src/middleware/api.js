import uuid from 'node-uuid';
import 'isomorphic-fetch';
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

const execPath = (path) => serverRoot + 'exec/' + path;
export const apiPath = (path) => serverRoot + 'api/' + path;

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

const headersPost = (body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    sessionkey: sessionKey,
  },
  body,
});

const headersPut = (body) => ({
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
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
 Server Communication
 *************************/

export const login = (user, password) => {
  return fetch(serverRoot + `login?user=${user}&password=${password}`, headersGet())
    .then(resp => resp.json())
    .then(json => {
      sessionKey = json.sessionkey;
      return sessionKey;
    });
};

export const createBlock = (block) => {
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);
  try {
    const stringified = JSON.stringify(block);
    return fetch(apiPath(`block/`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

export const retrieveBlock = (id) => {
  return fetch(apiPath(`block/${id}`), headersGet())
    .then(resp => resp.json());
};

export const saveBlock = (block) => {
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);
  try {
    const stringified = JSON.stringify(block);
    return fetch(apiPath(`block/${block.id}`), headersPut(stringified));
  } catch (err) {
    return Promise.reject('error stringifying block');
  }
};

export const saveProject = (project) => {
  invariant(ProjectDefinition.validate(project), 'Project does not pass validation: ' + project);
  try {
    const stringified = JSON.stringify(project);
    return fetch(apiPath(`project/${project.id}`), headersPut(stringified));
  } catch (err) {
    return Promise.reject('error stringifying project');
  }
};

export const runExtension = (id, inputs) => {
  try {
    const stringified = JSON.stringify(inputs);
    return fetch(execPath(`${id}`), headersPost(stringified));
  } catch (err) {
    return Promise.reject('error stringifying input object');
  }
};

//returns a fetch object, for you to parse yourself (doesnt automatically convert to json)
export const readFile = (fileName) => {
  return fetch(apiPath(`file/${fileName}`), headersGet());
};

// if contents === null, then the file is deleted
// Set contents to '' to empty the file
export const writeFile = (fileName = uuid.v4(), contents) => {
  const filePath = apiPath(`file/${fileName}`);

  if (contents === null) {
    return fetch(filePath, headersDelete());
  }

  return fetch(filePath, headersPost(contents));
};
