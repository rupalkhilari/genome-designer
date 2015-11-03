import * as ActionTypes from '../constants/ActionTypes';

//testing
import { makeBlock } from '../utils/schemaGenerators';

//testing, default should be {}
const initialState = {
  "block1" : Object.assign(makeBlock('block1'), {
    components: ['part1', 'part2', 'part3']
  }),
  "block2" : Object.assign(makeBlock('block2'), {
    components: ['part4', 'part5']
  })
};

export default function blocks (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.BLOCK_CREATE : {
      const { block } = action,
            blockId = block.id;

      return Object.assign({}, state, { [blockId] : block });
    }
    case ActionTypes.BLOCK_ADD_COMPONENT : {
      const { blockId, componentId } = action,
            //note - using _.merge() would simplify this a lot
            oldBlock = state[blockId],
            newComponents = Array.isArray(oldBlock.components) ? oldBlock.components.slice() : [],
            _ignore = newComponents.push(componentId),
            newBlock = Object.assign({}, oldBlock, {components : newComponents});

      return Object.assign({}, state, {[blockId] : newBlock});
    }
    default : {
      return state;
    }
  }
}
