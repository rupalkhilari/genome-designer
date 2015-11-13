import uuid from '../utils/generators/uuid';
import pathSet from 'lodash.set';
import merge from 'lodash.merge';

export default class Instance {
  constructor(forceId = uuid()) {
    const base = (typeof forceId === 'object') ?
      forceId :
      {id: forceId};

    Object.assign(this,
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
      base
    );
  }

  //returns a new instance
  //uses lodash _.set() for path, e.g. 'a.b[0].c'
  mutate(path, value) {
    return pathSet(new this.constructor(this), path, value);
  }
}
