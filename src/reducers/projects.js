import * as ActionTypes from '../constants/ActionTypes';

//testing
import { makeConstruct } from '../utils/randomGenerators';

//testing
const initialState = {
  "test" : {
    id : "test",
    metadata: {
      name : "Test Project",
      description: "Sample Description of the Project. I'm trying to engineer hairless humans for the next wave of Calvin Klein models.",
      authors: [],
      tags : {
        keywords : ['the future', 'human']
      }
    },
    components: [
      makeConstruct(100, 500, 750),
      makeConstruct(200, 100, 450),
    ]
  }
};

export default function projects (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.PROJECT_ADD_CONSTRUCT : {

      //todo - should be adding blocks to own section of state, not inside the project

      const { id, construct } = action,
            oldProject = state[id] || {},
            newComponents = Array.isArray(oldProject.components) ? oldProject.components.slice() : [],
            _ignore = newComponents.push(construct),
            newProject = Object.assign({}, oldProject, {components: newComponents});

      return Object.assign({}, state, {[id] : newProject});
    }
    default : {
      return state;
    }
  }
}
