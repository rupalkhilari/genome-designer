import fields, { validators } from './fields';

/*
Information about user's last session

//todo - what else do we need? Much of this likely should be captured in the URL (cf. Google Maps)
*/

const UserSettingsSchema = {
  id  : validators.id().isRequired,
  user: validators.id().isRequired
};

export default UserSettingsSchema;