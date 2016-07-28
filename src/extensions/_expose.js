import register from './registerExtension';
import { isRegistered, onRegister, validRegion } from './clientRegistry';
import { callExtensionApi as api } from '../middleware/extensions';
import { readProjectFile as read, writeProjectFile as write } from '../middleware/projectFile';

/**
 * API Section for extensions
 * @name window.constructor.extensions
 */
export default {
  register,
  api,
  files: {
    read,
    write,
  },
  isRegistered,
  onRegister,
  validRegion,
};
