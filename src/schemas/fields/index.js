import * as validatorFunctions from './validators';
import mapValues from '../../utils/mapValues';

//todo - assert that every type has a corresponding validator and is function

const fields = {

  //primitives

  id        : {
    validator  : validatorFunctions.id,
    description: 'A UUID'
  },
  string    : {
    validator  : validatorFunctions.string,
    description: 'A string'
  },
  number    : {
    validator  : validatorFunctions.number,
    description: 'A number'
  },
  func      : {
    validator  : validatorFunctions.func,
    description: 'A function'
  },
  array     : {
    validator  : validatorFunctions.array,
    description: 'An array, with any values'
  },
  object    : {
    validator  : validatorFunctions.object,
    description: 'An object, of any shape'
  },
  bool      : {
    validator  : validatorFunctions.bool,
    description: 'A boolean, strictly true or false'
  },
  undef     : {
    validator  : validatorFunctions.undef,
    description: 'the value undefined'
  },
  
  //string subtypes
  
  sequence  : {
    validator  : validatorFunctions.sequence,
    description: 'An IUPAC compliant sequence'
  },
  email     : {
    validator  : validatorFunctions.email,
    description: 'A valid email address'
  },
  version   : {
    validator  : validatorFunctions.version,
    description: 'String conforming to semantic versioning'
  },
  url       : {
    validator  : validatorFunctions.url,
    description: 'A valid URL'
  },
  
  //complex - functions + classes
  
  shape     : {
    validator  : validatorFunctions.shape,
    description: 'An object with a defined fields and types'
  },
  equal     : {
    validator  : validatorFunctions.equal,
    description: 'Equality check using Object.is()'
  },
  instanceOf: {
    validator  : validatorFunctions.instanceOf,
    description: 'Instance of another class'
  },
  oneOf     : {
    validator  : validatorFunctions.oneOf,
    description: 'Input matches item in possible values'
  },
  oneOfType : {
    validator  : validatorFunctions.oneOfType,
    description: 'Value matches at least one possibility, which may be (1) an object (instanceof), or (2) validation function'
  },
  arrayOf   : {
    validator  : validatorFunctions.arrayOf,
    description: 'An array, where each item passes the passed validation function'
  }
};

export const fieldNames = Object.keys(fields);
export const fieldDescriptions = mapValues(fields, (val, key) => val.description);
export const validators = mapValues(fields, (val, key) => val.validator);

export default fields;