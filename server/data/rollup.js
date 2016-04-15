import invariant from 'invariant';
import { errorDoesNotExist } from '../utils/errors';
import * as persistence from './persistence';
import * as filePaths from '../utils/filePaths';
import * as fileSystem from '../utils/fileSystem';
import { findProjectFromBlock, getAllBlockIdsInProject, getAllBlocksInProject } from './querying';

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

//helper for getComponentsRecursively
const getBlockInRollById = (id, roll) => roll.blocks.find(block => block.id === id);

//given a rollup and rootId, recursively gets components of root block
const getComponentsRecursivelyGivenRollup = (rootId, projectRollup, acc = {}) => {
  const root = getBlockInRollById(rootId, projectRollup);
  acc[rootId] = root;

  //recurse
  root.components.forEach(compId => getComponentsRecursivelyGivenRollup(compId, projectRollup, acc));

  return acc;
};

/**
 * @description Recursively get children of a block
 * todo - handle projectId as input, not just block
 * @param rootId {ID} root to get components of
 * @param forceProjectId {ID=} Id of project, internal use (or force one)
 */
export const getComponentsRecursively = (rootId, forceProjectId) => {
  const projectIdPromise = forceProjectId ?
    Promise.resolve(forceProjectId) :
    findProjectFromBlock(rootId);

  return projectIdPromise
    .then(projectId => getProjectRollup(projectId))
    .then(rollup => getComponentsRecursivelyGivenRollup(rootId, rollup));
};
