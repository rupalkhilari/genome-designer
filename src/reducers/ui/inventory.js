import * as ActionTypes from '../../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';

export const initialState = {
  isVisible: false,
  currentTab: null,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INVENTORY_TOGGLE_VISIBILITY :
    const { nextState } = action;
    return Object.assign({}, state, { isVisible: nextState });

  case ActionTypes.INVENTORY_SELECT_TAB :
    const { tab } = action;
    return Object.assign({}, state, { currentTab: tab });

  case LOCATION_CHANGE :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
