import { errorDoesNotExist, errorAlreadyExists, errorInvalidModel, errorVersioningSystem } from '../utils/errors';
import { validateBlock, validateProject } from '../utils/validation';
import * as filePaths from './../utils/filePaths';
import * as versioning from './versioning';
import * as commitMessages from './commitMessages';
import path from 'path';
import merge from 'lodash.merge';
import { fileExists, fileRead, fileWrite, fileDelete, directoryMake, directoryDelete } from '../utils/fileSystem';

const _projectExists = (projectId, sha) => {
  const manifestPath = filePaths.createProjectManifestPath(projectId);
  const projectPath = filePaths.createProjectPath(projectId);

  if (!sha) {
    return fileExists(manifestPath);
  }
  return versioning.versionExists(projectPath, sha);
};

const _blockExists = (blockId, projectId, sha) => {
  const manifestPath = filePaths.createBlockManifestPath(blockId, projectId);
  const projectPath = filePaths.createProjectPath(projectId);
  const relativePath = path.relative(projectPath, manifestPath);

  if (!sha) {
    return fileExists(manifestPath);
  }
  return versioning.versionExists(projectPath, sha, relativePath);
};

const _projectRead = (projectId, sha) => {
  const manifestPath = filePaths.createProjectManifestPath(projectId);
  const projectPath = filePaths.createProjectPath(projectId);
  const relativePath = path.relative(projectPath, manifestPath);

  if (!sha) {
    return fileRead(manifestPath);
  }

  return versioning.checkout(projectPath, relativePath, sha)
    .then(string => JSON.parse(string));
};

const _blockRead = (blockId, projectId, sha) => {
  const manifestPath = filePaths.createBlockManifestPath(blockId, projectId);
  const projectPath = filePaths.createProjectPath(projectId);
  const relativePath = path.relative(projectPath, manifestPath);

  if (!sha) {
    return fileRead(manifestPath);
  }

  return versioning.checkout(projectPath, relativePath, sha)
    .then(string => JSON.parse(string));
};

const _projectSetup = (projectId) => {
  const projectPath = filePaths.createProjectPath(projectId);
  return directoryMake(projectPath)
    .then(() => versioning.initialize(projectPath));
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

//expects a well-formed commit message from commitMessages.js
const _projectCommit = (projectId, message) => {
  const path = filePaths.createProjectPath(projectId);
  const commitMessage = !message ? commitMessages.messageProject(projectId) : message;
  return versioning.commit(path, commitMessage);
};

//expects a well-formed commit message from commitMessages.js
const _blockCommit = (blockId, projectId, message) => {
  const projectPath = filePaths.createProjectPath(projectId);
  const commitMessage = !message ? commitMessages.messageBlock(blockId) : message;
  return versioning.commit(projectPath, commitMessage);
};

//SAVE

//e.g. autosave
export const projectSave = (projectId, messageAddition) => {
  const message = commitMessages.messageSave(projectId, messageAddition);
  return _projectCommit(projectId, message);
};

//explicit save aka 'snapshot'
export const projectSnapshot = (projectId, messageAddition) => {
  const message = commitMessages.messageSnapshot(projectId, messageAddition);
  return _projectCommit(projectId, message);
};

//EXISTS

export const projectExists = (projectId, sha) => {
  return _projectExists(projectId, sha);
};

export const blockExists = (blockId, projectId, sha) => {
  return _blockExists(blockId, projectId, sha);
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
//resolve with null if does not exist

export const projectGet = (projectId, sha) => {
  return projectExists(projectId, sha)
    .then(() => _projectRead(projectId, sha))
    .catch(err => {
      if (err === errorDoesNotExist && !sha) {
        return Promise.resolve(null);
      }
      //let the versioning error fall through, or uncaught error
      return Promise.reject(err);
    });
};

export const blockGet = (blockId, projectId, sha) => {
  return blockExists(blockId, projectId, sha)
    .then(() => _blockRead(blockId, projectId, sha))
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
    //.then(() => _projectCommit(projectId, commitMessages.messageCreateProject(projectId)))
    .then(() => project);
};

export const blockCreate = (blockId, block, projectId) => {
  return blockAssertNew(blockId, projectId)
    .then(() => _blockSetup(blockId, projectId))
    .then(() => _blockWrite(blockId, block, projectId))
    //.then(() => _blockCommit(blockId, projectId, commitMessages.messageCreateBlock(blockId)))
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
    //.then(() => _projectCommit(projectId))
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
    //.then(() => _blockCommit(blockId, projectId))
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
  //todo - do we want to keep it around? Probably want to be able to reference it later...
};

export const blockDelete = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return blockExists(blockId, projectId)
    .then(() => directoryDelete(blockPath))
    //.then(() => _projectCommit(projectId, commitMessages.messageDeleteBlock(blockId)))
    .then(() => blockId);
};

//sequence

export const sequenceExists = (md5) => {
  const sequencePath = filePaths.createSequencePath(md5);
  return fileExists(sequencePath);
};

export const sequenceGet = (md5) => {
  return sequenceExists(md5)
    .then(path => fileRead(path, false));
};

//blockId and projectId optional, will create commit if provided
export const sequenceWrite = (md5, sequence, blockId, projectId) => {
  const sequencePath = filePaths.createSequencePath(md5);
  return fileWrite(sequencePath, sequence, false)
    //.then(() => {
    //  if (blockId && projectId) {
    //    return _blockCommit(blockId, projectId, commitMessages.messageSequenceUpdate(blockId, sequence));
    //  }
    //})
    .then(() => sequence);
};

//unassociate sequence, commit block
export const sequenceRemove = (blockId, projectId) => {
  return _blockCommit(blockId, projectId, commitMessages.messageSequenceUpdate(blockId, false));
};

//probably dont want to let people do this, since sequence may be referenced by multiple blocks...
export const sequenceDelete = (md5) => {
  return sequenceExists(md5)
    .then(path => fileDelete(path));
};

