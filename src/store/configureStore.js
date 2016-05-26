import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//import createLogger from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import saveLastActionMiddleware from './saveLastActionMiddleware';
import combinedReducer from '../reducers/index';
import pausableStore from './pausableStore';

// note that the store loads the routes, which in turn load components
// Routes are provided to the store. ReduxRouter works with react-router. see routes.js - they are injected as middleware here so they can be provided to components, and route information can be accessed as application state.

//const logger = createLogger();

const middleware = [
  // middleware like thunk (async, promises) should come first in the chain
  thunk,
  //custom middleware for event system + last action
  saveLastActionMiddleware,
  //routing middleware so you can import actions from react-redux-router
  routerMiddleware(browserHistory),
];

let finalCreateStore;
if (process.env.DEBUGMODE) {
  const DevTools = require('../containers/DevTools.js');

  finalCreateStore = compose(
    applyMiddleware(...middleware),
    pausableStore(),
    DevTools.instrument()
  )(createStore);
} else {
  finalCreateStore = compose(
    applyMiddleware(...middleware),
    pausableStore()
  )(createStore);
}

// expose reducer so you can pass in only one reducer for tests
// (probably need to compose the way reducer does, e.g. using combineReducers, so retrieving data from store is correct)
export default function configureStore(initialState, reducer = combinedReducer) {
  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
