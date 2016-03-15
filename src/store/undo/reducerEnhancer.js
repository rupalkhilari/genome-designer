import * as ActionTypes from './ActionTypes';
import * as UndoManager from './UndoManager';

//todo - need to figure out how to update store on commit() and abort() - cannot initiate these changes from the reducer. Probably need to create an action to do this. Probably best for consistency if its all actions...

export default (config) => {
  const params = Object.assign({
    limit: false,
    trackAll: false,
    debug: (process.env.NODE_ENV !== 'production'),
    stateKey: 'undo',
  }, config);

  const manager = new UndoManager({
    limit: params.limit,
    debug: params.debug,
  });

  /*
   // ignoring because lose easy equality check between new computed state and prior state.
   // can add back in if merging here won't affect other === checks down the line, but think this through!
   // also, users they will just call actions (i.e. those we expose, not ones provided by this module), and only need to know about this if they want to e.g. show an dynamically disabled undo button
   // utility to merge undo state additions and state from other reducers
   const mergeState = (state) => {
   return Object.assign({
   [params.stateKey]: {
   past: manager.getPast().length,
   future: manager.getFuture().length,
   },
   }, state);
   };
   */

  return (reducer) => {
    //generate initial state
    //const initialState = mergeState(reducer(undefined, {}));
    const initialState = reducer(undefined, {});

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
        //todo - decide if to pass in state here. should not return here???
        manager.commit();
        return state;
      case ActionTypes.ABORT :
        //todo - should revert here
        return manager.abort();

      default :
        const nextState = reducer(state, action);

        //if nothing has changed, dont bother hitting UndoManager
        if (nextState === state) {
          return state;
        }

        //if action is marked as undoable, or set trackAll, update the manager
        if (action.undoable || !!params.trackAll) {
          return manager.update(nextState);
        }

        return nextState;
      }
    };
  };
};
