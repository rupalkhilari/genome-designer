import path from 'path';
import manifest from './package.json';

const { dependencies } = manifest;

export const extensionsFolder = './node_modules/';

const registry = Object.keys(dependencies).reduce((acc, dep) => {
  const filePath = path.resolve(__dirname, extensionsFolder + dep + '/package.json');

  try {
    const depManifest = require(filePath);
    Object.assign(acc, {
      [dep]: depManifest,
    });
  } catch (err) {
    console.warn('error loading extension ' + dep);
    console.error(err);
  }

  return acc;
}, {});

export const isRegistered = (name) => {
  return registry.hasOwnProperty(name);
};

export default registry;
