import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
//import createLogger from 'redux-logger';
import saveLastActionMiddleware from './saveLastActionMiddleware';
import rootReducer from '../reducers/index';

// note that the store loads the routes, which in turn load components
// Routes are provided to the store. ReduxRouter works with react-router. see routes.js - they are injected as middleware here so they can be provided to components, and route information can be accessed as application state.

//const logger = createLogger();

const middleware = [
  // middleware like thunk (async, promises) should come first in the chain
  thunk,
  //custom middleware for event system + last action
  saveLastActionMiddleware,
];

let finalCreateStore;
if (process.env.NODE_ENV !== 'production') {
  const DevTools = require('../containers/DevTools.js');

  finalCreateStore = compose(
    applyMiddleware(...middleware),
    DevTools.instrument()
  )(createStore);
} else {
  finalCreateStore = applyMiddleware(...middleware)(createStore);
}

// expose reducer so you can pass in only one reducer for tests
// (probably need to compose the way rootReducer does)
export default function configureStore(initialState, reducer = rootReducer) {
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
