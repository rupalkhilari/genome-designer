import { get as dbGet, set as dbSet } from './database';
import { errorInvalidSessionKey, errorSessionKeyNotValidated } from './errors';
import crypto from 'crypto';

/**
 * @description asserts valid session key
 * @param key {sha1} session key
 */
export const validateSessionKey = (key) => {
  return dbGet(key)
    .then(result => true)
    .catch(err => {
      return Promise.reject(errorInvalidSessionKey);
    });
};

/**
 * STUB
 * @description validate a user name and password
 * @param user
 * @param pw
 * @returns {Promise.<T>}
 */
export const validateLoginCredentials = (user, pw) => {
  const sha1 = crypto.randomBytes(20).toString('hex');
  const info = {
    user: user,
    password: pw,
    permissions: 4,
    expiration: -1,
  };

  return dbSet(sha1, info)
    .then(result => sha1)
    .catch(err => {
      return Promise.reject(errorSessionKeyNotValidated);
    });
};

export const cleanUpSessionKeys = () => {
  //TODO
};
