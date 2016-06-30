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
/**
 * Constructs an enumeration with keys equal to their value.
 *
 * Input:  {key1: val1, key2: val2}
 * Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
export default function keyMirror(obj) {
  // todo - ensure pass in object
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = key;
    return acc;
  }, {});
}
