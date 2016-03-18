import uuid from 'node-uuid';
import invariant from 'invariant';
import * as ActionTypes from './ActionTypes';
import SectionManager from './SectionManager';
import UndoManager from './UndoManager';

const undoManager = new UndoManager();

//todo - ensure this runs after the enhancer has run (relies on key order in rootReducer currently)
export const undoReducer = (state = {}, action) => {
  const { past, future, time } = undoManager.getCurrentState();

  if (state.past === past && state.future === future) {
    return state;
  }

  return {
    past,
    future,
    time,
  };
};

export const undoReducerEnhancerCreator = (config) => {
  const params = Object.assign({
    purgeOn: () => false,
    filter: () => false,
    debug: (process && process.env && process.env.NODE_ENV === 'dev'),
  }, config);

  return (reducer, key = reducer.name || uuid.v4()) => {
    invariant(key, 'key is required, key in e.g. combineReducers');
    const initialState = reducer(undefined, {});

    //create a manager for this section of the store, register()
    const sectionManager = new SectionManager(initialState, params);
    undoManager.register(key, sectionManager);

    return (state = initialState, action) => {
      switch (action.type) {
      case ActionTypes.UNDO :
        undoManager.undo(action);
        break;
      case ActionTypes.REDO :
        undoManager.redo(action);
        break;
      case ActionTypes.JUMP :
        const { number } = action;
        undoManager.jump(number, action);
        break;

      case ActionTypes.TRANSACT :
        undoManager.transact();
        break;
      case ActionTypes.COMMIT :
        undoManager.commit();
        break;
      case ActionTypes.ABORT :
        undoManager.abort();
        break;
      default:
        //no impact on undo manager, compute as normal
      }

      const undoActionCalled = Object.keys(ActionTypes).map(key => ActionTypes[key]).indexOf(action.type) >= 0;

      // if undomanager was called, then dont want to just return the state (will pass === check), want to retrieve state from the reducer.
      // We don't need to calculate the next state because the action is not relevant
      if (undoActionCalled) {
        return sectionManager.getCurrentState();
      }

      const nextState = reducer(state, action);

      //on redux init types, reset the history
      if (['@@redux/INIT', '@@INIT'].some(type => type === action.type)) {
        undoManager.purge();
        undoManager.patch(nextState, action);
        return sectionManager.getCurrentState();
      }

      //if nothing has changed, dont bother hitting UndoManager
      if (nextState === state) {
        return state;
      }

      //if we make it this far, then this reducer has been affected and we can assume the action is specific to this section of reducers
      //todo - ensure dont call manager functions twice, or are idempotent

      //if marked to purge, lets clear the history
      if (!!action.undoPurge || params.purgeOn(action, state)) {
        undoManager.purge(action);
      } else if (!!action.undoable || params.filter(action, state)) {
        //shouldnt have undoPurge and undoable on same action
        undoManager.insert(key, nextState, action);
      } else {
        //if not tracked as undoable, update present state
        undoManager.patch(key, nextState, action);
      }

      //should be consistent with the return if undoActionCalled
      return sectionManager.getCurrentState();
    };
  };
};

export default undoReducerEnhancerCreator;
