import Instance from './Instance';

export default class Block extends Instance {
  constructor(forceId) {
    super(forceId);

    Object.assign(this, {
      components: [],
    });
  }
}
