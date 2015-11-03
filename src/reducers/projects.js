import * as ActionTypes from '../constants/ActionTypes';
import { makeProject } from '../utils/schemaGenerators';
import UUID from '../utils/generators/UUID';

//testing, default should be {}
const initialState = {
  "test": Object.assign(makeProject('test'), {
    components: ["block1", "block2"]
  })
};

export default function projects (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.PROJECT_CREATE :
    {
      const { project } = action,
            projectId = project.id;

      if (!projectId) {
        console.warn('Attempted to create project without an ID. Pass the project.', project);
        return state;
      }

      return Object.assign({}, state, {[projectId]: project});
    }

    //associated construct with project. Need to create construct on its own.
    case ActionTypes.PROJECT_ADD_CONSTRUCT :
    {
      const { projectId, constructId } = action,
            //note - using _.merge() would simplify this a lot
            oldProject = state[projectId],
            newComponents = Array.isArray(oldProject.components) ? oldProject.components.slice() : [],
            _ignore = newComponents.push(constructId),
            newProject = Object.assign({}, oldProject, {components: newComponents});

      return Object.assign({}, state, {[projectId]: newProject});
    }
    default :
    {
      return state;
    }
  }
}
