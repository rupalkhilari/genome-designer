import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';
import { undoReducer, undoReducerEnhancerCreator } from '../store/undo/reducerEnhancer';

import blocks from './blocks';
import inventory from './inventory';
import inspector from './inspector';
import projects from './projects';
import ui from './ui';
import user from './user';

const undoReducerEnhancer = undoReducerEnhancerCreator();

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
