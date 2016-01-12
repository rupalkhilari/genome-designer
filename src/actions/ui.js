import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

export const uiSetCurrent = makeActionCreator(ActionTypes.UI_SET_CURRENT, 'blocks');
export const uiToggleDetailView = makeActionCreator(ActionTypes.UI_TOGGLE_DETAIL_VIEW, 'forceState');
