import * as ActionTypes from '../constants/ActionTypes';
import * as BlockSelector from '../selectors/blocks';
import invariant from 'invariant';

export const uiShowAuthenticationForm = (name) => {
  return (dispatch, getState) => {
    invariant(['signin', 'signup', 'forgot', 'reset', 'account', 'none'].indexOf(name) >= 0, 'attempting to show invalid form name');
    dispatch({
      type: ActionTypes.UI_SHOW_AUTHENTICATION_FORM,
      authenticationForm: name,
    });
    return name;
  };
};

export const uiShowMainMenu = (showMainMenu) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.UI_SHOW_MAIN_MENU,
      showMainMenu,
    });
    return showMainMenu;
  };
};

export const uiSetGrunt = (gruntMessage) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.UI_SET_GRUNT,
      gruntMessage,
    });
    return gruntMessage;
  };
};

export const uiToggleDetailView = (forceState) => {
  return (dispatch, getState) => {
    const currentState = getState().ui.detailViewVisible;
    const nextState = (forceState !== undefined) ? !!forceState : !currentState;
    dispatch({
      type: ActionTypes.UI_TOGGLE_DETAIL_VIEW,
      nextState,
    });
    return nextState;
  };
};

/* current blocks / construct */
//todo - deprecate

export const uiSetCurrent = (blocks) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocks), 'must pass array to uiSetCurrent');
    dispatch({
      type: ActionTypes.UI_SET_CURRENT,
      blocks,
    });
    return blocks;
  };
};

export const uiAddCurrent = (blocksToAdd) => {
  return (dispatch, getState) => {
    const { currentBlocks } = getState().ui;
    const base = Array.isArray(currentBlocks) ? currentBlocks : [];
    const blocks = [...new Set([...base, ...blocksToAdd])];
    dispatch({
      type: ActionTypes.UI_SET_CURRENT,
      blocks,
    });
    return blocks;
  };
};

export const uiToggleCurrent = (blocksToToggle) => {
  return (dispatch, getState) => {
    const { currentBlocks } = getState().ui;
    const blockSet = new Set(currentBlocks);

    blocksToToggle.forEach(block => {
      if (blockSet.has(block)) {
        blockSet.delete(block);
      } else {
        blockSet.add(block);
      }
    });
    const blocks = [...blockSet];

    dispatch({
      type: ActionTypes.UI_SET_CURRENT,
      blocks,
    });
    return blocks;
  };
};

//todo - handle recursive
export const uiSetCurrentConstruct = (constructId) => {
  return (dispatch, getState) => {
    const state = getState();
    const { currentBlocks } = state.ui;

    if (Array.isArray(currentBlocks) && currentBlocks.length) {
      //const construct = state.blocks[constructId];
      const children = dispatch(BlockSelector.blockGetChildrenRecursive(constructId));
      const blocks = currentBlocks.filter(blockId => {
        return children.some(block => block.id === blockId);
      });
      dispatch({
        type: ActionTypes.UI_SET_CURRENT,
        blocks,
      });
    }

    dispatch({
      type: ActionTypes.UI_SET_CURRENT_CONSTRUCT,
      constructId,
    });
    return constructId;
  };
};
