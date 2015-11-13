import uuid from '../utils/generators/uuid';
import pathSet from 'lodash.set';
import merge from 'lodash.merge';

//todo - strip out this forceId business
export default class Instance {
  constructor(forceId = uuid(), base) {
    const input = (typeof forceId === 'object') ?
      forceId :
      {id: forceId};

    Object.assign(this,
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

  //returns a new instance
  //uses lodash _.set() for path, e.g. 'a.b[0].c'
  mutate(path, value) {
    return pathSet(new this.constructor(this), path, value);
  }
}
