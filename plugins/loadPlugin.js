import path from 'path';
import pathSet from 'lodash.set';
import invariant from 'invariant';

const registry = {};

exports.getPlugin = (plugin, func) => {
  invariant(plugin && func, 'both a plugin and func are required');

  return new Promise((resolve, reject) => {
    if (registry[plugin] && registry[plugin][func]) {
      resolve(registry[plugin][func]);
    }

    try {
      const script = require(path.resolve(__dirname, plugin, func));
      pathSet(registry, `[${plugin}][${func}]`, script);
      resolve(script);
    } catch (err) {
      console.log('couldnt require ' + plugin + ' ' + func);
      console.error(err.stack);
      reject(err);
    }
  });
};
