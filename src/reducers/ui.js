import * as ActionTypes from '../constants/ActionTypes';
import invariant from 'invariant';

export const initialState = {
  currentBlocks: [], //deprecate
  currentConstructId: null, //deprecate
  detailViewVisible: false,
  showMainMenu: true,
  authenticationForm: 'none',
  gruntMessage: null,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SHOW_AUTHENTICATION_FORM: {
    const { authenticationForm } = action;
    return Object.assign({}, state, {authenticationForm});
  }
  //deprecate
  case ActionTypes.UI_SET_CURRENT_CONSTRUCT: {
    const { constructId } = action;
    return Object.assign({}, state, {currentConstructId: constructId });
  }
  //deprecate
  case ActionTypes.UI_SET_CURRENT : {
    const { blocks } = action;
    invariant(Array.isArray(blocks), 'must pass array to UI_SET_CURRENT');
    return Object.assign({}, state, {currentBlocks: blocks});
  }
  case ActionTypes.UI_TOGGLE_DETAIL_VIEW : {
    const { nextState } = action;
    return Object.assign({}, state, {detailViewVisible: nextState});
  }
  case ActionTypes.UI_SHOW_MAIN_MENU : {
    const { showMainMenu } = action;
    return Object.assign({}, state, {showMainMenu});
  }
  case ActionTypes.UI_SET_GRUNT : {
    const { gruntMessage } = action;
    return Object.assign({}, state, {gruntMessage});
  }
  default : {
    return state;
  }
  }
}
