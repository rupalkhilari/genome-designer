import * as ActionTypes from '../constants/ActionTypes';
import { makePart } from '../utils/schemaGenerators';

const initialState = {
  "part1" : makePart('part1', 300),
  "part2" : makePart('part2', 300),
  "part3" : makePart('part3', 300),
  "part4" : makePart('part4', 300),
  "part5" : makePart('part5', 300),
};

export default function parts (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.PART_CREATE : {
      const { part } = action,
            partId = part.id;

      return Object.assign({}, state, { [partId] : part });
    }
    case ActionTypes.PART_RENAME : {
      const { partId , name } = action;

      let newPart = Object.assign({}, state[partId]);
      newPart.metadata.name =  name;

      return Object.assign({}, state, {[partId] : newPart});
    }
    default : {
      return state;
    }
  }
}
