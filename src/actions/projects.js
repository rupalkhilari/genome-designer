import * as ActionTypes from '../constants/ActionTypes';

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

    return Promise.resolve(project)
      .then((project) => {
        dispatch({
          type: ActionTypes.PROJECT_CREATE,
          project,
        });
        return project;
      });
  };
};


//this is a backup for performing arbitrary mutations
export const projectMerge = (projectId, toMerge) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.merge(toMerge);

    return Promise.resolve(project)
      .then((project) => {
        dispatch({
          type: ActionTypes.PROJECT_MERGE,
          project,
        });
        return project;
      });
  };
};

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const projectAddConstruct = (projectId, componentId, index) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.addComponent(componentId, index);

    return Promise.resolve(project)
      .then((project) => {
        dispatch({
          type: ActionTypes.PROJECT_ADD_CONSTRUCT,
          project,
        });
        return project;
      });
  };
};
