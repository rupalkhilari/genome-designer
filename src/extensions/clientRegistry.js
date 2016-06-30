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
