import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import * as actionTypes from './constants/ActionTypes';
import actions from './actions/_expose';
import store, { lastAction } from './store/index';
import * as server from './middleware/api';
import orchestrator from './store/orchestrator';
import registerExtension from './extensions/registerExtension';

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
);

//expose various things on the window, e.g. for extensions
const exposed = global.gd = {};
Object.assign(exposed, {
  registerExtension,
  actionTypes,
  actions, //todo - deprecate
  server, //todo - deprecate
  api: orchestrator, //expose better....
  store: {
    dispatch: store.dispatch,
    getState: store.getState,
    lastAction: lastAction,
    subscribe: (callback) => {
      return store.subscribe(() => {
        callback(store.getState(), lastAction());
      });
    },
  },
});
