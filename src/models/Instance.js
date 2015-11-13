import uuid from '../utils/generators/uuid';
import pathSet from 'lodash.set';
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';

//todo - strip out this forceId business
export default class Instance {
  constructor(forceId = uuid(), base) {
    const input = (typeof forceId === 'object') ?
      forceId :
      {id: forceId};

    merge(this,
      base,
      {
        id: uuid(),
        metadata: {
          name: '',
          description: '',
          version: '1.0.0',
          authors: [],
          tags: {},
        },
      },
      input
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
