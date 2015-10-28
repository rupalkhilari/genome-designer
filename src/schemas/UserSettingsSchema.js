import fields, { validators } from './fields';

/*
Dictionary of user settings

//todo - what else do we need?
*/

const UserSettingsSchema = {
  id  : validators.id().isRequired,
  user: validators.id().isRequired
};

export default UserSettingsSchema;