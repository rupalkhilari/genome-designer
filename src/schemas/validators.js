//all functions should be wrapped here for js-schema
import wrap from './wrap';
import { PropTypes } from 'react';

//validates an ID
export const id = wrap((input) => {
  //todo - real validation
  if (input.length === 0) {
    return new Error('invalid id: ' + input);
  }
});

export const equal = wrap((checker) => (input) => {
  return Object.is(checker, input);
});

export const string = wrap((input) => {
  return (typeof input === 'string' || input instanceof String);
});

export const number = wrap((input) => {
  return typeof input === 'number';
});

export const func = wrap((input) => {
  return typeof input === 'function';
});

export const array = wrap((input) => {
  return Array.isArray(input);
});

export const object = wrap((input) => {
  return input !== null && typeof input === 'object';
});

export const undef = wrap((input) => {
  return input === undefined;
});

export const instanceOf = wrap((type) => (input) => {
  return input instanceof type;
});

//should return error?
export const shape = wrap((fields) => (input) => {
  return Object.keys(fields).every((key) => {
    return fields[key](input[key]);
  });
});

export const oneOf = wrap((possible) => (input) => {
  if (!possible.indexOf(input) > -1) {
    throw new Error(input + ' not found in ' + possible.join(','));
  }
});

export const oneOfType = wrap((types) => (input) => {
  return types.some((validator) => {
    return validator(input);
  })
});

export const arrayOf = wrap((validator) => (input) => {
  return array(input) && input.every((item) => validator(item))
});