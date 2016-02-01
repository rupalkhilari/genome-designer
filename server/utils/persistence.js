import { errorDoesNotExist, errorAlreadyExists, errorFileSystem } from './errors';
import * as filePaths from './filePaths';
import * as git from './git';
import fs from 'fs';
import merge from 'lodash.merge';
import mkpath from 'mkpath';

const parser = JSON.parse;
const stringifier = JSON.stringify;

//todo - get promisified version of FS module

//projects

export const projectExists = (projectId) => {
  const path = filePaths.createProjectManifestPath(projectId);
  return new Promise((resolve, reject) => {
    //fixme - lookup this function
    fs.exists(path, (err, result) => {
      if (err) {
        reject(errorDoesNotExist);
      } else {
        resolve(path);
      }
    });
  });
};

export const projectGet = (projectId) => {
  return projectExists(projectId)
    .then(path => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, result) => {
          if (err) {
            reject(err);
          }
          const parsed = parser(result);
          resolve(result);
        });
      });
    })
    .catch(err => {
      if (err === errorDoesNotExist) {
        return Promise.resolve(null);
      } else {
        return Promise.reject(err);
      }
    });
};

export const projectCreate = (projectId, project) => {
  //check to make sure does not yet exist... reject if it does
  return projectExists(projectId)
  .then(() => Promise.reject(errorAlreadyExists))
  .catch((err) => {
    if (err === errorDoesNotExist) {
      const projectPath = filePaths.createProjectPath(projectId);
      return Promise.resolve(projectPath);
    }
    return Promise.reject(err);
  })
  //create the path, initialize git repo
  .then(projectPath => {
    return new Promise((resolve, reject) => {
      mkpath(projectPath, (err) => {
        if (err) { reject(errorFileSystem); }

        //todo - double check this will propagate
        return git.initialize(projectPath)
          .then(resolve);
      });
    });
  })
  //add files
  .then(projectPath => {
    return new Promise((resolve, reject) => {
      const manifestPath = filePaths.createProjectManifestPath(projectId);
      const stringified = stringifier(project);
      fs.writeFile(manifestPath, stringified, 'utf8', (err) => {
        if (err) { reject(err); }
        resolve(projectPath);
      });
    });
  })
  //commit
  .then(projectPath => git.commit(projectPath));
};

export const projectReplace = (projectId, project) => {
  return new Promise((resolve, reject) => {
    const manifestPath = filePaths.createProjectManifestPath(projectId);
    const stringified = stringifier(project);
    fs.writeFile(manifestPath, stringified, 'utf8', (err) => {
      if (err) { reject(err); }
      resolve(project);
    });
  });
};

export const projectMerge = (projectId, project) => {
  return projectGet(projectId)
    .then(oldProject => {
      const merged = merge({}, oldProject, project);
      return projectReplace(projectId, merged);
    });
};

export const projectDelete = (projectId) => {
  return projectExists(projectId)
  .then(projectPath => {
    //todo - delete recursively
  });
};

//blocks

export const blockExists = (projectId, blockId) => {
  return Promise.resolve(true);
};

export const blockGet = (projectId, blockId) => {
  return Promise.resolve(true);
};

export const blockAdd = (projectId, blockId, block) => {
  return Promise.resolve(true);
};

export const blockReplace = (projectId, blockId, block) => {
  return Promise.resolve(true);
};

export const blockMerge = (projectId, blockId, block) => {
  return Promise.resolve(true);
};

export const blockDelete = (projectId, blockId) => {
  return Promise.resolve(true);
};

//sequence

export const sequenceExists = (projectId, blockId) => {
  return Promise.resolve(true);
};

export const sequenceReplace = (projectId, blockId, sequence) => {
  return Promise.resolve(true);
};

export const sequenceDelete = (projectId, blockId) => {
  return Promise.resolve(true);
};
