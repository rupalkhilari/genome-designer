import autosaveCreator from './autosaveCreator';
import * as ActionTypes from '../../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';

const purgeEvents = [
  //ActionTypes.PROJECT_SAVE, //dont purge on this, since call it on save, will never throttle
  ActionTypes.PROJECT_SNAPSHOT,
  //LOCATION_CHANGE, //forceOn will handle purging for us, do not needed here
];

const simulateEvents = [
  ActionTypes.PROJECT_SAVE,
  ActionTypes.PROJECT_SNAPSHOT,
];

const autosave = autosaveCreator({
  //filter to undoable actions, which basically are the ones that are state changes (undoable reducer relies on these)
  filter: (action, alreadyDirty, nextState, lastState) => !!action.undoable,

  //also, force on location change
  //want this to run prior to route change -- note if have other middleware to prune store
  //only run if this reducer was updated so compare states
  //if dont compare states, will likely trigger on all route changes (including init, which will not find window.gd.api
  forceOn: ({ type }, alreadyDirty) => {
    return type === LOCATION_CHANGE && alreadyDirty;
  },

  //this is pretty hack, but want to rely on action to do this (and actions have a dependency on the store, so cant import directly or create circular dependency. just need to be sure this doesnt run until after everything has been set up...
  onSave: () => {
    window.gd.api.projects.projectSave();
  },

  purgeOn: ({ type }, alreadyDirty, nextState, lastState) => {
    return purgeEvents.some(eventType => eventType === type);
  },

  simulateOn: ({ type }, alreadyDirty) => {
    return simulateEvents.some(eventType => eventType === type);
  },
});

export default autosave;
