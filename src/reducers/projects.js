import * as ActionTypes from '../constants/ActionTypes';
import Project from '../models/Project';
import merge from 'lodash.merge';

//testing, default should be {} (but need to hydrate to models)
const initialState = {
  test: merge(new Project('test'), {
    metadata: {
      name: 'My Test Project',
      description: 'Growing hairless humans for the next line of Calvin Klein models.',
    },
    components: ['block1', 'block2'],
  }),
};

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE : {
    const { project } = action;
    const projectId = project.id;

    if (!projectId && process.env.NODE_ENV !== 'production') {
      /* eslint no-console: [0] */
      console.warn('Attempted to create project without an ID. Pass the project.', project);
      return state;
    }

    return Object.assign({}, state, {[projectId]: project});
  }

  case ActionTypes.PROJECT_CREATE : {
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
