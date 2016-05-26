import path from 'path';
import invariant from 'invariant';

const makePath = (...paths) => {
  if (process.env.BUILD) {
    return path.resolve(__dirname, '../storage/', ...paths);
  }
  return path.resolve(__dirname, '../../storage/', ...paths);
};

export const filePath = 'file';
export const sequencePath = 'sequence';
export const blockPath = 'blocks';
export const projectPath = 'projects';
export const projectDataPath = 'data';

export const permissionsFilename = 'permissions.json';
export const manifestFilename = 'manifest.json';

//All files are put in the storage folder (until platform comes along)
export const createStorageUrl = (...urls) => {
  const dev = ((process.env.NODE_ENV === 'test') ? 'test/' : '');
  return makePath(dev, ...urls);
};

/***** files *****/

export const createFilePath = (path) => {
  return createStorageUrl(filePath, path);
};

/***** data *****/

//PROJECTS

export const createProjectsDirectoryPath = () => createStorageUrl(projectPath);

export const createProjectPath = (projectId, ...rest) => {
  invariant(projectId, 'Project ID required');
  return createStorageUrl(projectPath, projectId, ...rest);
};

export const createProjectDataPath = (projectId, ...rest) => {
  return createProjectPath(projectId, projectDataPath, ...rest);
};

export const createProjectPermissionsPath = (projectId) => {
  return createProjectPath(projectId, permissionsFilename);
};

export const createProjectManifestPath = (projectId) => {
  return createProjectDataPath(projectId, manifestFilename);
};

export const createBlockDirectoryPath = (projectId, ...rest) => {
  return createProjectDataPath(projectId, blockPath, ...rest);
};

//BLOCKS

export const createBlockPath = (blockId, projectId, ...rest) => {
  invariant(blockId, 'Block ID required');
  //future, may automatically fetch projectId somehow
  invariant(projectId, 'Project ID required');

  return createBlockDirectoryPath(projectId, blockId, ...rest);
};

export const createBlockManifestPath = (blockId, projectId) => {
  return createBlockPath(blockId, projectId, manifestFilename);
};

//SEQUENCE

export const createSequencePath = (md5) => {
  return createStorageUrl(sequencePath, md5);
};
