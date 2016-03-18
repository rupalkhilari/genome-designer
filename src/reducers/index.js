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
  undo: undoReducer,
  blocks: undoReducerEnhancer(blocks, 'blocks'),
  projects: undoReducerEnhancer(projects, 'projects'),
  router,
  inventory,
  inspector,
  ui,
  user,
});

export default rootReducer;
