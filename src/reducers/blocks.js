import * as ActionTypes from '../constants/ActionTypes';
import dummyBlocks from '../inventory/andrea';
import exampleWithAnnotations from '../inventory/examples/exampleWithAnnotations';
import { blocks as testBlocks } from './testProject';

const initialState = testBlocks.reduce((acc, block) => Object.assign(acc,
  { [block.id]: block }
), {});

export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE :
    //case ActionTypes.BLOCK_SAVE :
  case ActionTypes.BLOCK_LOAD :
  case ActionTypes.BLOCK_MERGE :
  case ActionTypes.BLOCK_RENAME :
  case ActionTypes.BLOCK_SET_COLOR :
  case ActionTypes.BLOCK_CLONE :
  case ActionTypes.BLOCK_SET_SBOL :
  case ActionTypes.BLOCK_ANNOTATE :
  case ActionTypes.BLOCK_REMOVE_ANNOTATION :
  case ActionTypes.BLOCK_SET_SEQUENCE :
  case ActionTypes.BLOCK_COMPONENT_ADD :
  case ActionTypes.BLOCK_COMPONENT_MOVE :
  case ActionTypes.BLOCK_COMPONENT_REMOVE :
  {
    const { block } = action;
    return Object.assign({}, state, { [block.id]: block });
  }
  case ActionTypes.BLOCK_DELETE :
  {
    const { blockId } = action;
    const nextState = Object.assign({}, state);
    delete nextState[blockId];
    return nextState;
  }
  default :
  {
    return state;
  }
  }
}
