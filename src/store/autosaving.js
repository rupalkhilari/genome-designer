let dirty = false;
let lastSaved = +Date.now();

export const getLastSaved = () => {
  return lastSaved;
};


//todo - save last state and compare, if different then trigger a debounced autosaving function
export default function autosavingMiddleware({dispatch, getState}) {
  return next => action => {
    const nextState = next(action);
  };
}
