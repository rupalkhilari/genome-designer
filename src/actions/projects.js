import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import Project from '../models/Project';

//create a new project
export const projectCreate = (name) => {
  return (dispatch, getState) => {
    //temp - force name as ID. will need to reconfigure routing
    const project = new Project({
      id: name, //hack... todo - deprecate
      metadata: {
        name,
      },
    });

    dispatch({
      type: ActionTypes.PROJECT_CREATE,
      project,
    });
    return project;
  };
};


//this is a backup for performing arbitrary mutations
export const projectMerge = makeActionCreator(ActionTypes.PROJECT_MERGE, 'projectId', 'toMerge');

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const projectAddConstruct = makeActionCreator(ActionTypes.PROJECT_ADD_CONSTRUCT, 'projectId', 'constructId');
