import * as ActionTypes from '../constants/ActionTypes';
import { register, login, logout, updateAccount } from '../middleware/api';

const mapUserFromServer = (serverUser) => ({
  userid: serverUser.uuid,
  firstName: serverUser.firstName,
  lastName: serverUser.lastName,
  email: serverUser.email,
});

/**
 * user = { userid:, email:, firstName:, lastName }
 */
const _userSetUser = (user) => ({
  type: ActionTypes.USER_SET_USER,
  user,
});

//Promise
export const userLogin = (email, password) => {
  return (dispatch, getState) => {
    return login(email, password)
      .then(user => {
        const mappedUser = mapUserFromServer(user);
        const setUserPayload = _userSetUser(mappedUser);
        dispatch(setUserPayload);
        return mappedUser;
      });
  };
};

//Promise
export const userLogout = () => {
  return (dispatch, getState) => {
    return logout()
      .then(() => {
        const setUserPayload = _userSetUser({});
        dispatch(setUserPayload);
        return true;
      })
      .catch(() => {
        const setUserPayload = _userSetUser({});
        dispatch(setUserPayload);
        return true;      
      });
  };
};

//Promise
////email, password, firstName, lastName
export const userRegister = (user) => {
  return (dispatch, getState) => {
    return register(user)
      .then(user => {
        const mappedUser = mapUserFromServer(user);
        const setUserPayload = _userSetUser(mappedUser);
        dispatch(setUserPayload);
        return user;
      });
  };
};

export const userUpdate = (user) => {
  return (dispatch, getState) => {
    return updateAccount(user)
      .then(user => {
        const mappedUser = mapUserFromServer(user);
        const setUserPayload = _userSetUser(mappedUser);
        dispatch(setUserPayload);
        return user;
      });
  };
};
