//all functions should be wrapped here for js-schema
import wrap from './wrap';
import { PropTypes } from 'react';

//validates an ID
export const id = params => wrap(input => {
  //todo - real validation
  if (input.length === 0) {
    return new Error('invalid id: ' + input);
  }
});

export const sequence = params => wrap(input => {
  return /^[acgt]*$/ig.test(input);
});

export const string = params => wrap(input => {
  return (typeof input === 'string' || input instanceof String);
});

export const number = params => wrap(input => {
  return typeof input === 'number';
});

export const func = params => wrap(input => {
  return typeof input === 'function';
});

export const array = params => wrap(input => {
  return Array.isArray(input);
});

export const object = params => wrap(input => {
  return input !== null && typeof input === 'object';
});

export const undef = params => wrap(input => {
  return input === undefined;
});

export const instanceOf = type => wrap(input => {
  return input instanceof type;
});

export const equal = checker => wrap(input => {
  return Object.is(checker, input);
});

//should return error?
export const shape = fields => wrap(input => {
  return Object.keys(fields).every((key) => {
    return fields[key](input[key]);
  });
});

export const oneOf = possible => wrap(input => {
  if (!possible.indexOf(input) > -1) {
    throw new Error(input + ' not found in ' + possible.join(','));
  }
});

//can pass either function to validate, or an object to check instanceof
export const oneOfType = types => wrap(input => {
  return types.some(type => {
    return typeof type === 'function' ?
           type(input) :
           input instanceof type;
  })
});

export const arrayOf = validator => wrap(input => {
  return Array.isArray(input) && input.every(item => validator(item));
});