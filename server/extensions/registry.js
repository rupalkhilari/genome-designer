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
