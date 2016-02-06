import path from 'path';
import manifest from './package.json';

const { dependencies } = manifest;

export const extensionsFolder = '../../extensions/';

const registry = Object.keys(dependencies).reduce((acc, dep) => {
  const filePath = path.resolve(__dirname, extensionsFolder + dep + '/package.json');
  const depManifest = require(filePath);
  return Object.assign(acc, {
    [dep]: depManifest,
  });
}, {});

export const isRegistered = (name) => {
  return registry.hasOwnProperty(name);
};

export default registry;
