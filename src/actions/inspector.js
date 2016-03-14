import * as ActionTypes from '../constants/ActionTypes';
import invariant from 'invariant';

export const inspectorToggleVisibility = (forceState) => {
  return (dispatch, getState) => {
    const currentState = getState().inspector.isVisible;
    const nextState = (forceState !== undefined) ? !!forceState : !currentState;
    dispatch({
      type: ActionTypes.INSPECTOR_TOGGLE_VISIBILITY,
      nextState,
    });
    return nextState;
  };
};

export const inspectorForceBlocks = (blocks) => {
  return (dispatch, getState) => {
    invariant(Array.isArray(blocks), 'must pass array to inspectorForceBlocks');
    dispatch({
      type: ActionTypes.INSPECTOR_FORCE_BLOCKS,
      blocks,
    });
    return blocks;
  };
};
