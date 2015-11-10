import uuid from '../utils/generators/uuid';

export default class Instance {
  constructor(forceId = uuid()) {
    Object.assign(this, {
      id: forceId,
      metadata: {
        name: '',
        description: '',
        version: '1.0.0',
        authors: [],
        tags: {},
      },
    });
  }
}
