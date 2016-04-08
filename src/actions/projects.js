import * as ActionTypes from '../constants/ActionTypes';
import { saveProject, loadProject, snapshot, listProjects } from '../middleware/api';
import * as projectSelectors from '../selectors/projects';

import Block from '../models/Block';
import Project from '../models/Project';

import { setItem } from '../middleware/localStorageCache';

//Promise
export const projectList = () => {
  return (dispatch, getState) => {
    return listProjects()
      .then(projectManifests => {
        const projects = projectManifests.map(manifest => new Project(manifest));

        dispatch({
          type: ActionTypes.PROJECT_LIST,
          projects,
        });

        return projects;
      });
  };
};

//create a new project
export const projectCreate = (initialModel) => {
  return (dispatch, getState) => {
    const project = new Project(initialModel);
    dispatch({
      type: ActionTypes.PROJECT_CREATE,
      project,
    });
    return project;
  };
};

//Promise
export const projectSave = (projectId) => {
  return (dispatch, getState) => {
    const project = getState().projects[projectId];
    const roll = dispatch(projectSelectors.projectCreateRollup(projectId));
    setItem('mostRecentProject', projectId);
    return saveProject(projectId, roll)
      .then(json => {
        dispatch({
          type: ActionTypes.PROJECT_SAVE,
          project,
        });
        return json;
      });
  };
};

//Promise
export const projectSnapshot = (projectId, message) => {
  return (dispatch, getState) => {
    const roll = dispatch(projectSelectors.projectCreateRollup(projectId));
    return snapshot(projectId, roll, message)
      .then(sha => {
        dispatch({
          type: ActionTypes.PROJECT_SNAPSHOT,
          sha,
        });
        return sha;
      });
  };
};

//Promise
export const projectLoad = (projectId) => {
  return (dispatch, getState) => {
    return loadProject(projectId)
      .then(rollup => {
        const { project, blocks } = rollup;
        const projectModel = new Project(project);

        //todo (future) - transaction
        blocks.forEach((blockObject) => {
          const block = new Block(blockObject);
          dispatch({
            type: ActionTypes.BLOCK_LOAD,
            block,
          });
        });

        dispatch({
          type: ActionTypes.PROJECT_LOAD,
          project: projectModel,
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
    dispatch({
      type: ActionTypes.PROJECT_MERGE,
      undoable: true,
      project,
    });
    return project;
  };
};

export const projectRename = (projectId, newName) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.mutate('metadata.name', newName);
    dispatch({
      type: ActionTypes.PROJECT_RENAME,
      undoable: true,
      project,
    });
    return project;
  };
};

//Adds a construct to a project. Does not create the construct. Use blocks.js
export const projectAddConstruct = (projectId, componentId) => {
  return (dispatch, getState) => {
    const oldProject = getState().projects[projectId];
    const project = oldProject.addComponents(componentId);
    dispatch({
      type: ActionTypes.PROJECT_ADD_CONSTRUCT,
      undoable: true,
      project,
    });
    return project;
  };
};
