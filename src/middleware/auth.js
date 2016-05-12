import rejectingFetch from './rejectingFetch';
import invariant from 'invariant';
import { headersGet, headersPost, headersPut, headersDelete } from './headers';
import { authPath } from './paths';

const authFetch = (...args) => {
  return rejectingFetch(...args)
    .then(resp => {
      return resp.json();
    })
    .catch(resp => resp.json().then(err => Promise.reject(err)));
};

// login with email and password and set the sessionKey (cookie) for later use
export const login = (user, password) => {
  const body = {
    email: user,
    password: password,
  };
  const stringified = JSON.stringify(body);

  return authFetch(authPath('login'), headersPost(stringified));
};

export const register = (user) => {
  invariant(user.email && user.password && user.firstName && user.lastName, 'wrong format user');
  const stringified = JSON.stringify(user);

  return authFetch(authPath('register'), headersPost(stringified));
};

export const forgot = (email) => {
  const body = { email };
  const stringified = JSON.stringify(body);

  return authFetch(authPath('forgot-password'), headersPost(stringified));
};

export const reset = (email, forgotPasswordHash, newPassword) => {
  const body = { email, forgotPasswordHash, newPassword };
  const stringified = JSON.stringify(body);

  return authFetch(authPath('reset-password'), headersPost(stringified));
};

// update account
export const updateAccount = (payload) => {
  const body = payload;
  const stringified = JSON.stringify(body);

  return authFetch(authPath('update-all'), headersPost(stringified));
};

export const logout = () => {
  return rejectingFetch(authPath('logout'), headersGet());
};

// use established sessionKey to get the user object
export const getUser = () => {
  return authFetch(authPath('current-user'), headersGet());
};