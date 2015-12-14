import * as ActionTypes from '../constants/ActionTypes';

//testing
import Block from '../models/Block';

//testing, default should be {} (but need to hydrate to models)
const initialState = {
  block1: Object.assign(new Block('block1'), {
    components: ['block3', 'block4', 'block5'],
  }),
  block2: Object.assign(new Block('block2'), {
    components: ['block6', 'block7'],
  }),
  block3: new Block('block3'),
  block4: new Block('block4'),
  block5: new Block('block5'),
  block6: new Block('block6'),
  block7: new Block('block7'),
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
  case ActionTypes.BLOCK_ADD_COMPONENT : {
    const { block } = action;
    return Object.assign({}, state, {[block.id]: block});
  }

  default : {
    return state;
  }
  }
}
