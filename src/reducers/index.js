import { routerReducer as router, LOCATION_CHANGE } from 'react-router-redux';
import { USER_SET_USER } from '../constants/ActionTypes';
import { combineReducers } from 'redux';
import { undoReducer, undoReducerEnhancerCreator } from '../store/undo/reducerEnhancer';

import blocks from './blocks';
import projects from './projects';
import inventory from './inventory';
import inspector from './inspector';
import ui from './ui';
import focus from './focus';
import user from './user';

const purgingEvents = [LOCATION_CHANGE, USER_SET_USER];

const undoReducerEnhancer = undoReducerEnhancerCreator({
  purgeOn: (action) => purgingEvents.some(type => type === action.type),
});

export const rootReducer = combineReducers({
  blocks: undoReducerEnhancer(blocks, 'blocks'),
  projects: undoReducerEnhancer(projects, 'projects'),
  router,
  inventory,
  inspector,
  ui,
  focus,
  user,
  undo: undoReducer,
});

export default rootReducer;
