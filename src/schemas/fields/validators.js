import wrap from './createField';
import urlRegex from 'url-regex';
import semverRegex from 'semver-regex';

/* these validators are used by fields/index.js - you shuold use the ones exported from that file instead of these directly */

/*
TODO - consistent error handling, ability to handle errors and return (esp. in loops)
*/

export const id = params => wrap(input => {
  //todo - real validation
  if (input.length === 0) {
    return new Error(`${input} is not a valid ID`);
  }
});

export const string = params => wrap(input => {
  if (!isString(input)) {
    return new Error(`${input} is not a string`);
  }
});

export const number = params => wrap(input => {
  if (!isNumber(input)) {
    return new Error(`input ${input} is not a number`);
  }
  if (isRealObject(params)) {
    if (params.min && input < params.min) {
      return new Error(`input ${input} is less than minimum ${params.min}`);
    }
    if (params.max && input > params.max) {
      return new Error(`input ${input} is greater than maximum ${params.max}`);
    }
  }
  return null;
});

export const func = params => wrap(input => {
  return getPropType(input) === 'function';
});

export const array = params => wrap(input => {
  return Array.isArray(input);
});

export const object = params => wrap(input => {
  return isRealObject(input);
});

export const bool = params => wrap(input => {
  return input === true || input === false;
});

export const undef = params => wrap(input => {
  return input === undefined;
});

/*******
 string subtypes
 *******/

export const sequence = params => wrap(input => {
  //todo - should support all IUPAC with option to limit
  return isString(input) && /^[acgt]*$/ig.test(input);
});

export const email = params => wrap(input => {
  //todo - get a robust one, i just hacked this together
  return isString(input) === 'string' && /\w+?@\w\w+?\.\w{2,6}/.test(input);
});

//remove package if you remove this test
export const version = params => wrap(input => {
  return isString(input) && semverRegex().test(input) ?
         true :
         new Error();
});

//remove package if you remove this test
export const url = params => wrap(input => {
  return isString(input) && urlRegex({exact: true}).test(input);
});

/*******
 complex
 *******/

export const instanceOf = type => wrap(input => {
  return input instanceof type;
});

//reference check only. Might want another one for deep equality check
export const equal = checker => wrap(input => {
  return Object.is(checker, input);
});

export const shape = (fields, params) => wrap(input => {
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

//utils

function isString (input) {
  return getPropType(input) === 'string' || input instanceof String;
}

function isRealObject (input) {
  return input !== null && getPropType(input) === 'object';
}

function isNumber (input) {
  return getPropType(input) === 'number';
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType (propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`, e.g. Date and regexp
function getPreciseType (propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}