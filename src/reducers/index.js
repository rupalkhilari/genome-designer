import { routerReducer as router, LOCATION_CHANGE } from 'react-router-redux';
import { USER_SET_USER } from '../constants/ActionTypes';
import { combineReducers } from 'redux';
import { undoReducer, undoReducerEnhancerCreator } from '../store/undo/reducerEnhancer';

import blocks from './blocks';
import inventory from './inventory';
import inspector from './inspector';
import projects from './projects';
import ui from './ui';
import user from './user';

const purgingEvents = [LOCATION_CHANGE, USER_SET_USER];

const undoReducerEnhancer = undoReducerEnhancerCreator({
  purgeOn: (action) => purgingEvents.some(type => type === action.type),
});

export const rootReducer = combineReducers({
  blocks: undoReducerEnhancer(blocks),
  projects: undoReducerEnhancer(projects),
  router,
  inventory,
  inspector,
  ui,
  user,
  undo: undoReducer,
});

export default rootReducer;
