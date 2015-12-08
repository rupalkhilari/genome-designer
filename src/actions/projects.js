import * as ActionTypes from '../constants/ActionTypes';

import Project from '../models/Project';

//create a new project
export const projectCreate = (initialModel) => {
  return (dispatch, getState) => {
    const project = new Project(initialModel);

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
export const projectAddConstruct = (projectId, componentId) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.addComponents(componentId);

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
