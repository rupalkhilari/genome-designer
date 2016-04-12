import invariant from 'invariant';
import { debounce, throttle } from 'lodash';
import { FORCE_SAVE } from './ActionTypes';

//todo - avoid triggering change if initiated by onSave

export default function autosavingCreator(config) {
  invariant(typeof config.onSave === 'function', 'must pass onSave to autosaving middleware');

  const options = Object.assign({
    time: 30 * 1000, //throttle autosave requests, 30 sec
    wait: 5 * 1000, //debounce wait time, 5 sec
    filter: () => true, //in addition to state change, pass a filter for triggering autosave events
    purgeOn: () => false, //will cancel throttled calls if pass function
    onSave: () => {},
    forceSaveActionType: FORCE_SAVE,
  }, config);

  let lastSaved = 0;
  let dirty = false;

  const getLastSaved = () => lastSaved;
  const isDirty = () => dirty;

  const handleSave = (nextState) => {
    lastSaved = +Date.now();
    options.onSave(nextState);
    dirty = false;
  };

  //trigger at start, and end if more were batched
  const throttledSave = throttle(handleSave, options.time, {
    leading: true,
    trailing: true,
  });

  const checkSave = (action, nextState, lastState) => {
    if (lastState !== nextState && options.filter(action, nextState, lastState)) {
      dirty = true;
    }
    return dirty;
  };

  //if we want to debounce checking whether to save
  const checkSaveDebounced = debounce(checkSave, options.wait, {
    leading: false,
    maxWait: 15 * 1000,
  });

  const autosaveReducerEnhancer = reducer => {
    //track for reducer initial state because if the reducer e.g. use default prop of an object, reference will be different between initial state we compute here and when the reducer computes initial state as normal, triggering save on store initialization
    let initialized = false;

    return (state, action) => {
      if (action.type === options.forceSaveActionType) {
        throttledSave.cancel();
        handleSave(state);
        return state;
      }

      const nextState = reducer(state, action);

      if (options.purgeOn(action, nextState, state)) {
        throttledSave.cancel();
      }

      //function call so easy to transition to debounced version
      if (checkSave(action, nextState, state) && !!initialized) {
        throttledSave(nextState);
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
