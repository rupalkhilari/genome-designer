import * as ActionTypes from '../constants/ActionTypes';
import { LOCATION_CHANGE } from 'react-router-redux';
import invariant from 'invariant';

export const initialState = {
  forceProject: null, //forced model
  forceBlocks: [], //forced models
  project: null, //unclear? may want in dashboard. get from route
  blocks: [], //ids of selection
  construct: null, //id of current
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
      forceBlocks: [],
      blocks: blocks,
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
