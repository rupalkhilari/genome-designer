import path from 'path';
import invariant from 'invariant';

const makePath = (...paths) => {
  return path.resolve(__dirname, ...paths);
};

export const sequencePath = 'sequence';
export const manifestPath = 'manifest.json';

//All files are put in the storage folder (until platform comes along)
export const createStorageUrl = (...urls) => makePath('./storage/', ...urls);

export const createProjectPath = (projectId, ...rest) => {
  return createStorageUrl(projectId, ...rest);
};

export const createBlockPath = (projectId, blockId, ...rest) => {
  invariant(blockId, 'Block ID required');
  //future, may automatically fetch projectId somehow
  invariant(projectId, 'Project ID required');

  return createStorageUrl(projectId, blockId, ...rest);
};

export const createProjectManifestPath = (projectId) => {
  return createProjectPath(projectId, manifestPath);
};

export const createBlockManifestPath = (projectId, blockId) => {
  return createBlockPath(projectId, blockId, manifestPath);
};

export const createBlockSequencePath = (projectId, blockId) => {
  return createBlockPath(projectId, blockId, sequencePath);
};
