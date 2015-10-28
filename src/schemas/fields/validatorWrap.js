/**
 * wraps a validator function to make required/unrequired, handle errors
 *
 * @param validator {Function} function which either:
 * 1) returns true / false for validation
 * 2) throws an error for invalid, and returns anything but false otherwise
 * @return {Boolean} true if valid, false otherwise
 */
export default function wrap (validator) {

  function validateCatchError (required, input) {
    if (required === false && input === undefined) {
      return true;
    }

    try {
      let valid = validator(input);

      //todo - should run in dev only
      if (isError(valid)) {
        console.error(valid);
      }

      return isError(valid) && valid !== false;
    }
    catch (err) {
      return false;
    }
  }

  let chainedCheckType = validateCatchError.bind(null, false);
  chainedCheckType.isRequired = validateCatchError.bind(null, true);

  return chainedCheckType;
};

function isError (val) {
  return val instanceof Error;
}