import register from './registerExtension';
import { isRegistered, onRegister, validRegion } from './clientRegistry';

/**
 * API Section for extensions
 * @name window.constructor.extensions
 */
export default {
  register,
  isRegistered,
  onRegister,
  validRegion,
};
