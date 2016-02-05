const manifest = require('./package.json');
const { dependencies } = manifest;

export const extensionsFolder = '../../extensions/';

const registry = Object.keys(dependencies).reduce((acc, dep) => {
  const depManifest = require(extensionsFolder + dep + '/package.json');
  return Object.assign(acc, {
    [dep]: depManifest,
  });
}, {});

export const isRegistered = (name) => {
  return registry.hasOwnProperty(name);
};

export default registry;
