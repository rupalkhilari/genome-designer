import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  isVisible: true,
  currentInstance: null,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SET_CURRENT : {
    const { instance } = action;
    return Object.assign({}, state, {currentInstance: instance});
  }
  default : {
    return state;
  }
  }
}
