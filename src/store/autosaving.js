import invariant from 'invariant';
import { debounce, throttle } from 'lodash';

//todo - this needs to update the project in the store with new version... or pass in the action to run?

export const forceSaveActionType = 'FORCE_SAVE';

export default function autosavingCreator(config) {
  invariant(typeof config.onSave === 'function', 'must pass onSave to autosaving middleware');

  const options = Object.assign({
    time: 3 * 60 * 1000, //throttle autosave requests
    wait: 5 * 1000, //debounce wait time
    onSave: () => {},
    forceSaveActionType,
  }, config);

  let lastSaved = 0;
  let lastState = null;
  let dirty = false;

  const getLastSaved = () => lastSaved;
  const isDirty = () => dirty;

  const handleSave = (nextState) => {
    console.log('saving', Date.now(), nextState);
    lastSaved = +Date.now();
    options.onSave(nextState);
    dirty = false;
  };

  //trigger at start, and end if more were batched
  const throttledSave = throttle(handleSave, options.time, {
    leading: true,
    trailing: true,
  });

  const checkSave = (nextState) => {
    if (lastState === nextState) return;
    dirty = true;
    throttledSave(nextState);
    lastState = nextState;
  };

  //if we want to debounce checking whether to save
  const checkSaveDebounced = debounce(checkSave, options.wait, {
    leading: false,
    maxWait: 15 * 1000,
  });

  const autosaveReducerEnhancer = reducer => {
    lastState = reducer(undefined, {});

    return (state, action) => {
      if (action.type === options.forceSaveActionType) {
        throttledSave.cancel();
        return handleSave(lastState);
      }

      const nextState = reducer(state, action);
      checkSave(nextState);
      return nextState;
    };
  };

  return {
    autosaveReducerEnhancer,
    getLastSaved,
    isDirty,
  };
}
