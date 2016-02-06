import * as regions from './regions';
import invariant from 'invariant';
import merge from 'lodash.merge';
import './loadExtensions';

export const registry = {};

export const validRegion = (region) => regions.hasOwnProperty(region);

//returns an array
export const extensionsByRegion = (region) => {
  return Object.keys(registry)
    .filter(key => {
      const manifest = registry[key];
      return manifest.region === region;
    })
    .map(key => registry[key])
};

export default registry;
