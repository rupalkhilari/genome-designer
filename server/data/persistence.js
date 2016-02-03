import { errorDoesNotExist, errorAlreadyExists, errorInvalidModel, errorFileSystem } from '../utils/errors';
import { validateBlock, validateProject } from '../utils/validation';
import * as filePaths from './filePaths';
import * as git from './git';
import fs from 'fs';
import rimraf from 'rimraf';
import merge from 'lodash.merge';
import mkpath from 'mkpath';
import { fileExists, fileRead, fileWrite, fileDelete, directoryMake, directoryDelete } from '../utils/fileSystem';

const _projectRead = (projectId) => {
  const path = filePaths.createProjectManifestPath(projectId);
  return fileRead(path);
};

const _blockRead = (blockId, projectId) => {
  const path = filePaths.createBlockManifestPath(blockId, projectId);
  return fileRead(path);
};

const _projectSetupDirectory = (projectId) => {
  const projectPath = filePaths.createProjectPath(projectId);
  return directoryMake(projectPath)
    .then(() => git.initialize(projectPath));
};

const _blockSetupDirectory = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return directoryMake(blockPath);
};

const _projectWrite = (projectId, project) => {
  const manifestPath = filePaths.createProjectManifestPath(projectId);
  return fileWrite(manifestPath, project);
};

const _blockWrite = (blockId, block, projectId) => {
  const manifestPath = filePaths.createProjectManifestPath(blockId, projectId);
  return fileWrite(manifestPath, block);
};

//todo - specific git commit messages
const _projectCommit = (projectId) => {
  const path = filePaths.createProjectPath(projectId);
  return git.commit(path);
};

const _blockCommit = (blockId, projectId) => {
  const projectPath = filePaths.createProjectPath(projectId);
  return git.commit(projectPath);
};

//EXISTS

export const projectExists = (projectId) => {
  const path = filePaths.createProjectManifestPath(projectId);
  return fileExists(path);
};

export const blockExists = (blockId, projectId) => {
  const path = filePaths.createBlockManifestPath(blockId, projectId);
  return fileExists(path);
};

const projectAssertNew = (projectId) => {
  return projectExists(projectId)
    .then(() => Promise.reject(errorAlreadyExists))
    .catch((err) => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(projectId);
      }
      return Promise.reject(err);
    });
};

const blockAssertNew = (blockId, projectId) => {
  return blockExists(blockId, projectId)
    .then(() => Promise.reject(errorAlreadyExists))
    .catch((err) => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(blockId);
      }
      return Promise.reject(err);
    });
};

//GET

export const projectGet = (projectId) => {
  return projectExists(projectId)
    .then(() => _projectRead(projectId))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(null);
      }
      return Promise.reject(err);
    });
};

export const blockGet = (blockId, projectId) => {
  return blockExists(blockId, projectId)
    .then(() => _blockRead(blockId, projectId))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(null);
      }
      return Promise.reject(err);
    });
};

//CREATE

export const projectCreate = (projectId, project) => {
  return projectAssertNew(projectId)
    .then(() => _projectSetupDirectory(projectId))
    .then(() => _projectWrite(projectId, project))
    .then(() => _projectCommit(projectId));
};

export const blockCreate = (blockId, projectId, block) => {
  return blockAssertNew(blockId, projectId)
    .then(() => _blockSetupDirectory(blockId, projectId))
    .then(() => _blockWrite(blockId, block, projectId))
    .then(() => _blockCommit(blockId, projectId));
};

//SET (WRITE + MERGE)

export const projectWrite = (projectId, project) => {
  if (!validateProject(project)) {
    return Promise.reject(errorInvalidModel);
  }

  //create directory etc. if doesn't exist
  return projectExists(projectId)
    .catch(() => _projectSetupDirectory(projectId))
    .then(() => _projectWrite(projectId, project))
    .then(() => _projectCommit(projectId))
    .then(() => project);
};

export const projectMerge = (projectId, project) => {
  return projectGet(projectId)
    .then(oldProject => {
      const merged = merge({}, oldProject, project);
      return projectWrite(projectId, merged);
    });
};

export const blockWrite = (blockId, block, projectId) => {
  if (!validateBlock(block)) {
    return Promise.reject(errorInvalidModel);
  }

  //create directory etc. if doesn't exist
  return blockExists(blockId, projectId)
    .catch(() => _blockSetupDirectory(blockId, projectId))
    .then(() => _blockWrite(blockId, block, projectId))
    .then(() => _blockCommit(blockId, projectId))
    .then(() => block);
};

export const blockMerge = (blockId, block, projectId) => {
  return blockGet(projectId)
    .then(oldBlock => {
      const merged = merge({}, oldBlock, block);
      return blockWrite(blockId, merged, projectId);
    });
};

//DELETE

export const projectDelete = (projectId) => {
  return projectExists(projectId)
    .then(() => {
      const projectPath = filePaths.createProjectPath(projectId);
      return directoryDelete(projectPath);
    });
  //no need to commit... its deleted
};

export const blockDelete = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return blockExists(blockId, projectId)
    .then(() => directoryDelete(blockPath))
    .then(() => _projectCommit(projectId));
};

//sequence

export const sequenceExists = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return fileExists(sequencePath);
};

export const sequenceGet = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return sequenceExists(blockId, projectId)
    .then(() => fileRead(sequencePath))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(null);
      }
      return Promise.reject(err);
    });
};

export const sequenceWrite = (blockId, sequence, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return sequenceExists(blockId, projectId)
    .then(() => fileWrite(sequencePath, sequence))
    .then(() => _blockCommit(blockId, projectId));
};

export const sequenceDelete = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return sequenceExists(blockId, projectId)
    .then(() => fileDelete(sequencePath))
    .then(() => _blockCommit(blockId, projectId));
};
