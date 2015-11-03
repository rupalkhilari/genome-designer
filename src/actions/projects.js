import * as ActionTypes from '../constants/ActionTypes';
import makeActionCreator from './makeActionCreator';

import { makeProject } from '../utils/schemaGenerators';

//create a new project
export const project_create = (name) => {
  return (dispatch, getState) => {
    //temp - force name as ID. will need to reconfigure routing
    let project = makeProject(name);
    if (name) {
      project.metadata.name = name;
    }
    dispatch({
      type: ActionTypes.PROJECT_CREATE,
      project
    });
    return project;
  };
};

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const project_addConstruct = makeActionCreator(ActionTypes.PROJECT_ADD_CONSTRUCT, 'projectId', 'constructId');