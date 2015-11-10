import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import projects from './projects';
import parts from './parts';
import blocks from './blocks';

const rootReducer = combineReducers({
  router,
  blocks,
  parts,
  projects,
});

export default rootReducer;
