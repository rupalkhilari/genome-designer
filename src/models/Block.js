import Instance from './Instance';
import randomColor from '../utils/generators/color';

export default class Block extends Instance {
  constructor(...args) {
    super(...args, {
      metadata: {
        color: randomColor(),
      },
      sequence: {},
      source: {},
      rules: [],
      options: [],
      components: [],
      notes: {},
    });
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
