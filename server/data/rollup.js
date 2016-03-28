import invariant from 'invariant';
import { errorDoesNotExist } from '../utils/errors';
import * as persistence from './persistence';
import * as filePaths from '../utils/filePaths';
import * as fileSystem from '../utils/fileSystem';
import { getAllBlockIdsInProject, getAllBlocksInProject } from './querying';

export const createRollup = (project, ...blocks) => ({
  project,
  blocks: [...new Set(blocks)],
});

export const getProjectRollup = (projectId) => {
  return Promise
    .all([
      persistence.projectGet(projectId),
      getAllBlocksInProject(projectId),
    ])
    .then(([project, blocks]) => ({
      project,
      blocks,
    }));
};

export const writeProjectRollup = (projectId, rollup, userId) => {
  const { project, blocks } = rollup;
  const newBlockIds = blocks.map(block => block.id);

  if (projectId !== project.id) {
    return Promise.reject('rollup project ID does not match');
  }

  return persistence.projectExists(projectId)
    .catch(err => {
      //if the project doesn't exist, let's make it
      if (err === errorDoesNotExist) {
        invariant(userId, 'userID is necessary to create a project from rollup');

        return persistence.projectCreate(projectId, project, userId);
      }
      return Promise.reject(err);
    })
    .then(() => getAllBlockIdsInProject(projectId))
    .then(extantBlockIds => {
      const differenceIds = extantBlockIds.filter(blockId => newBlockIds.indexOf(blockId) < 0);
      return Promise.all([
        ...differenceIds.map(blockId => persistence.blockDelete(blockId, projectId)),
      ]);
    })
    .then(() => Promise.all([
      persistence.projectWrite(projectId, project),
      ...blocks.map(block => persistence.blockWrite(block.id, block, projectId)),
    ]))
    .then(() => rollup);
};

/**
 * @description Recursively get children
 * @param projectId {ID} Id of project
 * @param parentId {ID=} internal use mostly, unless only want children of a specific block
 * @param acc {object=} internal use
 */
export const getComponentsRecursively = (projectId, parentId, acc) => {
  const parent = parentId || projectId;
  //todo - do we need this? Usually can just use the flat list... Use if want a certain depth
};
