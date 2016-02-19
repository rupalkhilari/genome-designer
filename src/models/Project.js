import Instance from './Instance';
import ProjectDefinition from '../schemas/Project';

export default class Project extends Instance {
  constructor(input) {
    super(input, ProjectDefinition.scaffold());
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
