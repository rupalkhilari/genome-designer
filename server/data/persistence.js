import { errorDoesNotExist, errorAlreadyExists, errorFileSystem } from './../utils/errors';
import * as filePaths from './filePaths';
import * as git from './git';
import fs from 'fs';
import rimraf from 'rimraf';
import merge from 'lodash.merge';
import mkpath from 'mkpath';

const parser = JSON.parse;
const stringifier = JSON.stringify;

// internal read/write utils

const _fileExists = (path) => {
  return new Promise((resolve, reject) => {
    fs.access(path, (err) => {
      if (err) {
        reject(errorDoesNotExist);
      } else {
        resolve(path);
      }
    });
  });
};

const _fileRead = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, result) => {
      if (err) {
        reject(err);
      }
      const parsed = parser(result);
      resolve(parsed);
    });
  });
};

const _fileWrite = (path, jsonData) => {
  return new Promise((resolve, reject) => {
    const stringified = stringifier(jsonData);
    fs.writeFile(path, stringified, 'utf8', (err) => {
      if (err) {
        reject(err);
      }
      resolve(path);
    });
  });
};

const _makeDirectory = (path) => {
  return new Promise((resolve, reject) => {
    mkpath(path, (err) => {
      if (err) {
        reject(errorFileSystem);
      }
      resolve(path);
    });
  });
};

const _fileDelete = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) { reject(err); }
      resolve(path);
    });
  });
};

const _fileDeleteDirectory = (path) => {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) { reject (err); }
      resolve(path);
    });
  });
};

const _projectRead = (projectId) => {
  const path = filePaths.createProjectManifestPath(projectId);
  return _fileRead(path);
};

const _blockRead = (blockId, projectId) => {
  const path = filePaths.createBlockManifestPath(blockId, projectId);
  return _fileRead(path);
};

const _projectWrite = (projectId, project) => {

};

const _blockWrite = (blockId, block, projectId) => {

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
  return _fileExists(path);
};

export const blockExists = (blockId, projectId) => {
  const path = filePaths.createBlockManifestPath(blockId, projectId);
  return _fileExists(path);
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
  const projectPath = filePaths.createProjectPath(projectId);
  const manifestPath = filePaths.createProjectManifestPath(projectId);

  return projectAssertNew(projectId)
    .then(() => _makeDirectory(projectPath))
    .then(() => git.initialize(projectPath))
    .then(() => _fileWrite(manifestPath, project))
    .then(() => _projectCommit(projectId));
};

export const blockCreate = (blockId, projectId, block) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  const manifestPath = filePaths.createBlockManifestPath(blockId, projectId);

  return blockAssertNew(blockId, projectId)
    .then(() => _makeDirectory(blockPath))
    .then(() => _fileWrite(manifestPath, block))
    .then(() => _blockCommit(blockId, projectId));
};

//SET (WRITE + MERGE)

export const projectWrite = (projectId, project) => {
  const manifestPath = filePaths.createProjectManifestPath(projectId);
  return _fileWrite(manifestPath, project)
    .then(() => _projectCommit(projectId));
};

export const projectMerge = (projectId, project) => {
  return projectGet(projectId)
    .then(oldProject => {
      const merged = merge({}, oldProject, project);
      return projectWrite(projectId, merged);
    });
};

export const blockWrite = (blockId, block, projectId) => {
  const manifestPath = filePaths.createBlockManifestPath(blockId, projectId);
  return _fileWrite(manifestPath, block)
    .then(() => _blockCommit(blockId, projectId));
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
      return _fileDeleteDirectory(projectPath);
    });
  //no need to commit... its deleted
};

export const blockDelete = (blockId, projectId) => {
  const blockPath = filePaths.createBlockPath(blockId, projectId);
  return blockExists(blockId, projectId)
    .then(() => _fileDeleteDirectory(blockPath))
    .then(() => _projectCommit(projectId));
};

//sequence

export const sequenceExists = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return _fileExists(sequencePath);
};

export const sequenceWrite = (blockId, sequence, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return sequenceExists(blockId, projectId)
    .then(() => _fileWrite(sequencePath, sequence))
    .then(() => _blockCommit(blockId, projectId));
};

export const sequenceDelete = (blockId, projectId) => {
  const sequencePath = filePaths.createBlockSequencePath(blockId, projectId);
  return sequenceExists(blockId, projectId)
    .then(() => _fileDelete(sequencePath))
    .then(() => _blockCommit(blockId, projectId));
};
