import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import reduxRouter from './routes/reduxRouter';
import * as actionTypes from './constants/ActionTypes';
import store, { lastAction } from './store/index';
import orchestrator from './store/orchestrator';
import registerExtension from './extensions/registerExtension';

render(
  <Provider store={store}>
    {reduxRouter}
  </Provider>,
  document.getElementById('root')
);

//expose various things on the window, e.g. for extensions
const exposed = global.gd = {};
Object.assign(exposed, {
  registerExtension,
  actionTypes,
  api: orchestrator,
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
