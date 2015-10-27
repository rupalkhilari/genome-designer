import * as ActionTypes from '../constants/ActionTypes';
import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

import projects from './projects';
import parts from './parts';

const rootReducer = combineReducers({
  router,
  projects,
  parts
});

export default rootReducer;
