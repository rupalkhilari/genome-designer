import uuid from 'node-uuid';
import 'isomorphic-fetch';
import invariant from '../utils/environment/invariant';
import BlockDefinition from '../schemas/Block';

/*************************
 Utils
 *************************/

const apiPath = (path) => '/api/' + path;

const headersPost = (body) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body,
});

const headersDelete = () => ({
  method: 'DELETE',
});

/*************************
 Server Communication
 *************************/

export const retrieveBlock = (id) => {
  return fetch(apiPath(`blocks/${id}`));
};

export const saveBlock = (block) => {
  invariant(BlockDefinition.validate(block), 'Block does not pass validation: ' + block);
  const { id } = block;
  const stringified = JSON.stringify(block);

  return fetch(apiPath(`blocks/${id}`), headersPost(stringified));
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
