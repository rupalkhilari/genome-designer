import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  currentBlocks: null,
  detailViewVisible: false,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SET_CURRENT : {
    const { blocks } = action;
    return Object.assign({}, state, {currentBlocks: blocks});
  }
  case ActionTypes.UI_TOGGLE_DETAIL_VIEW : {
    const { forceState } = action;
    const nextState = (forceState !== undefined) ? !!forceState : !state.detailViewVisible;
    return Object.assign({}, state, {detailViewVisible: nextState});
  }
  default : {
    return state;
  }
  }
}
