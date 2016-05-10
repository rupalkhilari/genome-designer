import * as ActionTypes from '../constants/ActionTypes';
import { project as testProject } from './testProject';

const initialState = {};

if (process.env.NODE_ENV === 'test') {
  Object.assign(initialState, {
    test: testProject,
  });
}

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE :
  case ActionTypes.PROJECT_LOAD :
  case ActionTypes.PROJECT_MERGE :
  case ActionTypes.PROJECT_RENAME :
  case ActionTypes.PROJECT_REMOVE_CONSTRUCT:
  case ActionTypes.PROJECT_ADD_CONSTRUCT :
    const { project } = action;
    return Object.assign({}, state, { [project.id]: project });

  case ActionTypes.PROJECT_SNAPSHOT :
  case ActionTypes.PROJECT_SAVE :
    const { projectId, sha } = action;
    const gotProject = state[projectId];
    const updatedProject = gotProject.updateVersion(sha);
    return Object.assign({}, state, { [projectId]: updatedProject });

  case ActionTypes.PROJECT_LIST :
    const { projects } = action;
    const zippedProjects = projects.reduce((acc, project) => Object.assign(acc, { [project.id]: project }), {});
    //prefer state versions to zipped versions
    return Object.assign({}, zippedProjects, state);

  default :
    return state;
  }
}
