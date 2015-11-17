import * as ActionTypes from '../constants/ActionTypes';

const initialState = {
  isVisible: false,
  searchTerm: '',
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INVENTORY_TOGGLE_VISIBILITY : {
    const { forceState } = action;
    const nextState = (forceState !== undefined) ? !!forceState : !state.isVisible;
    return Object.assign({}, state, {isVisible: nextState});
  }
  case ActionTypes.INVENTORY_SEARCH : {
    const { searchTerm } = action;
    return Object.assign({}, state, {searchTerm: searchTerm});
  }
  default : {
    return state;
  }
  }
}
