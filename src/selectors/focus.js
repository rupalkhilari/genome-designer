import * as BlockSelector from './blocks';

export const focusGetProject = () => {
  return (dispatch, getState) => {
    const { forceProject, project } = getState().focus;
    if (forceProject) {
      return forceProject;
    }
    return getState().projects[project];
  };
};

export const focusGetConstruct = () => {
  return (dispatch, getState) => {
    const state = getState();
    return state.blocks[state.focus.construct];
  };
};

export const focusGetBlocks = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { forceBlocks, blocks } = state.focus;
    if (forceBlocks.length) {
      return forceBlocks;
    }
    return blocks.map(blockId => state.blocks[blockId]);
  };
};

export const focusGetBlockBounds = () => {
  return (dispatch, getState) => {
    const focused = dispatch(focusGetBlocks());
    if (!focused.length) {
      return [];
    }

    //todo - optimize this...

    //dispatch just in case other construct is in focus for some reason... also assumes that all focused blocks are within the same construct
    const focusedIds = focused.map(block => block.id);
    const constructId = dispatch(BlockSelector.blockGetParentRoot(focusedIds[0]));
    const depthMap = dispatch(BlockSelector.blockGetChildrenByDepth(constructId));
    const idsToDepth = focusedIds.reduce((acc, id) => Object.assign(acc, { [id]: depthMap[id] }), {});
    const highestLevel = focusedIds.reduce((acc, id) => Math.min(acc, idsToDepth[id]), Number.MAX_VALUE);
    const blocksIdsAtHighest = focusedIds.filter(id => idsToDepth[id] === highestLevel);
    const highSiblings = dispatch(BlockSelector.blockGetSiblings(blocksIdsAtHighest[0]));

    //dumb search of all children of siblings to see if focused block present
    const relevantSiblings = highSiblings.filter(sibling => {
      if (focusedIds.indexOf(sibling.id) >= 0) {
        return true;
      }
      const kids = dispatch(BlockSelector.blockGetChildrenRecursive(sibling.id));
      return kids.some(kid => focusedIds.indexOf(kid.id) >= 0);
    });

    return relevantSiblings;
  };
};
