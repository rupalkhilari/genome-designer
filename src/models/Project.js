import Instance from './Instance';

export default class Project extends Instance {
  constructor(...args) {
    super(...args, {
      components: [],
    });
  }
  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
