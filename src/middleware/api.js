import uuid from 'node-uuid';
import 'isomorphic-fetch';

const apiPath = (path) => '/api/' + path;

export const readFile = (fileName) => {
  return fetch(apiPath(`file/${fileName}`));
};

// if contents === null, then the file is deleted
// Set contents to '' to empty the file
export const writeFile = (fileName = uuid.v4(), contents) => {
  const filePath = apiPath(`file/${fileName}`);

  if (contents === null) {
    return fetch(filePath, {
      method: 'DELETE',
    });
  }

  return fetch(filePath, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: contents,
  });
};
