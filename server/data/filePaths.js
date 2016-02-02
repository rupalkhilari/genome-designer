import path from 'path';
import invariant from 'invariant';

const makePath = (...paths) => {
  return path.resolve(__dirname, ...paths);
};

export const sequencePath = 'sequence';
export const manifestPath = 'manifest.json';

//All files are put in the storage folder (until platform comes along)
export const createStorageUrl = (...urls) => makePath('../../storage/', ...urls);

export const createProjectPath = (projectId, ...rest) => {
  invariant(projectId, 'Project ID required');
  return createStorageUrl(projectId, ...rest);
};

export const createProjectManifestPath = (projectId) => {
  invariant(projectId, 'Project ID required');
  return createProjectPath(projectId, manifestPath);
};

export const createBlockPath = (blockId, projectId, ...rest) => {
  invariant(blockId, 'Block ID required');
  //future, may automatically fetch projectId somehow
  invariant(projectId, 'Project ID required');

  return createStorageUrl(projectId, blockId, ...rest);
};

export const createBlockManifestPath = (blockId, projectId) => {
  invariant(blockId, 'Block ID required');
  return createBlockPath(blockId, projectId, manifestPath);
};

export const createBlockSequencePath = (blockId, projectId) => {
  invariant(blockId, 'Block ID required');
  return createBlockPath(blockId, projectId, sequencePath);
};
