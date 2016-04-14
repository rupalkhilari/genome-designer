import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';

export const initialState = {
  detailViewVisible: false,
  showMainMenu: true,
  authenticationForm: 'none',
  showDNAImport: false,
  gruntMessage: null,
  showGenBankImport: false,
  userWidgetVisible: true,
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.UI_SHOW_AUTHENTICATION_FORM: {
    const { authenticationForm } = action;
    return Object.assign({}, state, {authenticationForm});
  }
  case ActionTypes.UI_SHOW_GENBANK_IMPORT: {
    const { showGenBankImport } = action;
    return Object.assign({}, state, {showGenBankImport});
  }
  case ActionTypes.UI_SHOW_DNAIMPORT: {
    const { showDNAImport } = action;
    return Object.assign({}, state, {showDNAImport});
  }
  case ActionTypes.UI_TOGGLE_DETAIL_VIEW : {
    const { nextState } = action;
    return Object.assign({}, state, {detailViewVisible: nextState});
  }
  case ActionTypes.UI_SHOW_MAIN_MENU : {
    const { showMainMenu } = action;
    return Object.assign({}, state, {showMainMenu});
  }
  case ActionTypes.UI_SHOW_USER_WIDGET : {
    const { userWidgetVisible } = action;
    return Object.assign({}, state, {userWidgetVisible});
  }
  case ActionTypes.UI_SET_GRUNT : {
    const { gruntMessage } = action;
    return Object.assign({}, state, {gruntMessage});
  }
  case LOCATION_CHANGE : {
    return Object.assign({}, initialState);
  }
  default : {
    return state;
  }
  }
}
