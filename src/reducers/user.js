import invariant from 'invariant';
import * as ActionTypes from '../constants/ActionTypes';

const flashedUser = global.flashedUser || {};
const initialState = {
  userid: flashedUser.userid || null,
  email: flashedUser.email || null,
  firstName: flashedUser.firstName || null,
  lastName: flashedUser.lastName || null,
};

export default function user(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.USER_SET_USER: {
      invariant(typeof action.user === 'object', 'user must be object (can be empty)');
      const {
        userid = null,
        email = null,
        firstName = null,
        lastName = null,
      } = action.user;

      return Object.assign({}, state, {
        userid,
        email,
        firstName,
        lastName,
      });
    }
    default :
      return state;
  }
}
