import * as ActionTypes from '../constants/ActionTypes';
import Project from '../models/Project';

const initialState = {
  test: new Project({
    id: 'test',
    metadata: {
      name: 'My Test Project',
      description: 'Create a versatile and robust templating system for combinatorial recombinant designs using Yeast parts from EGF.',
    },
    //components: ['block1', 'block2'],
    components: ['block1'],
  }),
};

/*
const project_and_blocks = require('../../storage/imported_from_genbank.json');

const floProjectState = { test: project_and_blocks.project };

*/
export default function projects(state = initial, action) {

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
