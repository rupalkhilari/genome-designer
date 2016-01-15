import Instance from './Instance';
import { saveProject } from '../middleware/api';

export default class Project extends Instance {
  constructor(...args) {
    super(...args, {
      components: [],
    });
  }

  save() {
    return saveProject(this);
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
