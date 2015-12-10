import uuid from 'node-uuid';
import 'isomorphic-fetch';
import invariant from '../utils/environment/invariant';
import BlockDefinition from '../schemas/Block';

/*************************
 Utils
 *************************/

const serverRoot = 'http://localhost:3000'; //fetch only supports absolute paths

const apiPath = (path) => serverRoot + '/api/' + path;
const sessionKey = 'testingStub';

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
  return fetch(apiPath(`login?user=${user}&password=${password}`), headersGet())
    .then(resp => resp.json());
};

export const retrieveBlock = (id) => {
  return fetch(apiPath(`block/${id}`), headersGet())
    .then(resp => resp.json());
};

export const saveBlock = (block) => {
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);
  const { id } = block;
  const stringified = JSON.stringify(block);

  return fetch(apiPath(`block/${id}`), headersPut(stringified));
};

export const readFile = (fileName) => {
  return fetch(apiPath(`file/${fileName}`));
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
