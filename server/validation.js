import BlockDefinition from '../src/schemas/Block';
import ProjectDefinition from '../src/schemas/Project';

import { errorNoIdProvided, errorIdTooShort } from './errors';

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
