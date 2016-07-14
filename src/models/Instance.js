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
import Immutable from './Immutable';
import InstanceSchema from '../schemas/Instance';
import safeValidate from '../schemas/fields/safeValidate';
import { version } from '../schemas/fields/validators';

const versionValidator = (ver, required = false) => safeValidate(version(), required, ver);

/**
 * The Instance class is the base class for models. Models are immutable objects, which conform to a schema, and provide an explicit API for modifying their data
 * @class
 * @gc Model
 */
export default class Instance extends Immutable {
  /**
   * Create an instance
   * @param {object} input Input object
   * @param {object} [subclassBase] If extending the class, additional fields to use in the scaffold
   * @param {object} [moreFields] Additional fields, beyond the scaffold
   * @returns {Instance} An instance, frozen if not in production
   */
  constructor(input = {}, subclassBase, moreFields) {
    invariant(typeof input === 'object', 'must pass an object (or leave undefined) to model constructor');

    return super(merge(
      InstanceSchema.scaffold(),
      subclassBase,
      moreFields,
      input,
    ));
  }

  /**
   * Change the value of a property, returning a new Instance
   * Uses {@link https://lodash.com/docs#set lodash _.set()} syntax for path, e.g. `a[0].b.c`
   * @param {string} path Path of property to change
   * @param {*} value New value
   * @returns {Instance} A new instance
   * @example
   * const initial = new Instance({some: {value: 9}});
   * initial.some.value; //9
   * const next = initial.mutate('some.value', 10);
   * next.some.value; //10
   * initial.some.value; //9
   */
  mutate(path, value) {
    //use cloneDeep and perform mutation prior to calling constructor because constructor may freeze object
    const base = cloneDeep(this);
    pathSet(base, path, value);
    return new this.constructor(base);
  }

  /**
   * Return a new Instance with input object merged into it
   * Uses {@link https://lodash.com/docs#merge lodash _.merge()} for performing a deep merge
   * @param {object} obj Object to merge into instance
   * @returns {Instance} A new instance, with `obj` merged in
   * @example
   * const initial = new Instance();
   * const next = initial.merge({new: 'stuff'});
   */
  merge(obj) {
    //use cloneDeep and perform mutation prior to calling constructor because constructor may freeze object
    const base = cloneDeep(this);
    merge(base, obj);
    return new this.constructor(base);
  }

  /**
   * Clone an instance, adding the parent to the ancestry of the child Instance.
   * @param {object|null|string} [parentInfo={}] Parent info for denoting ancestry. If pass null to parentInfo, the instance is simply cloned, and nothing is added to the history. If pass a string, it will be used as the version.
   * @param {object} [overwrites={}] object to merge into the cloned Instance
   * @throws if version is invalid (not provided and no field version on the instance)
   * @returns {Instance}
   */
  clone(parentInfo = {}, overwrites = {}) {
    const cloned = cloneDeep(this);
    let clone;

    if (parentInfo === null) {
      clone = merge(cloned, overwrites);
    } else {
      const inputObject = (typeof parentInfo === 'string') ?
      { version: parentInfo } :
        parentInfo;

      const parentObject = Object.assign({
        id: cloned.id,
        version: cloned.version,
      }, inputObject);

      invariant(versionValidator(parentObject.version), 'must pass a valid version (SHA), got ' + parentObject.version);

      const parents = [parentObject, ...cloned.parents];

      //unclear why, but merging parents was not overwriting the clone, so shallow assign parents specifically
      clone = Object.assign(merge(cloned, overwrites), { parents });
      delete clone.id;
    }

    return new this.constructor(clone);
  }
}
