import uuid from 'node-uuid';
import { set as pathSet, unset as pathUnset, cloneDeep, merge } from 'lodash';
import invariant from 'invariant';
import InstanceDefinition from '../schemas/Instance';
import safeValidate from '../schemas/fields/safeValidate';
import { version } from '../schemas/fields/validators';

const versionValidator = (ver, required = false) => safeValidate(version(), required, ver);

/**
 * @description
 * you can pass as argument to the constructor either:
 *  - an object, which will extend the created instance
 *  - a string, to use as a forced ID (todo - deprecate - this is for testing...)
 */
export default class Instance {
  constructor(input, subclassBase, moreFields) {
    let parsedInput;
    if (!!input && typeof input === 'object') {
      parsedInput = input;
    } else if (typeof input === 'string') {
      parsedInput = { id: input };
    } else {
      parsedInput = {};
    }

    merge(this,
      InstanceDefinition.scaffold(),
      subclassBase,
      moreFields,
      parsedInput
    );

    if (process.env.NODE_ENV !== 'production') {
      require('deep-freeze')(this);
    }
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

  //clone can accept just an ID (e.g. project), but likely want to pass an object (e.g. block, which also has field projectId in parent)
  clone(parentInfo = {}) {
    const self = cloneDeep(this);
    const inputObject = (typeof parentInfo === 'string') ?
    { version: parentInfo } :
      parentInfo;

    const parentObject = Object.assign({
      id: self.id,
      version: self.version,
    }, inputObject);

    invariant(versionValidator(parentObject.version), 'must pass a valid version (SHA), got ' + parentObject.version);

    const clone = Object.assign(self, {
      id: uuid.v4(),
      parents: [parentObject].concat(self.parents),
    });
    return new this.constructor(clone);
  }
}
