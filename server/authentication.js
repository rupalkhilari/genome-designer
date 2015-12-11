import { getSafe as dbGetSafe, set as dbSet } from './database';
import { errorInvalidSessionKey, errorSessionKeyNotValidated } from './errors';
import crypto from 'crypto';

/**
 * @description asserts valid session key
 * @param key {sha1} session key
 */

//hack - use default because if no sessionkey is set, this will error because no ID provided
export const validateSessionKey = (key) => {
  return dbGetSafe(key, null)
    .then(result => true)
    .catch(err => {
      console.log('error getting key', err);
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

export const sessionMiddleware = (req, res, next) => {
  const { sessionkey } = req.headers;
  //console.log('session key: ' + sessionkey);

  return validateSessionKey(sessionkey)
    .then(() => { next(); })
    .catch(() => { res.status(403).send(errorInvalidSessionKey); });
};
