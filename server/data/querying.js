import * as filePaths from '../utils/filePaths';
import * as persistence from './persistence';
import invariant from 'invariant';
import { exec } from 'child_process';
import { errorCouldntFindProjectId } from '../utils/errors';

export const findProjectFromBlock = (blockId) => {
  if (!blockId) {
    return Promise.reject(errorCouldntFindProjectId);
  }

  return new Promise((resolve, reject) => {
    const storagePath = filePaths.createStorageUrl(filePaths.projectPath);
    exec(`cd ${storagePath} && find . -type d -name ${blockId}`, (err, output) => {
      if (err) {
        return reject(err);
      }

      const lines = output.split('\n');
      lines.pop(); //get rid of the last empty line
      if (lines.length === 1) {
        const [ /* idBlock */,
          /* blocks/ */,
          /* data/ */,
          idProject,
          ] = lines[0].split('/').reverse();
        resolve(idProject);
      } else {
        reject(errorCouldntFindProjectId);
      }
    });
  });
};

//search each permissions.json by user ID to find projects they have access to
export const listProjectsWithAccess = (userId) => {
  const directory = filePaths.createProjectsDirectoryPath();
  return new Promise((resolve, reject) => {
    exec(`cd ${directory} && grep -e "${userId}" --include=permissions.json -Rl .`, (err, output) => {
      if (err) {
        return reject(err);
      }

      const lines = output.split('\n');
      lines.pop(); //get rid of the last empty line
      const projectIds = lines.map(line => {
        const [/*dot*/,
          projectId,
          /*permission.json*/
          ] = line.split('/');
        return projectId;
      });
      return resolve(projectIds);
    });
  });
};

export const getAllProjectManifests = (userId) => {
  invariant(userId, 'user id is required to get list of manifests');

  return listProjectsWithAccess(userId)
    .then(projectIds => {
      return Promise.all(projectIds.map(project => persistence.projectGet(project)));
    });
};
