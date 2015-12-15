import * as ActionTypes from '../constants/ActionTypes';
import dummyBlocks from '../inventory/dummyBlocks';

//testing
import Block from '../models/Block';

//testing, default should be {} (but need to hydrate to models)
const [child1, child2, child3, child4, child5, ...rest] = dummyBlocks;
const initialState = {
  block1: Object.assign(new Block('block1'), {
    components: [child1.id, child2.id, child3.id],
  }),
  block2: Object.assign(new Block('block2'), {
    components: [child4.id, child5.id],
  }),
  [child1.id]: new Block(child1),
  [child2.id]: new Block(child2),
  [child3.id]: new Block(child3),
  [child4.id]: new Block(child4),
  [child5.id]: new Block(child5),
};

export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE :
  case ActionTypes.BLOCK_SAVE :
  case ActionTypes.BLOCK_MERGE :
  case ActionTypes.BLOCK_RENAME :
  case ActionTypes.BLOCK_CLONE :
  case ActionTypes.BLOCK_SET_SBOL :
  case ActionTypes.BLOCK_ANNOTATE :
  case ActionTypes.BLOCK_REMOVE_ANNOTATION :
  case ActionTypes.BLOCK_SET_SEQUENCE :
  case ActionTypes.BLOCK_ADD_COMPONENT :
  {
    const { block } = action;
    return Object.assign({}, state, {[block.id]: block});
  }

  default :
  {
    return state;
  }
  }
}
