import uuid from 'node-uuid';
import pathSet from 'lodash.set';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';
import invariant from 'invariant';
import InstanceDefinition from '../schemas/Instance';

/**
 * @description
 * you can pass as argument to the constructor either:
 *  - an object, which will extend the created instance
 *  - a string, to use as a forced ID (todo - deprecate - this is for testing...)
 */
export default class Instance {
  constructor(input = uuid.v4(), subclassBase, moreFields) {
    let parsedInput;
    if (!!input && typeof input === 'object') {
      parsedInput = input;
    } else if (typeof input === 'string') {
      parsedInput = {id: input};
    } else {
      parsedInput = {};
    }

    merge(this,
      subclassBase,
      InstanceDefinition.scaffold(),
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

  //clone by default just uses the ID, however,
  clone(parentSha) {
    const self = cloneDeep(this);
    invariant(!!parentSha || !!self.version, 'Version (e.g. of project) is required to clone');

    const versionOfParent = (!!parentSha ? parentSha : self.version);
    const latestParent = {
      id: self.id,
      sha: versionOfParent,
    };
    const clone = Object.assign(self, {
      id: uuid.v4(),
      parents: [latestParent].concat(self.parents),
    });
    return new this.constructor(clone);
  }
}
