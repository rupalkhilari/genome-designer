import * as ActionTypes from '../constants/ActionTypes';
import { project as testProject } from './testProject';

const initialState = {
  test: testProject,
};

/*
const project_and_blocks = require('../../storage/imported_from_genbank.json');

const floProjectState = { test: project_and_blocks.project };

*/
export default function projects(state = initialState, action) {

//export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE :
  //case ActionTypes.PROJECT_SAVE :
  case ActionTypes.PROJECT_LOAD :
  case ActionTypes.PROJECT_MERGE :
  case ActionTypes.PROJECT_RENAME :
  case ActionTypes.PROJECT_ADD_CONSTRUCT : {
    const { project } = action;
    return Object.assign({}, state, { [project.id]: project });
  }

  case ActionTypes.PROJECT_LIST : {
    const { projects } = action;
    const zippedProjects = projects.reduce((acc, project) => Object.assign(acc, { [project.id]: project }), {});
    return Object.assign({}, state, zippedProjects);
  }

  default : {
    return state;
  }
  }
}
