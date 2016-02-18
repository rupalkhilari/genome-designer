import invariant from 'invariant';
import * as persistence from './persistence';
import * as filePaths from '../utils/filePaths';
import * as fileSystem from '../utils/fileSystem';

//note - these all expect the project to already exist.

export const getAllBlockIdsInProject = (projectId) => {
  const directory = filePaths.createBlockDirectoryPath(projectId);
  return persistence.projectExists(projectId)
    .then(() => fileSystem.directoryContents(directory));
};

export const getAllBlocksInProject = (projectId) => {
  return getAllBlockIdsInProject(projectId)
    .then(blockIds => {
      return Promise.all(blockIds.map(blockId => persistence.blockGet(blockId, projectId)));
    });
};

//returns block IDs in project with projectId, not in blockIdList passed in
export const blocksInProjectDifference = (projectId, blockIdList) => {
  invariant(Array.isArray(blockIdList), 'Must pass array to diff against');
  return getAllBlockIdsInProject(projectId)
    .then(blockIds => {
      return blockIds.filter(blockId => !blockIdList.includes(blockId));
    });
};

//returns blocks IDs unique to blockIdList, not in project with projectId
export const blocksInProjectUnique = (projectId, blockIdList) => {
  invariant(Array.isArray(blockIdList), 'Must pass array to diff against');
  return getAllBlockIdsInProject(projectId)
    .then(blockIds => {
      return blockIdList.filter(blockId => !blockIds.includes(blockId));
    });
};

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

export const writeProjectRollup = (projectId, rollup) => {
  const { project, blocks } = rollup;
  const newBlockIds = blocks.map(block => block.id);
  invariant(projectId === project.id, 'rollup project ID does not match');

  return getAllBlockIdsInProject(projectId)
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
  //todo - do we need this? Usually can just use the flat list...
};
