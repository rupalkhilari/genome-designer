import Instance from './Instance';
import ProjectDefinition from '../schemas/Project';
import { saveProject, snapshotProject } from '../middleware/api';

export default class Project extends Instance {
  constructor(input) {
    super(input, ProjectDefinition.scaffold());
  }

  //saves to file system
  save() {
    return saveProject(this);
  }

  //makes a git commit
  snapshot() {
    return snapshotProject(this);
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
