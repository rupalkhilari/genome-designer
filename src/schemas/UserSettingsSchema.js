import * as types from './validators';

/*
Dictionary of user settings

//todo - what else do we need?
*/

const UserSettingsSchema = {
  id  : types.id().isRequired,
  user: types.id().isRequired
};

export default UserSettingsSchema;