import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router';
import * as actionTypes from './constants/ActionTypes';
import actions from './actions/_expose';
import store, { lastAction } from './store/index';
import { login, createBlock, retrieveBlock, saveBlock, runExtension } as middleware from './middleware/api';

render(
  <Provider store={store}>
    <ReduxRouter />
  </Provider>,
  document.getElementById('root')
);

if (process.env.USER === 'maxwellbates') {
  // Use require because imports can't be conditional.
  // In production, you should ensure process.env.NODE_ENV
  // is envified so that Uglify can eliminate this
  // module and its dependencies as dead code.
  require('./createDevToolsWindow')(store);
}

// login on app start by default for all subsequent API requests...
// need to handle this much better. this is so lame.
// really, this isnt necessary yet, as there is a testingStub Key in middleware/api.js for now
login();

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
  login,
  retrieveBlock,
  saveBlock,
  runExtension,
  readFile,
  writeFile,
});
