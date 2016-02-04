import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  currentBlocks: null,
  detailViewVisible: false,
  currentConstructId: null,
  showMainMenu: false,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SET_CURRENT_CONSTRUCT: {
    const { constructId } = action;
    return Object.assign({}, state, {currentConstructId: constructId });
  }
  case ActionTypes.UI_SET_CURRENT : {
    const { blocks } = action;
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
  default : {
    return state;
  }
  }
}
