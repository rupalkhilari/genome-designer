import invariant from 'invariant';
import { errorDoesNotExist } from '../utils/errors';
import * as persistence from './persistence';
import * as filePaths from '../utils/filePaths';
import * as fileSystem from '../utils/fileSystem';

export const getAllProjectManifests = () => {
  const directory = filePaths.createProjectsDirectoryPath();
  return fileSystem.directoryContents(directory)
    .then(projects => {
      return Promise.all(projects.map(project => persistence.projectGet(project)));
    });
};

//note - expects the project to already exist.
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

  return persistence.projectExists(projectId)
    .catch(err => {
      //if the project doesn't exist, let's make it
      if (err === errorDoesNotExist) {
        return persistence.projectCreate(projectId, project);
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
