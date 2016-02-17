import path from 'path';
import { errorDoesNotExist } from '../utils/errors';
import registry from './registry';

const loadExtension = (name) => {
  return new Promise((resolve, reject) => {
    const manifest = registry[name];
    if (!!manifest) {
      resolve(manifest);
    } else {
      reject(errorDoesNotExist);
    }
  });
};

export const getExtensionInternalPath = (name, fileName = 'index.js') => path.resolve(__dirname, `./node_modules/${name}/${fileName}`);

export default loadExtension;
