import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';
import invariant from 'invariant';

export const initialState = {
  forceProject: null, //forced model
  forceBlocks: [], //forced models
  projectId: null, //current project. Set by projectPage. preferred over route query.
  blockIds: [], //ids of selection
  constructId: null, //id of current
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.FOCUS_FORCE_PROJECT: {
    const { project } = action;
    return Object.assign({}, state, {
      forceProject: project,
      forceBlocks: [],
    });
  }
  case ActionTypes.FOCUS_FORCE_BLOCKS: {
    const { blocks } = action;
    invariant(Array.isArray(blocks), 'must pass array to FOCUS_FORCE_BLOCKS');
    return Object.assign({}, state, {
      forceBlocks: blocks,
      forceProject: null,
    });
  }
  case ActionTypes.FOCUS_PROJECT: {
    const { projectId } = action;
    return Object.assign({}, state, {
      forceProject: null,
      projectId: projectId,
    });
  }
  case ActionTypes.FOCUS_CONSTRUCT: {
    const { constructId } = action;
    return Object.assign({}, state, {constructId: constructId });
  }
  case ActionTypes.FOCUS_BLOCKS : {
    const { blockIds } = action;
    invariant(Array.isArray(blockIds), 'must pass array to FOCUS_BLOCKS');
    return Object.assign({}, state, {
      forceBlocks: [],
      blockIds: blockIds,
    });
  }
  case LOCATION_CHANGE: {
    return Object.assign({}, initialState);
  }
  default : {
    return state;
  }
  }
}
