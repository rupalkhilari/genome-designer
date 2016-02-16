import path from 'path';
import invariant from 'invariant';

const relativeStoragePath = '../../storage/';

const makePath = (...paths) => {
  return path.resolve(__dirname, relativeStoragePath, ...paths);
};

export const sequencePath = 'sequence';
export const manifestPath = 'manifest.json';

//All files are put in the storage folder (until platform comes along)
export const createStorageUrl = (...urls) => {
  const dev = ((process.env.NODE_ENV === 'test') ? 'test/' : '');
  return makePath(dev, ...urls);
};

/***** files *****/

export const createFilePath = (path) => {
  return createStorageUrl('file', path);
};

/***** data *****/

//PROJECTS

export const createProjectPath = (projectId, ...rest) => {
  invariant(projectId, 'Project ID required');
  return createStorageUrl(projectId, ...rest);
};

export const createProjectManifestPath = (projectId) => {
  return createProjectPath(projectId, manifestPath);
};

//BLOCKS

export const createBlockPath = (blockId, projectId, ...rest) => {
  invariant(blockId, 'Block ID required');
  //future, may automatically fetch projectId somehow
  invariant(projectId, 'Project ID required');

  return createStorageUrl(projectId, blockId, ...rest);
};

export const createBlockManifestPath = (blockId, projectId) => {
  return createBlockPath(blockId, projectId, manifestPath);
};

//SEQUENCE

//todo - should this be affected by whether in test enviroment or not?
export const createSequencePath = (md5) => {
  return createStorageUrl(sequencePath, md5);
};
