import * as BlockSelector from './blocks';

export const focusGetProject = () => {
  return (dispatch, getState) => {
    const { forceProject, projectId } = getState().focus;
    if (forceProject) {
      return forceProject;
    }
    return getState().projects[projectId];
  };
};

export const focusGetConstruct = () => {
  return (dispatch, getState) => {
    const state = getState();
    return state.blocks[state.focus.constructId];
  };
};

export const focusGetBlocks = (defaultToConstruct = true) => {
  return (dispatch, getState) => {
    const state = getState();
    const { forceBlocks, blockIds, constructId } = state.focus;
    if (forceBlocks.length) {
      return forceBlocks;
    }
    if (!blockIds.length && defaultToConstruct === true) {
      return [state.blocks[constructId]];
    }
    return blockIds.map(blockId => state.blocks[blockId]);
  };
};

export const focusGetBlockRange = () => {
  return (dispatch, getState) => {
    const focusedBlocks = dispatch(focusGetBlocks(false));
    const focusedConstruct = dispatch(focusGetConstruct());

    if (!focusedBlocks.length) {
      if (focusedConstruct) {
        return [focusedConstruct];
      }
      return [];
    }

    //dispatch just in case other construct is in focus for some reason... also assumes that all focused blocks are within the same construct
    const focusedIds = focusedBlocks.map(block => block.id);
    return dispatch(BlockSelector.blockGetRange(...focusedIds));
  };
};
