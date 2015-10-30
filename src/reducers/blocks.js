import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

export default function blocks (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.BLOCK_ADD_BLOCK : {
      const { block } = action;

      return Object.assign({}, state, { [block.id] : block });
    }
    default : {
      return state;
    }
  }
}
