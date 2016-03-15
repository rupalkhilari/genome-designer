import * as ActionTypes from './ActionTypes';
import UndoManager from './UndoManager';

export default (config) => {
  const params = Object.assign({
    trackAll: false,
    debug: (process && process.env && process.env.NODE_ENV !== 'production'),
    stateKey: 'undo',
  }, config);

  const manager = new UndoManager({
    debug: params.debug,
  });

  // utility to merge undo state additions and state from other reducers
  //by merging directly onto the state, keep reference equality check
  const mergeState = (state) => {
    return Object.assign(state, {
      [params.stateKey]: {
        past: manager.getPast().length,
        future: manager.getFuture().length,
      },
    });
  };

  return (reducer) => {
    //generate initial state
    const initialState = mergeState(reducer(undefined, {}));
    //const initialState = reducer(undefined, {});

    return (state = initialState, action) => {
      switch (action.type) {
      case ActionTypes.UNDO :
        return manager.undo();
      case ActionTypes.REDO :
        return manager.redo();
      case ActionTypes.JUMP :
        const { number } = action;
        return manager.jump(number);

      case ActionTypes.TRANSACT :
        manager.transact();
        return state;
      case ActionTypes.COMMIT :
        return manager.commit();
      case ActionTypes.ABORT :
        return manager.abort();

      default :
        const nextState = mergeState(reducer(state, action));
        //const nextState = reducer(state, action);

        //if nothing has changed, dont bother hitting UndoManager
        if (nextState === state) {
          return state;
        }

        //if action is marked as undoable, or set trackAll, update the manager
        if (action.undoable || !!params.trackAll) {
          return manager.update(nextState, action);
        }

        return nextState;
      }
    };
  };
};
