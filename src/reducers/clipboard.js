import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  formats: [],
  data: [],
};

export default function clipboard(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.CLIPBOARD_SET_DATA:
    const { formats, data } = action;
    return Object.assign({}, state, { formats, data });

  case ActionTypes.USER_SET_USER :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
