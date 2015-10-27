import * as types from './validators';

/*
Information about user's last session

//todo - what else do we need? Much of this likely should be captured in the URL (cf. Google Maps)
*/

const UserSettingsSchema = {
  id  : types.id().isRequired,
  user: types.id().isRequired
};

export default UserSettingsSchema;