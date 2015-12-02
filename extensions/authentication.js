import redis from 'redis';
/**
 * This file expects only valid data for the database. handles stringifying / parsing.
 *
 * Redis Database interface
 */

const client = redis.createClient();
const timeoutTime = 5000;


/**
 @description Fetch an entry from the database
 @param {string} id
 @returns {Promise}
 If resolves, the value, after JSON.parse
 If rejects or doesn't exist, error string
 **/
export const get = (id) => {
  return new Promise((resolve, reject) => {

    //todo - better timeout handling
    const timeout = setTimeout(reject, timeoutTime);

    client.get(id, (err, response) => {
      clearTimeout(timeout);
      if (err) {
        reject(err);
      } else if (!response) {
        reject(new Error("DOES NOT EXIST"));
      } else {
        const parsed = parser(response);
        resolve(parsed);
      }
    });
  });
};


/**
 * @description asserts valid session key
 * @param {sha1} session key
 */
export const validateSessionKey = (key) => {
  return get(key).then( result => {
     return Promise.resolve(true);
   }).catch( err => {     
     console.log("Session Key is Invalid")
     return Promise.reject("Session Key is invalid");
   });
}
