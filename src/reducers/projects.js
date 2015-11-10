import * as ActionTypes from '../constants/ActionTypes';
import { makeProject } from '../utils/schemaGenerators';

//testing, default should be {}
const initialState = {
  test: Object.assign(makeProject('test'), {
    components: ['block1', 'block2'],
  }),
};

export default function projects(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PROJECT_CREATE : {
    const { project } = action;
    const projectId = project.id;

    if (!projectId && process.env.NODE_ENV !== 'project') {
      /* eslint no-console: [0] */
      console.warn('Attempted to create project without an ID. Pass the project.', project);
      return state;
    }

    return Object.assign({}, state, {[projectId]: project});
  }

    //associated construct with project. Need to create construct on its own.
  case ActionTypes.PROJECT_ADD_CONSTRUCT : {
    //note - using _.merge() would simplify this a lot
    const { projectId, constructId } = action;
    const oldProject = state[projectId];
    const newComponents = Array.isArray(oldProject.components) ? oldProject.components.slice() : [];
    newComponents.push(constructId);
    const newProject = Object.assign({}, oldProject, {components: newComponents});

    return Object.assign({}, state, {[projectId]: newProject});
  }

  default : {
    return state;
  }
  }
}
