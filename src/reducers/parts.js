import * as ActionTypes from '../constants/ActionTypes';
import { makePart } from '../utils/schemaGenerators';

const initialState = {
  "part1" : makePart('part1', 300),
  "part2" : makePart('part2', 300),
  "part3" : makePart('part3', 300),
  "part4" : makePart('part4', 300),
  "part5" : makePart('part5', 300),
  "part6" : makePart('part6', 300),
};

export default function parts (state = initialState, action) {

  switch (action.type) {
    case ActionTypes.PART_UPDATE_NAME : {

      //todo - get this action working
      console.warn('updating part names doesnt work yet...');

     return state;
    }
    default : {
      return state;
    }
  }
}
