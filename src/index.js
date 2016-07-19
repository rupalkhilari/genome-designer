/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
const exposed = global.constructor = {};
Object.assign(exposed, {
  registerExtension,
  actionTypes,
  api: orchestrator,
  store: {
    ...store,
    lastAction: lastAction,
    subscribe: (callback) => {
      return store.subscribe(() => {
        callback(store.getState(), lastAction());
      });
    },
    replaceReducer: () => {}, //hide from 3rd party
  },
});
