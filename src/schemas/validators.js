import wrap from './wrap';

/*
TODO - consistent error handling, ability to handle errors and return (esp. in loops)
To be consistent with React, should return null (valid) or Error (invalid)
*/

//validates an ID
export const id = params => wrap(input => {
  //todo - real validation
  if (input.length === 0) {
    return new Error('invalid id: ' + input);
  }
});

export const string = params => wrap(input => {
  return isString(input) || input instanceof String;
});

export const sequence = params => wrap(input => {
  return isString(input) && /^[acgt]*$/ig.test(input);
});

export const email = params => wrap(input => {
  //todo - get a robust one, i just hacked this together
  return isString(input) === 'string' && /\w+?@\w\w+?\.\w{2,6}/.test(input);
});

export const number = params => wrap(input => {
  return getPropType(input) === 'number';
});

export const func = params => wrap(input => {
  return getPropType(input) === 'function';
});

export const array = params => wrap(input => {
  return Array.isArray(input);
});

export const object = params => wrap(input => {
  return input !== null && getPropType(input) === 'object';
});

export const undef = params => wrap(input => {
  return input === undefined;
});

export const instanceOf = type => wrap(input => {
  return input instanceof type;
});

//reference check only. Might want another one for deep equality check
export const equal = checker => wrap(input => {
  return Object.is(checker, input);
});

//should return error?
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

function isString(input) {
  return getPropType(input) === 'string';
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  return propType;
}

// This handles more types than `getPropType`, e.g. Date and regexp
function getPreciseType(propValue) {
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