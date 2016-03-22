import * as ActionTypes from '../constants/ActionTypes';
import invariant from 'invariant';

export const initialState = {
  forceBlocks: null,
  forceProject: null,
  project: null,
  construct: null,
  blocks: [],
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.FOCUS_FORCE_PROJECT: {
    const { projectId } = action;
    return Object.assign({}, state, {
      forceProject: projectId,
    });
  }
  case ActionTypes.FOCUS_FORCE_BLOCKS: {
    const { blocks } = action;
    return Object.assign({}, state, {
      forceBlocks: blocks,
    });
  }
  case ActionTypes.FOCUS_PROJECT: {
    const { projectId } = action;
    return Object.assign({}, state, {
      forceProject: null,
      project: projectId,
    });
  }
  case ActionTypes.FOCUS_CONSTRUCT: {
    const { constructId } = action;
    return Object.assign({}, state, {construct: constructId });
  }
  case ActionTypes.FOCUS_BLOCKS : {
    const { blocks } = action;
    invariant(Array.isArray(blocks), 'must pass array to FOCUS_BLOCKS');
    return Object.assign({}, state, {
      forceBlocks: null,
      blocks: blocks,
    });
  }
  default : {
    return state;
  }
  }
}
