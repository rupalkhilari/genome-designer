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

  addComponent(component, index) {
    const spliceIndex = Number.isInteger(index) ? index : this.components.length;
    const newComponents = this.components.slice();
    newComponents.splice(spliceIndex, 0, component);
    return this.mutate('components', newComponents);
  }
}
