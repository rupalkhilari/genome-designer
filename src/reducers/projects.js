import * as ActionTypes from '../constants/ActionTypes';
import { makeProject } from '../utils/schemaGenerators';
import UUID from '../utils/generators/UUID';

import { blockAddBlock } from '../actions';

//testing, default should be {}
const initialState = {
  "test" : Object.assign(makeProject('test'), {
    components: ["block1",  "block2"]
  })
};

export default function projects (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.PROJECT_ADD_CONSTRUCT : {

      // todo - should be adding blocks to own section of state, not inside the project
      // use blockAddBlock

      const { id, construct } = action,
            oldProject = state[id] || {},
            newComponents = Array.isArray(oldProject.components) ? oldProject.components.slice() : [],
            _ignore = newComponents.push(construct),
            newProject = Object.assign({}, oldProject, {components: newComponents});

      return Object.assign({}, state, {[id] : newProject});
    }
    case ActionTypes.PROJECT_CREATE : {
      //todo - should return the generated project to action creator so knows ID
      const newProject = makeProject(),
            projectId = newProject.id;

      return Object.assign({}, state, {[projectId] : newProject});
    }
    default : {
      return state;
    }
  }
}
