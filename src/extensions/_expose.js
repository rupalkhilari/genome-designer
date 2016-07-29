import register from './registerExtension';
import { isRegistered, onRegister, validRegion } from './clientRegistry';
import { callExtensionApi as api } from '../middleware/extensions';
import { readProjectFile as read, writeProjectFile as write, listProjectFiles as list } from '../middleware/projectFile';

/**
 * API Section for extensions
 * @name extensions
 * @memberOf module:constructor
 * @name extensions
 */
export default {
  register,
  api,
  files: {
    read,
    write,
    list,
  },
  isRegistered,
  onRegister,
  validRegion,
};
