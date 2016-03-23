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
