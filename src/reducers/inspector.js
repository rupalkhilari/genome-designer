import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  isVisible: false,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INSPECTOR_TOGGLE_VISIBILITY : {
    const { forceState } = action;
    const nextState = (forceState !== undefined) ? !!forceState : !state.isVisible;
    return Object.assign({}, state, {isVisible: nextState});
  }
  default : {
    return state;
  }
  }
}
