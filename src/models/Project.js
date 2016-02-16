import Instance from './Instance';
import ProjectDefinition from '../schemas/Project';
import { saveProject } from '../middleware/api';

export default class Project extends Instance {
  constructor(input) {
    super(input, ProjectDefinition.scaffold());
  }

  save() {
    return saveProject(this);
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
