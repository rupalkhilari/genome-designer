import { get as dbGet, set as dbSet } from './database';
const crypto = require("crypto");

/**
 * @description asserts valid session key
 * @param {sha1} session key
 */
export const validateSessionKey = (key) => {
  return dbGet(key).then( result => {
     return Promise.resolve(true);
   }).catch( err => {
     return Promise.reject("Session Key is invalid");
   });
}

export const validateLoginCredentials = (user, pw) => {
    var sha1 = crypto.randomBytes(20).toString('hex');
    var info = {
        user: user, 
        password : pw, 
        permissions: 4,
        expiration: -1
    };

    return dbSet(sha1, info).then(result => {
        return Promise.resolve(sha1);
    }).catch(err => {
        return Promise.reject("Session key could not be generated");
    });
}

export const cleanUpSessionKeys = () => {
    //TODO
}
