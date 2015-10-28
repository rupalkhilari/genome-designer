import fields, { validators } from './fields';

/*
@description A user account

*/

const AuthorSchema = {
  id         : validators.id().isRequired,
  email      : validators.email().isRequired,
  firstName  : validators.string(),
  lastName   : validators.string(),
  description: validators.string(),
  homepage   : validators.url(),
  social     : validators.arrayOf(validators.shape({
    provider: validators.string().isRequired, //e.g. facebook
    username: validators.string().isRequired
  }))
};

export default AuthorSchema;