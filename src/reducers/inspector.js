import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  isVisible: false,
  forceBlocks: [], //todo - deprecate
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INSPECTOR_TOGGLE_VISIBILITY : {
    const { nextState } = action;
    return Object.assign({}, state, {isVisible: nextState});
  }
  //todo - deprecate
  case ActionTypes.INSPECTOR_FORCE_BLOCKS : {
    const { blocks } = action;
    return Object.assign({}, state, {forceBlocks: blocks});
  }
  case ActionTypes.UI_SET_CURRENT : {
    //clear forceBlock on selecting another
    return Object.assign({}, state, {forceBlocks: []});
  }
  default : {
    return state;
  }
  }
}
