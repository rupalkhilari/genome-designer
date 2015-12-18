import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  currentBlock: null,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SET_CURRENT : {
    const { blockId } = action;
    return Object.assign({}, state, {currentBlock: blockId});
  }
  default : {
    return state;
  }
  }
}
