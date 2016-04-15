import invariant from 'invariant';
import { debounce, throttle } from 'lodash';
import { FORCE_SAVE } from './ActionTypes';

export default function autosavingCreator(config) {
  invariant(typeof config.onSave === 'function', 'must pass onSave to autosaving middleware');

  const options = Object.assign({
    time: 20 * 1000, //throttle autosave requests, 20 sec
    wait: 3 * 1000, //debounce wait time, 2.5 sec
    onSave: (nextState) => { throw new Error('onSave is required'); },
    filter: (action, alreadyDirty, nextState, lastState) => nextState !== lastState, //filter for triggering autosave events
    purgeOn: (action, alreadyDirty, nextState, lastState) => false, //will cancel throttled calls if pass function
    forceOn: (action, alreadyDirty) => false, //force save on certain actions (so not debounced)
    forceSaveActionType: FORCE_SAVE,
  }, config);

  let lastSaved = 0;
  let dirty = false;

  const getLastSaved = () => lastSaved;
  const isDirty = () => dirty;

  const handleSave = (nextState) => {
    console.log('saving');
    lastSaved = +Date.now();
    options.onSave(nextState);
    dirty = false;
  };

  //trigger at start, and end if more were batched
  const throttledSave = throttle(handleSave, options.time, {
    leading: true,
    trailing: true,
  });

  //want to initiate saves debounced
  //not check saves debounced
  const debouncedInitiateSave = debounce(throttledSave, options.wait, {
    leading: false,
    trailing: true,
    maxWait: options.time,
  });

  const checkSave = (action, nextState, lastState) => {
    if (options.filter(action, dirty, nextState, lastState) === true) {
      dirty = true;
    }
    return dirty;
  };

  const purgeDebounced = () => {
    throttledSave.cancel();
    debouncedInitiateSave.cancel();
  };

  const handleForceSave = (state) => {
    purgeDebounced();
    handleSave(state);
    return state;
  };

  const autosaveReducerEnhancer = reducer => {
    //track for reducer initial state because if the reducer e.g. use default prop of an object, reference will be different between initial state we compute here and when the reducer computes initial state as normal, triggering save on store initialization
    let initialized = false;

    return (state, action) => {
      //intercept action, dont need to run reducer
      if (action.type === options.forceSaveActionType || options.forceOn(action, dirty) === true) {
        handleForceSave(state);
        return state;
      }

      const nextState = reducer(state, action);

      if (options.purgeOn(action, dirty, nextState, state) === true) {
        purgeDebounced();
      }

      //function call so easy to transition to debounced version
      if (checkSave(action, nextState, state) && !!initialized) {
        debouncedInitiateSave(nextState);
      }

      initialized = true;

      return nextState;
    };
  };

  return {
    autosaveReducerEnhancer,
    getLastSaved,
    isDirty,
  };
}
