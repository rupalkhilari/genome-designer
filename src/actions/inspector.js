import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

export const inspectorToggleVisibility = (forceState) => {
  return (dispatch, getState) => {
    const currentState = getState().inspector.isVisible;
    const nextState = (forceState !== undefined) ? !!forceState : !currentState;
    dispatch({
      type: ActionTypes.INSPECTOR_TOGGLE_VISIBILITY,
      nextState
    });
    return nextState;
  };
};
