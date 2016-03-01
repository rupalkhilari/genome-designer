import * as ActionTypes from '../constants/ActionTypes';

/**
 * user = { userid:, email:, firstName:, lastName }
 */
export const userSetUser = (user) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.USER_SET_USER,
      user: user,
    });
    return user;
  };
};
