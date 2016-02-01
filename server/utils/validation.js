import BlockDefinition from '../../src/schemas/Block';
import ProjectDefinition from '../../src/schemas/Project';
import * as validators from '../../src/schemas/fields/validators';

import { errorNoIdProvided, errorIdInvalid } from './errors';

export const validateBlock = (instance) => {
  return BlockDefinition.validate(instance);
};

export const validateProject = (instance) => {
  return ProjectDefinition.validate(instance);
};

const idValidator = validators.id();

/**
 * @description asserts valid ID, throws error if invalid or undefined
 * @param {uuid} id
 */
export const assertValidId = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error(errorNoIdProvided);
  }
  idValidator(id);
};
