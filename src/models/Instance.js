import uuid from 'node-uuid';
import pathSet from 'lodash.set';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';

/**
 * @description
 * you can pass as argument to the constructor either:
 *  - an object, which will extend the created instance
 *  - a string, to use as a forced ID (todo - deprecate)
 */
export default class Instance {
  constructor(input = uuid.v4(), subclassBase) {
    let parsedInput;
    if (!!input && typeof input === 'object') {
      parsedInput = input;
    } else if (typeof input === 'string') {
      parsedInput = {id: input};
    } else {
      parsedInput = {};
    }

    //todo - do we want to force a new ID?

    merge(this,
      subclassBase,
      {
        id: uuid.v4(),
        metadata: {
          name: '',
          description: '',
          version: '1.0.0',
          authors: [],
          tags: {},
        },
      },
      parsedInput
    );
  }

  // returns a new instance
  // uses lodash _.set() for path, e.g. 'a.b[0].c'
  // cloneDeep by default to handle deep properties that might not be handled properly by Object.assign
  mutate(path, value, bypassCloning = false) {
    const base = bypassCloning ? this : cloneDeep(this);
    return pathSet(new this.constructor(base), path, value);
  }

  // returns a new instance
  merge(obj) {
    return merge(new this.constructor(cloneDeep(this)), obj);
  }
}
