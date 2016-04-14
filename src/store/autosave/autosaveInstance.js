import autosaveCreator from './autosaveCreator';
import * as ActionTypes from '../../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';

const purgeEvents = [
  ActionTypes.PROJECT_SAVE,
  ActionTypes.PROJECT_SNAPSHOT,
  LOCATION_CHANGE,
];

const autosave = autosaveCreator({
  //filter to undoable actions, which basically are the ones that are state changes (undoable reducer relies on these)
  filter: (action, nextState, lastState) => !!action.undoable,

  //this is pretty hack, but want to rely on action to do this (and actions have a dependency on the store, so cant import directly or create circular dependency. just need to be sure this doesnt run until after everything has been set up...
  onSave: () => {
    console.log('saving!');
    window.gd.api.projects.projectSave();
  },

  purgeOn: ({ type }, nextState, lastState) => purgeEvents.some(eventType => eventType === type),
});

export default autosave;
