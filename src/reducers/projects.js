import * as ActionTypes from '../constants/ActionTypes';
import Project from '../models/Project';

const initialState = {
  test: new Project({
    id: 'test',
    metadata: {
      name: 'My Test Project',
      description: 'Growing hairless humans for the next line of Calvin Klein models.',
    },
    components: ['block1', 'block2'],
  }),
};

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE :
  case ActionTypes.PROJECT_MERGE :
  case ActionTypes.PROJECT_ADD_CONSTRUCT : {
    const { project } = action;
    return Object.assign({}, state, {[project.id]: project});
  }

  default : {
    return state;
  }
  }
}
