import path from 'path';
import manifest from './package.json';

const { dependencies } = manifest;

const registry = Object.keys(dependencies).reduce((acc, dep) => {
  try {
    //skip the simple extension unless we're in the test environment
    if (dep === 'simple' && process.env.NODE_ENV !== 'test') {
      return acc;
    }

    let depManifest;
    //building in webpack requires static paths, dynamic requires are really tricky
    if (process.env.BUILD) {
      depManifest = require(`gd_extensions/${dep}/package.json`);
    } else {
      const filePath = path.resolve(__dirname, './node_modules', dep + '/package.json');
      depManifest = require(filePath);
    }

    Object.assign(acc, {
      [dep]: depManifest,
    });
  } catch (err) {
    console.warn('error loading extension: ' + dep);
    console.error(err);
  }

  return acc;
}, {});

export const isRegistered = (name) => {
  return registry.hasOwnProperty(name);
};

export default registry;
