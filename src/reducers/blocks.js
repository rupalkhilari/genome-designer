import * as ActionTypes from '../constants/ActionTypes';

//testing
import Block from '../models/Block';

//testing, default should be {}
const initialState = {
  block1: Object.assign(new Block('block1'), {
    components: ['part1', 'part2', 'part3'],
  }),
  block2: Object.assign(new Block('block2'), {
    components: ['part4', 'part5'],
  }),
};

export default function blocks(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.BLOCK_CREATE : {
    const { block } = action;
    const blockId = block.id;

    return Object.assign({}, state, {[blockId]: block});
  }

  case ActionTypes.BLOCK_ADD_COMPONENT : {
    //note - using _.merge() would simplify this a lot
    const { blockId, componentId } = action;
    const oldBlock = state[blockId];
    const newComponents = Array.isArray(oldBlock.components) ? oldBlock.components.slice() : [];
    newComponents.push(componentId);
    const newBlock = Object.assign({}, oldBlock, {components: newComponents});

    return Object.assign({}, state, {[blockId]: newBlock});
  }

  default : {
    return state;
  }
  }
}
