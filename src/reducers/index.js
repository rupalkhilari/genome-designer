import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import blocks from './blocks';
import inventory from './inventory';
import inspector from './inspector';
import projects from './projects';
import ui from './ui';

const rootReducer = combineReducers({
  router,
  blocks,
  inventory,
  inspector,
  projects,
  ui,
});

export default rootReducer;
