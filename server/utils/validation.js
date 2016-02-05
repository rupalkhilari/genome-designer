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

//throws on error
const idValidator = validators.id();

/**
 * @description validates an ID. callback called with error if has one, otherwise without any arguments
 * @param {uuid} id
 * @param {function} callback
 */
export const assertValidId = (id, callback = () => {}) => {
  if (!id || typeof id !== 'string') {
    callback(errorNoIdProvided);
  }
  try {
    idValidator(id);
    callback();
  } catch (err) {
    callback(errorIdInvalid);
  }
};
