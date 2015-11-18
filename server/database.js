import redis from 'redis';
/**
 * This file expects only valid data for the database
 *
 * Redis Database interface
 *
 * todo - assertion for ID valid
 */

const client = redis.createClient();
const timeout = 5000;

//subscribe to all errors...
client.on('error', (err) => {
  console.error(err);
});

/**
 @description Fetch an entry from the database
 @param {uuid} id
 **/
export const get = (id) => {
  //const command = `redis-cli get ${id}`;
  return new Promise((resolve, reject) => {
    //todo - better timeout handling
    const timeout = setTimeout(reject, timeout);
    client.get(id, (err, response) => {
      clearTimeout(timeout);

      if (err) {
        reject(err);
      } else if (!response) {
        //todo - do we reject things without an ID?
        reject('doesnt exist');
      } else {
        resolve(response);
      }
    });
  });
};

/**
 @description Updates an entry in the database
 @param {uuid} id
 @param {String} data Probably a JSON-stringified object
 **/
export const set = (id, data = '') => {
  //const command = `redis-cli set ${id} '${data}'`;
  return new Promise((resolve, reject) => {
    //todo - better timeout handling
    const timeout = setTimeout(reject, timeout);
    client.set(id, data, (err, response) => {
      clearTimeout(timeout);
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
