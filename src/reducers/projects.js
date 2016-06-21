import * as ActionTypes from '../constants/ActionTypes';
import * as instanceMap from '../store/instanceMap';
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
    instanceMap.saveProject(project);
    return Object.assign({}, state, { [project.id]: project });

  case ActionTypes.PROJECT_SNAPSHOT :
  case ActionTypes.PROJECT_SAVE :
    const { projectId, sha, time } = action;
    const gotProject = state[projectId];
    const updatedProject = gotProject.updateVersion(sha, time);
    instanceMap.saveProject(updatedProject);
    return Object.assign({}, state, { [projectId]: updatedProject });

  case ActionTypes.PROJECT_LIST :
    const { projects } = action;
    instanceMap.saveProject(...projects);
    const zippedProjects = projects.reduce((acc, project) => Object.assign(acc, { [project.id]: project }), {});
    //prefer state versions to zipped versions
    return Object.assign({}, zippedProjects, state);

  case ActionTypes.PROJECT_DELETE : {
    const { projectId } = action;
    const nextState = Object.assign({}, state);
    delete nextState[projectId];
    instanceMap.removeProject(projectId);
    return nextState;
  }

  case ActionTypes.USER_SET_USER :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
