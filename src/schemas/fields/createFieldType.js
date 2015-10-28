/**
 * Takes a basic field definition, returns a function which takes parameters, which subsequently returns a fully defined field.
 *
 * @param definition {Object} Object which minimally contains the following keys:
 *
 * baseValidator
 *   1) returns nothing if valid
 *   2) returns an error for invalid with relevant message
 *
 * @param type {String} the field type (e.g. 'id')
 *
 * @return {Function} returns a function expecting an input value of parameters to the baseValidator, and which has the additional field .require if the field is required. The return of this function is a fully defined field:
 *
 * {
 *   type: {String} Field type
 *   validate: {Function}
 *   isRequired: {Boolean} is the field required
 *   description: {String} description of specific field
 *   typeDescription: {String} description of field type
 *   baseValidator:  {Function} base validation function, pre-parameterized
 * }
 */
export default function createFieldType (definition, type) {
  let fieldDef = Object.assign({
    type
  }, definition);

  return function validatorAwaitingParams (validationParams) {
    let { baseValidator } = fieldDef,
        definedValidator = baseValidator(validationParams);

    let opt      = createFieldFromValidator(fieldDef, definedValidator, false);
    opt.required = createFieldFromValidator(fieldDef, definedValidator, true);

    return opt;
  };
}

function createFieldFromValidator (definition, definedValidator, required) {
  return Object.assign({},
    definition,
    {
      validate: wrapValidator(definedValidator, required),
      isRequired: required
    }
  );
}

function wrapValidator (validator, required = false) {
  return validateCatchError.bind(null, validator, required);
}

function validateCatchError (validator = () => {}, required = false, input) {
  if (required === false && input === undefined) {
    return true;
  }

  try {
    let valid = validator(input);

    if (isError(valid)) {
      console.error(valid);
    }

    return !isError(valid) && valid !== false;
  }
  catch (err) {
    return false;
  }
}

function isError (val) {
  return val instanceof Error;
}