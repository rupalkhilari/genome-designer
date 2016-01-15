import invariant from 'invariant';

/* inspiration

 https://github.com/omnidan/redux-undo/blob/master/src/index.js
 https://github.com/gaearon/redux-devtools/blob/master/src/instrument.js
 https://github.com/rackt/redux/blob/master/src/applyMiddleware.js
 */

/*** ideal API ***/

//by default, all actions automatically undo-able
store.dispatch(someAction(someValue));

//simple undo-redo API
undoManager.undo();
undoManager.redo();

//can ignore a specified number of forthcoming actions
//this is a simple mechanism to make an action not undoable
//call right before dispatching to ignore that dispatch
//pass null to clear
undoManager.ignore(1);

//this action would happen, but not be undoable
undoManager.dispatch(someAction(anotherValue));

/*

 UndoManager transactions sit above the store. Actions still perform mutations and update the store, but are not added to the undo stack.
 Transactions can be commmitted (set store to current state) or aborted (revert to store state at beginning of transaction)

 -|--.--------.--------.-------|---
 |  update   update   update  |
 |                            |
 beginTransation()            commitTransation()

 */

//authors can initiate transations
undoManager.beginTransaction();

store.dispatch(action1(val));
store.dispatch(action2(val));

// still get the store state as normal at any point. These actions will have affected the store.
store.getState();

//transations can be committed, and the store is snapshotted
undoManager.commitTransation();

//transations can be aborted, and the store reverts to when the transaction began
undoManager.abortTransation();

//can go back/forward in time arbitrary number of *undoable* actions
undoManager.jump(-2);

/////////////////////////////////////////

let __DEBUG__ = false;
let inTransation = false;
let toIgnore = 0;

const ActionTypes = {
  UNDO: 'UNDOABLE_UNDO',
  REDO: 'UNDOABLE_REDO',
  JUMP: 'UNDOABLE_JUMP',
  BEGIN: 'UNDOABLE_BEGIN',
  COMMIT: 'UNDOABLE_COMMIT',
  ABORT: 'UNDOABLE_ABORT',
};

const ActionCreators = ActionTypes.reduce((acc, actionType, type) => {
  acc[type.toLowerCase()] = (extend) => {
    return Object.assign({
      type: actionType,
      time: Date.now(),
    }, extend);
  };
  return acc;
}, {});

/**
 * @name undoMiddleware
 * @param config
 */
const defaultParams = {
  limit: false,
  filter: () => true,
  debug: false,
};

//use a reducer enhancer so that we run after the store has been updated, in case an action is asynchronous
function undoReducerEnhancer(params, reducer, initialState) {
  const history = createHistory(initialState);

  //todo

}

const undoStoreEnhancer = (config) => {
  const params = Object.assign({}, defaultParams, config);
  return (createStore) => (reducer, initialState) => {
    const undoableReducer = undoReducerEnhancer(params, reducer, initialState);
    return createStore(undoableReducer, initialState);
  };
};

/*** history + undo/redo helpers ***/

function createHistory(state) {
  return {
    past: [],
    present: state,
    future: [],
  };
}

function undo(history) {
  const { past, present, future } = history;
  if (past.length <= 0) {
    return history;
  }

  return {
    past: past.slice(0, past.length - 1),
    present: past[past.length - 1],
    future: [
      present,
      ...future,
    ],
  };
}

function redo(history) {
  const { past, present, future } = history;
  if (future.length <= 0) {
    return history;
  }

  return {
    future: future.slice(1, future.length),
    present: future[0],
    past: [
      ...past,
      present,
    ],
  };
}

function jump(history, steps) {
  invariant(Number.isNumber(steps) || steps === undefined, 'must pass a number (or undefined) of steps');

  const { past, present, future } = history;

  if (steps === -1) return undo(history);
  if (steps === 0 || steps === undefined) return redo(history);
  if (steps < -1) {
    //past
    return {
      future: past.slice(steps + 1)
        .concat([present])
        .concat(future),
      present: past[steps],
      past: past.slice(0, steps),
    };
  }

  //else, future (steps > 1)
  return {
    future: future.slice(steps + 1),
    present: future[steps],
    past: past.concat([present])
      .concat(future.slice(0, steps)),
  };
}

function ignore(steps) {
  toIgnore = steps === null ? 0 : toIgnore + steps;
  return toIgnore;
}

/*** debug helpers ***/

function debug(...args) {
  if (!console.group) {
    args.unshift('%credux-undo', 'font-style: italic');
  }
  console.log(...args);
}
function debugStart(action, state) {
  if (__DEBUG__) {
    const args = ['action', action.type];
    if (console.group) {
      args.unshift('%credux-undo', 'font-style: italic');
      console.groupCollapsed(...args);
      console.log('received', {state, action});
    } else {
      debug(...args);
    }
  }
}
function debugEnd() {
  if (__DEBUG__) {
    return console.groupEnd && console.groupEnd();
  }
}

export default undoStoreEnhancer;
