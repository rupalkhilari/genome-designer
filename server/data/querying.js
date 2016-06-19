import * as fileSystem from '../utils/fileSystem';
import * as filePaths from '../utils/filePaths';
import * as persistence from './persistence';
import * as versioning from './versioning';
import invariant from 'invariant';
import { spawn, exec } from 'child_process';
import { merge, flatten } from 'lodash';
import { errorDoesNotExist, errorCouldntFindProjectId } from '../utils/errors';

// key for no role rule
const untypedKey = 'none';

//returns map
export const getAllBlocksInProject = (projectId) => {
  return persistence.blocksGet(projectId);
};

//returns array
//note - expects the project to already exist.
export const getAllBlockIdsInProject = (projectId) => {
  return getAllBlocksInProject(projectId)
    .then(blockMap => Object.keys(blockMap));
};

////returns project ID
//export const findProjectFromBlock = (blockId) => {
//  if (!blockId) {
//    return Promise.reject(errorCouldntFindProjectId);
//  }
//
//  return new Promise((resolve, reject) => {
//    const storagePath = filePaths.createStorageUrl(filePaths.projectPath);
//    exec(`find ${storagePath} -type d -name ${blockId}`, (err, output) => {
//      if (err) {
//        return reject(err);
//      }
//
//      const lines = output.split('\n');
//      lines.pop(); //get rid of the last empty line
//      if (lines.length === 1) {
//        const [/* idBlock */,
//          /* blocks/ */,
//          /* data/ */,
//          idProject,
//        ] = lines[0].split('/').reverse();
//        resolve(idProject);
//      } else {
//        reject(errorCouldntFindProjectId);
//      }
//    });
//  });
//};

//fixme - this will error if the user has no projects
//search each permissions.json by user ID to find projects they have access to
export const listProjectsWithAccess = (userId) => {
  const directory = filePaths.createProjectsDirectoryPath();
  return new Promise((resolve, reject) => {
    exec(`cd ${directory} && grep --regexp="${userId}" --include=permissions.json -Rl .`, (err, output, stderr) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      const lines = output.split('\n');
      lines.pop(); //get rid of the last empty line
      const projectIds = lines.map(line => {
        const [/*permissions.json*/,
          projectId,
          /* path/to/dir */
        ] = line.split('/').reverse();
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
    })
    .catch(err => {
      console.error('error getting project manifests', err);
      return [];
    });
};

export const getProjectVersions = (projectId) => {
  const projectDataPath = filePaths.createProjectDataPath(projectId);
  return versioning.log(projectDataPath);
};

//returns array
//todo - update all usages to expect object, not array
export const getAllBlocks = (userId) => {
  return listProjectsWithAccess(userId)
    .then(projectIds => Promise.all(
      projectIds.map(projectId => getAllBlocksInProject(projectId))
    ))
    //blockIds may be same across project, but only if they are frozen, so we can merge over each other
    .then(projectBlockMaps => merge({}, ...projectBlockMaps))
    .then(blockMap => Object.keys(blockMap).map(key => blockMap[key]));
};

export const getAllBlocksFiltered = (userId, blockFilter = () => true) => {
  return getAllBlocks(userId)
    .then(blocks => blocks.filter(blockFilter));
};

export const getAllBlocksWithName = (userId, name) => {
  const filter = (block, index) => block.metadata.name === name;
  return getAllBlocksFiltered(userId, filter);
};

export const getAllBlocksWithRole = (userId, role) => {
  const filter = (block, index) => {
    return (role === untypedKey) ?
      !block.rules.role :
      block.rules.role === role;
  };
  return getAllBlocksFiltered(userId, filter);
};

export const getAllBlockRoles = (userId) => {
  return getAllBlocks(userId)
    .then(blocks => {
      const obj = blocks.reduce((acc, block) => {
        const rule = block.rules.role;
        if (!rule) {
          acc[untypedKey] += 1;
          return acc;
        }

        if (acc[rule]) {
          acc[rule]++;
        } else {
          acc[rule] = 1;
        }
        return acc;
      }, { [untypedKey]: 0 });
      return obj;
    });
};

export const getOrderIds = (projectId) => {
  const directory = filePaths.createOrderDirectoryPath(projectId);
  return persistence.projectExists(projectId)
    .then(() => fileSystem.directoryContents(directory));
};

export const getOrders = (projectId) => {
  return getOrderIds(projectId)
    .then(orderIds => Promise.all(orderIds.map(orderId => persistence.orderGet(orderId, projectId))))
    .catch(err => {
      if (err === errorDoesNotExist) {
        return [];
      }
      return Promise.reject(err);
    });
};
