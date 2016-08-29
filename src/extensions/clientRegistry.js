/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import invariant from 'invariant';
import * as regions from './regions';
import { manifestClientRegions, getClientFileFromRegion, extensionName } from '../../server/extensions/manifestUtils';
import { downloadExtension } from './downloadExtension';

//map of extensions
export const registry = {};

//listeners when an extension registers
const callbacks = [];

function safelyRunCallback(callback, ...args) {
  try {
    callback.apply(null, args);
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('error running callback');
      console.error(err);
    }
  }
}

function safelyRunCallbacks(...args) {
  const callbackArgs = args.length ? args : [registry];
  callbacks.forEach(cb => safelyRunCallback(cb, ...callbackArgs));
}

/**
 * Check whether a region is a valid to load the extension
 * @name validRegion
 * @memberOf module:constructor.module:extensions
 * @function
 * @param {string} region Region to check
 * @returns {boolean} true if region is valid
 */
export const validRegion = (region) => region === null || typeof regions[region] === 'string';

//returns an array
export const extensionsByRegion = (region) => {
  return Object.keys(registry)
    .filter(key => {
      const manifest = registry[key];
      const regions = manifestClientRegions(manifest);
      return regions.indexOf(region) >= 0;
    })
    .map(key => registry[key])
    .sort((one, two) => one.name < two.name ? -1 : 1)
    .map(manifest => manifest.name);
};

/**
 * Validate + register an extension manifest
 * If invalid, error is caught and logged and the extension is ignored
 * Downloads non-visual parts of client extension immediately, then runs all callbacks if successful. These callbacks include sections of the page to update when the registry updates.
 * called by loadExtensions to add the manifests
 * @function
 * @private
 * @param {Object} manifest A valid manifest
 * @returns {Object} registry
 */
export const registerManifest = (manifest) => {
  try {
    const { name, geneticConstructor } = manifest;
    const { client } = geneticConstructor;

    invariant(name, 'Name is required');
    invariant(Array.isArray(client) && client.length > 0, 'must specify client files in extension to register, check geneticConstructor.client');

    //save:
    // 1) list of files for non-visual extensions to download immediately upon registration, if all files listed pass checks
    // 2) list of relevant regions
    const extensionInfo = client.reduce((acc, { file, region }, index) => {
      invariant(region || region === null, `Region (manifest.geneticConstructor.region) is required to register a client-side extension, or null for non-visual extensions [${name}]`);
      invariant(validRegion(region), `Region must be a valid region, got ${region} [${name}, #${index}]`);

      acc.regions.add(region);

      if (region === null) {
        acc.files.add(file)
      }

      return acc;
    }, { files: new Set(), regions: new Set() });

    //extension checks out. actually register it and download non-visual components

    //download appropriate files immediately, then run callbacks
    Promise.all(
      [...extensionInfo.files].map(file => downloadExtension(name, file))
    )
      .then(() => {
        //todo - update callbacks to expect array of regions
        safelyRunCallbacks(registry, name, [...regions]);
      });

    //register extension, do some setup, return registry
    Object.assign(registry, { [name]: manifest });
    Object.assign(register[name], { render: {} });
    return registry;
  } catch (err) {
    console.log(`could not register extension ${manifest.name}, ignoring.`);
    console.error(err);
    return registry;
  }
};

/**
 * Register the render() function of an extension
 * Extension manifest must already registered
 * used by registerExtension()
 * @function
 * @private
 * @param {string} key
 * @param {string} region
 * @param {Function} renderFn
 * @throws If extension manifest not already registered
 */
export const registerRender = (key, region, renderFn) => {
  invariant(registry[key], 'manifest must exist for extension ' + key + ' before registering');

  Object.assign(registry[key].render, { [region]: renderFn });
};

/**
 * Register a callback for when extensions are registered
 * @name onRegister
 * @function
 * @memberOf module:constructor.module:extensions
 * @param {Function} cb Callback, called with signature (registry, key, regions) where key is last registered extension key, and regions is an array of region names where the extension registers
 * @param {boolean} [skipFirst=false] Execute on register? regions is null for this callback.
 * @returns {Function} Unregister function
 */
export const onRegister = (cb, skipFirst = false) => {
  callbacks.push(cb);
  !skipFirst && safelyRunCallback(cb, registry, null);
  return function unregister() { callbacks.splice(callbacks.findIndex(cb), 1); };
};

export const getExtensionName = (key) => {
  const manifest = registry[key];
  if (!manifest) {
    return null;
  }
  return extensionName(manifest);
};

/**
 * Attempt to download and render an extension.
 *
 * Should only call this function if there is a render function, otherwise just download it.
 *
 * @private
 * @function
 *
 * @param key
 * @param region
 * @param container
 * @param options
 * @returns {Promise}
 * @resolve {Function} callback from render, the unregister function
 * @reject {Error} Error while rendering
 */
export const downloadAndRender = (key, region, container, options) => {
  const manifest = registry[key];
  const file = getClientFileFromRegion(manifest, region);

  return downloadExtension(key, file)
    .then(() => {
      const manifest = registry[key];
      const regionRender = manifest.render[region];

      if (typeof regionRender !== 'function') {
        return Promise.reject(`Extension ${name} did not specify a render() function, even though it defined a region. Check Extension manifest definition.`);
      }

      return new Promise((resolve, reject) => {
        try {
          const callback = regionRender(container, options);
          resolve(callback);
        } catch (err) {
          //already logged it when wrap render in registerExtension
          reject(err);
        }
      });
    });
};

/**
 * Check whether an extension is registered
 * @name isRegistered
 * @function
 * @memberOf module:constructor.module:extensions
 * @param {string} key Extension name
 * @returns {boolean} true if registered
 */
export const isRegistered = (key) => {
  return !!registry[key];
};

export const clearRegistry = () => {
  Object.keys(registry).forEach(key => {
    delete registry[key];
  });
  safelyRunCallbacks();
};

export default registry;
