import autosaveCreator from './autosaveCreator';

const autosave = autosaveCreator({
  //filter to undoable actions, which basically are the ones that are state changes (undoable reducer relies on these)
  filter: (action, nextState, lastState) => !!action.undoable,

  //this is pretty hack, but want to rely on action to do this (and actions have a dependency on the store, so cant import directly or create circular dependency. just need to be sure this doesnt run until after everything has been set up...
  onSave: () => {
    global.gd.api.project.projectSave();
  },
});

export default autosave;
