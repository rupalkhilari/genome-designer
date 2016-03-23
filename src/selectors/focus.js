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

export const focusGetBlockRange = () => {
  return (dispatch, getState) => {
    const focused = dispatch(focusGetBlocks());
    if (!focused.length) {
      return [];
    }

    //dispatch just in case other construct is in focus for some reason... also assumes that all focused blocks are within the same construct
    const focusedIds = focused.map(block => block.id);
    return dispatch(BlockSelector.blockGetRange(...focusedIds));
  };
};
