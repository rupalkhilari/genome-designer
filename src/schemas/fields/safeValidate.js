export default function safeValidate (validator = () => {}, required = false, input) {
  if (required === false && input === undefined) {
    return true;
  }

  try {
    let valid = validator(input);


    if (isError(valid) && process.env.NODE_ENV !== 'production') {
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