import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';

import { errorNoIdProvided, errorIdTooShort } from './errors';
import { get as dbGet } from './database';

export const validateBlock = (instance) => {
  return BlockDefinition.validate(instance);
};

export const validateProject = (instance) => {
  return ProjectDefinition.validate(instance);
};

/**
 * @description asserts valid ID, throws error if invalid or undefined
 * @param {uuid} id
 */
export const assertValidId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error(errorNoIdProvided);
  }
  if (id.length < 5) {
    throw new Error(errorIdTooShort);
  }
};

/**
 * @description asserts valid session key
 * @param {sha1} session key
 */
export const validateSessionKey = (key) => {
  return dbGet(key).then( result => {
     return Promise.resolve(true);
   }).catch( err => {     
     console.log("Session Key is Invalid")
     return Promise.reject("Session Key is invalid");
   });
}