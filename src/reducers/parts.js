import * as ActionTypes from '../constants/ActionTypes';
import Part from '../models/Part';

const initialState = {
  part1: new Part('part1', 300),
  part2: new Part('part2', 300),
  part3: new Part('part3', 300),
  part4: new Part('part4', 300),
  part5: new Part('part5', 300),
};

export default function parts(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.PART_CREATE : {
    const { part } = action;
    const partId = part.id;
    return Object.assign({}, state, {[partId]: part});
  }

  case ActionTypes.PART_RENAME : {
    const { partId, name } = action;
    const newPart = Object.assign({}, state[partId]);
    newPart.metadata.name = name;
    return Object.assign({}, state, {[partId]: newPart});
  }

  default : {
    return state;
  }
  }
}
