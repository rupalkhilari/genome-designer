import * as regions from './regions';
import invariant from 'invariant';
import merge from 'lodash.merge';
import pick from 'lodash.pick';
import loadExtension from './loadExtension';

const registry = {};

function registerExtensionManifests() {
  return new Promise((resolve, reject) => {
    const url = `/extensions/list`;
    fetch(url)
      .then(resp => resp.json())
      .then(json => {
        merge(registry, json);
        resolve(registry);
      });
  });
}

//for now, build the registry using everything registered on the server, and load automatically
function loadRegisteredExtensions() {
  return Promise.all(Object.keys(registry).map(key => {
    return loadExtension(key);
  }));
}

function loadAllExtensions() {
  return registerExtensionManifests()
    .then(loadRegisteredExtensions);
}

loadAllExtensions();

export const validRegion = (region) => regions.hasOwnProperty(region);

//if want to manually / lazily add one (used in registerExtension.js)
export const addExtensionToRegistry = (region, manifest, render) => {
  invariant(validRegion(region), 'invalid region!');
  const key = manifest.name;

  const merged = merge({}, registry[key], manifest, {render});
  Object.assign(registry, {
    [key]: merged,
  });
  return merged;
};

export const extensionsByRegion = (region) => {
  return pick(registry, (key, manifest) => manifest.region === region);
};

export default registry;
