import register from './registerExtension';
import { isRegistered, onRegister, validRegion } from './clientRegistry';
import { callExtensionApi as api } from '../middleware/extensions';

/**
 * API Section for extensions
 * @name window.constructor.extensions
 */
export default {
  register,
  api,
  isRegistered,
  onRegister,
  validRegion,
};
