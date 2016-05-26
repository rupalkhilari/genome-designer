import * as regions from './regions';
import './loadExtensions';

export const registry = {};
const callbacks = [];

export const validRegion = (region) => regions.hasOwnProperty(region);

//returns an array
export const extensionsByRegion = (region) => {
  return Object.keys(registry)
    .filter(key => {
      const manifest = registry[key];
      return manifest.region === region;
    })
    .map(key => registry[key]);
};

//this is used by registerExtension, should not be called directly. in future could just proxy adding of extension keys
export const register = extension => {
  Object.assign(registry, {
    [extension.name]: extension,
  });
  callbacks.forEach(cb => cb(registry));
};

export const onRegister = (cb, skipFirst = false) => {
  callbacks.push(cb);
  !skipFirst && cb(registry);
  return () => callbacks.splice(callbacks.findIndex(cb), 1);
};

export default registry;
