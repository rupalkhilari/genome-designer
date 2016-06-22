import * as BlockSelector from './blocks';

//todo - this should not be exposed as part of 3rd party API... exported so inspector can share
export const _getFocused = (state, defaultToConstruct = true, defaultProjectId = null) => {
  const { level, forceProject, forceBlocks, projectId, constructId, blockIds, options } = state.focus;

  //focus doesnt update on undo, just the blocks... so need to filter / make sure defined
  const project = forceProject || state.projects[projectId || defaultProjectId];
  const construct = state.blocks[constructId];
  const blocks = forceBlocks.length ?
    forceBlocks :
    blockIds.map(blockId => state.blocks[blockId]).filter(block => !!block);
  const option = blockIds.length === 1 ? state.blocks[options[blockIds[0]]] : null;

  let focused;
  let readOnly = false;
  let type = level;

  if (level === 'project' || (!construct && !blocks.length)) {
    focused = project;
    readOnly = !!forceProject || project.isSample;
    type = 'project'; //override in case here because construct / blocks unspecified
  } else if (level === 'construct' || (defaultToConstruct === true && construct && !blocks.length)) {
    focused = [construct];
    readOnly = construct.isFrozen();
  } else if (level === 'option' && option) {
    focused = [option];
    readOnly = true;
  } else {
    focused = blocks;
    readOnly = forceBlocks.length || focused.some(instance => instance.isFrozen());
  }

  return {
    type,
    readOnly,
    focused,
  };
};

//primary way to get focused things for the inspector
export const focusGetFocused = (defaultToConstruct = true, defaultProjectId = null) => {
  return (dispatch, getState) => {
    const state = getState();
    return _getFocused(state, defaultToConstruct, defaultProjectId);
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
