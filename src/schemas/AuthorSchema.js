import * as types from './validators';

/*
A user account

*/

const AuthorSchema = types.shape({
  id      : types.id().isRequired,

  email: types.email().isRequired,
  firstName : types.string(),
  lastName : types.string(),
  description: types.string(),
  homepage : types.url()
  social : types.arrayOf(types.shape({
  	provider: types.string().isRequired, //e.g. facebook
  	username : types.string().isRequired
  }))
}).isRequired;

export default AuthorSchema;