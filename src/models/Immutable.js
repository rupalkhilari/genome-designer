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
import { set as pathSet, unset as pathUnset, cloneDeep, merge } from 'lodash';
import invariant from 'invariant';

/**
 * @description
 * you can pass as argument to the constructor either:
 *  - an object, which will extend the created instance
 */
export default class Immutable {
  constructor(input = {}) {
    invariant(typeof input === 'object', 'must pass an object Immutable constructor');

    merge(this,
      input,
    );

    if (process.env.NODE_ENV !== 'production') {
      require('deep-freeze')(this);
    }

    return this;
  }

  //use cloneDeep and perform mutation prior to calling constructor because constructor may freeze object

  // returns a new instance
  // uses lodash _.set() for path, e.g. 'a.b[0].c'
  mutate(path, value) {
    const base = cloneDeep(this);
    pathSet(base, path, value);
    return new this.constructor(base);
  }

  // returns a new instance
  // deep merge using _.merge
  merge(obj) {
    const base = cloneDeep(this);
    merge(base, obj);
    return new this.constructor(base);
  }
}
