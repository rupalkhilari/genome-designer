import uuid from 'node-uuid';
import 'isomorphic-fetch';

const apiPath = (path) => '/api/' + path;

export const readFile = (fileName) => {
  return fetch(apiPath(`file/${fileName}`));
};

export const writeFile = (contents, fileName = uuid.v4()) => {
  return fetch(apiPath(`file/${fileName}`), {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: contents,
  });
};
