import { errorDoesNotExist, errorAlreadyExists, errorInvalidModel, errorFileSystem } from '../utils/errors';
import { validateBlock, validateProject } from '../utils/validation';
import * as filePaths from './filePaths';
import * as git from './git';
import fs from 'fs';
import { exec } from 'child_process';
import rimraf from 'rimraf';
import merge from 'lodash.merge';
import mkpath from 'mkpath';
import { fileExists, fileRead, fileWrite, fileDelete, directoryMake, directoryDelete } from '../utils/fileSystem';

//todo - more consistent validation

//todo - support reading a certain version (passing a SHA)

const _projectRead = (projectId) => {
  const path = filePaths.createProjectManifestPath(projectId);
  return fileRead(path);
};

const _blockRead = (blockId, projectId) => {
  const path = filePaths.createBlockManifestPath(blockId, projectId);
  return fileRead(path);
};

const _projectSetup = (projectId) => {
  const projectPath = filePaths.createProjectPath(projectId);
  return directoryMake(projectPath)
    .then(() => git.initialize(projectPath));
};

const _blockSetup = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return directoryMake(blockPath);
};

const _projectWrite = (projectId, project = {}) => {
  const manifestPath = filePaths.createProjectManifestPath(projectId);
  return fileWrite(manifestPath, project);
};

const _blockWrite = (blockId, block = {}, projectId) => {
  const manifestPath = filePaths.createBlockManifestPath(blockId, projectId);
  return fileWrite(manifestPath, block);
};

//todo - specific git commit messages
const _projectCommit = (projectId) => {
  const path = filePaths.createProjectPath(projectId);
  return git.commit(path, 'project commit');
};

const _blockCommit = (blockId, projectId) => {
  const projectPath = filePaths.createProjectPath(projectId);
  return git.commit(projectPath, 'block commit - ' + blockId);
};

//SEARCH

export const findProjectFromBlock = (blockId) => {
  return new Promise((resolve, reject) => {
    const storagePath = filePaths.createStorageUrl();
    exec(`cd ${storagePath} && find . -type d -name ${blockId}`, (err, output) => {
      const lines = output.split('/n');
      if (lines.length === 1) {
        const [ idBlock, idProject ] = lines[0].split('/').reverse();
        resolve(idProject);
      } else {
        reject(null);
      }
    });
  });
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
    .then(() => _projectSetup(projectId))
    .then(() => _projectWrite(projectId, project))
    .then(() => _projectCommit(projectId))
    .then(() => project);
};

export const blockCreate = (blockId, block, projectId) => {
  return blockAssertNew(blockId, projectId)
    .then(() => _blockSetup(blockId, projectId))
    .then(() => _blockWrite(blockId, block, projectId))
    .then(() => _blockCommit(blockId, projectId))
    .then(() => block);
};

//SET (WRITE + MERGE)

export const projectWrite = (projectId, project) => {
  const idedProject = Object.assign({}, project, {id: projectId});

  if (!validateProject(idedProject)) {
    return Promise.reject(errorInvalidModel);
  }

  //create directory etc. if doesn't exist
  return projectExists(projectId)
    .catch(() => _projectSetup(projectId))
    .then(() => _projectWrite(projectId, idedProject))
    .then(() => _projectCommit(projectId))
    .then(() => idedProject);
};

export const projectMerge = (projectId, project) => {
  return projectGet(projectId)
    .then(oldProject => {
      const merged = merge({}, oldProject, project, {id: projectId});
      return projectWrite(projectId, merged);
    });
};

export const blockWrite = (blockId, block, projectId) => {
  const idedBlock = Object.assign({}, block, {id: blockId});

  if (!validateBlock(idedBlock)) {
    return Promise.reject(errorInvalidModel);
  }

  //create directory etc. if doesn't exist
  return blockExists(blockId, projectId)
    .catch(() => _blockSetup(blockId, projectId))
    .then(() => _blockWrite(blockId, idedBlock, projectId))
    .then(() => _blockCommit(blockId, projectId))
    .then(() => idedBlock);
};

export const blockMerge = (blockId, block, projectId) => {
  return blockGet(blockId, projectId)
    .then(oldBlock => {
      const merged = merge({}, oldBlock, block, {id: blockId});
      return blockWrite(blockId, merged, projectId);
    });
};

//DELETE

export const projectDelete = (projectId) => {
  return projectExists(projectId)
    .then(() => {
      const projectPath = filePaths.createProjectPath(projectId);
      return directoryDelete(projectPath);
    })
    .then(() => projectId);
  //no need to commit... its deleted
};

export const blockDelete = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return blockExists(blockId, projectId)
    .then(() => directoryDelete(blockPath))
    .then(() => _projectCommit(projectId))
    .then(() => blockId);
};

//sequence

//TODO  - update block schema to handle routing for sequence file... skip ability to reference

export const sequenceExists = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return fileExists(sequencePath);
};

export const sequenceGet = (blockId, projectId) => {
  return sequenceExists(blockId, projectId)
    .then(path => fileRead(path, false))
    .catch(err => {
      if (err === errorDoesNotExist) {
        //if sequence doesn't exist, check if block exists:
        //  block exists -> null
        //  block DNE -> rejection
        return blockExists(blockId, projectId)
          .then(() => Promise.resolve(null))
          .catch(() => Promise.reject(errorDoesNotExist));
      }
      return Promise.reject(err);
    });
};

//todo - validate sequence
export const sequenceWrite = (blockId, sequence, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return blockExists(blockId, projectId)
    .then(() => fileWrite(sequencePath, sequence, false))
    .then(() => _blockCommit(blockId, projectId))
    .then(() => sequence);
};

export const sequenceDelete = (blockId, projectId) => {
  return sequenceExists(blockId, projectId)
    .then(path => fileDelete(path))
    .then(() => _blockCommit(blockId, projectId));
};
