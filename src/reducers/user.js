import * as ActionTypes from '../constants/ActionTypes';

export const initialState = {
  userid: null,
  email: null,
  firstName: null,
  lastName: null
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.USER_SET_USER: {
      const { userid, email, firstName, lastName } = action.user;
      return Object.assign({}, state, {
        userid: userid,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
    }
    default : {
      return state;
    }
  }
}
