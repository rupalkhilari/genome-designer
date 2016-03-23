import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
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
