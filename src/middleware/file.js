import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersDelete } from './headers';
import { fileApiPath } from './paths';

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
