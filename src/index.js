import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import * as actionTypes from './constants/ActionTypes';
import actions from './actions/_expose';
import store, { lastAction } from './store/index';

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  require('./createDevToolsWindow')(store);
}

//expose various things on the window, e.g. for extensions
const exposed = global.gd = {};
Object.assign(exposed, {
  actionTypes,
  actions,
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
