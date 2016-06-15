import * as BlockSelector from './blocks';

//primary way to get focused things for the inspector
//todo - should share code there
export const focusGetFocused = (defaultToConstruct = true) => {
  return (dispatch, getState) => {
    const state = getState();
    const { level, forceProject, forceBlocks, projectId, constructId, blockIds, options } = state.focus;
    let focused;
    let readOnly = false;
    let type = level;

    if (level === 'project' || (!constructId && !forceBlocks.length && !blockIds.length)) {
      if (forceProject) {
        focused = forceProject;
        readOnly = true;
      } else {
        focused = state.projects[projectId];
      }
      type = 'project'; //need to override so dont try to show block inspector
    } else if (level === 'construct' || (defaultToConstruct === true && constructId && !forceBlocks.length && !blockIds.length)) {
      const construct = state.blocks[constructId];
      focused = [construct];
      readOnly = construct.isFrozen();
    } else if (level === 'option' && blockIds.length === 1) {
      const optionId = options[blockIds[0]];
      focused = [state.blocks[optionId]];
      readOnly = true;
    } else {
      if (forceBlocks.length) {
        focused = forceBlocks;
        readOnly = true;
      } else {
        focused = blockIds.map(blockId => state.blocks[blockId]);
        readOnly = focused.some(instance => instance.isFrozen());
      }
    }

    return {
      type,
      readOnly,
      focused,
    };
  };
};

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

//if focused blocks / construct have components
//e.g. whether can open sequence detail view
export const focusDetailsExist = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { forceBlocks, blockIds, constructId } = state.focus;
    const construct = state.blocks[constructId];
    return !!forceBlocks.length || !!blockIds.length || (construct && !!construct.components.length);
  };
};
