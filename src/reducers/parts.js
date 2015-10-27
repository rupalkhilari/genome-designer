import * as ActionTypes from '../constants/ActionTypes';

const initialState = {};

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
