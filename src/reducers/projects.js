import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

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
