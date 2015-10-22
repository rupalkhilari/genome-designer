import * as ActionTypes from '../constants/ActionTypes';
import { routerStateReducer as router } from 'redux-router';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  router
});

export default rootReducer;
