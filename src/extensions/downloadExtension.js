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
import loadScript from 'load-script';

const cached = {};

/**
 * given an extension, actually load the script
 *
 * resolve(false) - was cached
 * resolve(true) - was downloaded
 * reject(err) - error downloading
 */
export const downloadExtension = (name) => {
  return new Promise((resolve, reject) => {
    if (cached[name]) {
      resolve(false);
    }

    //we need index.js so that relative sourcemap paths will work properly
    const url = `/extensions/load/${name}/index.js`;
    loadScript(url, (err, script) => {
      if (err) {
        reject(err);
      }
      cached[name] = true;
      resolve(true);
    });
  });
};

export default downloadExtension;
