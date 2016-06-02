import Project from '../models/Project';
import Block from '../models/Block';

//project rollup cache
//track the last versions saved so we aren't saving over and over
const rollMap = new Map();

//map of blocks
const blockMap = new Map();

//map of projects
const projectMap = new Map();

//compares two rollups for effective changes
//unforunately, the reducers run after the promise resolutions in these loading / saving functions, so project.version will increment immediately after the roll is set here, but that is ok - we handle that check below in isRollSame.
const isRollDifferent = (oldRollup, newRollup) => {
  if (!oldRollup || !newRollup) return true;

  //check projects same
  if (!Project.compare(oldRollup.project, newRollup.project)) return true;

  //check all blocks same
  return oldRollup.blocks.some(oldBlock => {
    const analog = newRollup.blocks.find(newBlock => newBlock.id === oldBlock.id);
    return !analog || analog !== oldBlock;
  });
};

/* save / get */

export const saveProject = (...projects) => {
  projects.forEach(project => projectMap.set(project.id, project));
};

export const saveBlock = (...blocks) => {
  blocks.forEach(block => blockMap.set(block.id, block));
};

export const getProject = (projectId) => {
  return projectMap.get(projectId);
};

export const getBlock = (blockId) => {
  return blockMap.get(blockId);
};

/* rollups */

export const getRollup = (projectId) => {
  return rollMap.get(projectId);
};

export const saveRollup = (rollup) => {
  saveProject(rollup.project);
  rollup.blocks.forEach(block => saveBlock(block));
};

export const isRollupNew = (rollup) => {
  return isRollDifferent(getRollup(rollup.project.id), rollup);
};

/* checks for presense */

//recursively check blocks' presence + their components / options
const blockLoaded = (...blockIds) => {
  return blockIds.every(blockId => {
    const block = blockMap.get(blockId);
    if (!block) {
      return false;
    }

    //check options
    const optionsArray = Object.keys(block.options);
    if (optionsArray.length) {
      return blockLoaded(...optionsArray);
    }

    //check components
    if (block.components.length) {
      return blockLoaded(...block.components);
    }

    //otherwise we're good at the leaf
    return true;
  });
};

//check if whole project is loaded
export const projectLoaded = (projectId) => {
  const project = getProject(projectId);
  if (!project) {
    return false;
  }
  return blockLoaded(...project.components);
};
