import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

export const uiSetCurrent = makeActionCreator(ActionTypes.UI_SET_CURRENT, 'instance');