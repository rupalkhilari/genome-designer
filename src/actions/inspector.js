import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

export const inspectorToggleVisibility = makeActionCreator(ActionTypes.INSPECTOR_TOGGLE_VISIBILITY, 'forceState');
export const inspectorSetCurrent = makeActionCreator(ActionTypes.INSPECTOR_SET_CURRENT, 'instance');
