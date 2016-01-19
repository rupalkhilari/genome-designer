import * as ActionTypes from '../constants/ActionTypes';
import Project from '../models/Project';

const initialState = {
  test: new Project({
    id: 'test',
    metadata: {
      name: 'My Test Project',
      description: 'Create a versatile and robust templating system for combinatorial recombinant designs using Yeast parts from EGF.',
    },
    components: ['block1', 'block2'],
  }),
};

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE :
  case ActionTypes.PROJECT_MERGE :
  case ActionTypes.PROJECT_RENAME :
  case ActionTypes.PROJECT_ADD_CONSTRUCT : {
    const { project } = action;
    return Object.assign({}, state, {[project.id]: project});
  }

  default : {
    return state;
  }
  }
}
