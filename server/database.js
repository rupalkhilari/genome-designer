import redis from 'redis';
import { errorDoesNotExist } from './errors';
import { assertValidId } from './validation';
/**
 * This file expects only valid data for the database. handles stringifying / parsing.
 *
 * Redis Database interface
 */

//stub / mock this for tests?
const client = redis.createClient('redis', 6379);
const timeoutTime = 5000;

//todo - JSON and redis don't play very nice with each other. Maybe look into ZSET
const parser = JSON.parse;
const stringifier = JSON.stringify;

//subscribe to all errors...
client.on('error', (err) => {
  console.error(err);
});

/**
 @description Fetch an entry from the database
 @param {string} id
 @returns {Promise}
 If resolves, the value, after JSON.parse
 If rejects or doesn't exist, error string
 **/
export const get = (id) => {
  return new Promise((resolve, reject) => {
    assertValidId(id);

    //todo - better timeout handling
    const timeout = setTimeout(reject, timeoutTime);

    client.get(id, (err, response) => {
      clearTimeout(timeout);
      if (err) {
        reject(err);
      } else if (!response) {
        reject(new Error(errorDoesNotExist));
      } else {
        const parsed = parser(response);
        resolve(parsed);
      }
    });
  });
};

/**
 @description Like get, but doesn't reject for doesnt exist
 @param {string} id
 @param {*} defaultValue Value to use if doesn't exist (default null)
 @returns {Promise}
 If resolves, the value, after JSON.parse, or null if doesnt exist
 If rejects, error string
 **/
export const getSafe = (id, defaultValue = null) => {
  return get(id).catch(err => {
    if (err.message === errorDoesNotExist) {
      return Promise.resolve(defaultValue);
    }
    return Promise.reject(err);
  });
};

/**
 @description Updates an entry in the database
 @param {string} id
 @param {*} data value to be run through JSON.stringify
 @returns {Promise}
 If resolves, data input
 If rejects, error
 **/
export const set = (id, data = '') => {
  //const command = `redis-cli set ${id} '${data}'`;
  return new Promise((resolve, reject) => {
    assertValidId(id);

    //todo - better timeout handling
    const timeout = setTimeout(reject, timeoutTime);
    const parsed = stringifier(data);

    client.set(id, parsed, (err, response) => {
      clearTimeout(timeout);
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
