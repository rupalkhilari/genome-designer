import * as ActionTypes from '../../constants/ActionTypes';
import invariant from 'invariant';
import { LOCATION_CHANGE } from 'react-router-redux';

export const initialState = {
  isVisible: false,
  currentExtension: null,
};

export default function detailView(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.DETAIL_VIEW_TOGGLE_VISIBILITY :
    const { nextState } = action;
    return Object.assign({}, state, { isVisible: nextState });

  case ActionTypes.DETAIL_VIEW_SELECT_EXTENSION :
    const { manifest } = action;
    if (!manifest || manifest === state.currentExtension) {
      return state;
    }
    invariant(manifest.name && typeof manifest.render === 'function', 'must pass the extension manifest, which has a name and render()');
    return Object.assign({}, state, { currentExtension: manifest });

  case ActionTypes.USER_SET_USER :
  case LOCATION_CHANGE :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
