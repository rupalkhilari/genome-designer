import * as ActionTypes from '../constants/ActionTypes';

//testing
import { makeBlock } from '../utils/schemaGenerators';

//testing, default should be {}
const initialState = {
  "block1" : Object.assign(makeBlock('block1'), {
    components: ['part1', 'part2', 'part3']
  }),
  "block2" : Object.assign(makeBlock('block2'), {
    components: ['part4', 'part5', 'part6']
  })
};

export default function blocks (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.BLOCK_ADD_BLOCK : {
      //todo - should return the generated block to action creator
      const { block } = action,
            blockId = block.id;

      return Object.assign({}, state, { [blockId] : block });
    }
    default : {
      return state;
    }
  }
}
