import cloneDeep from 'lodash.clonedeep';
import Instance from './Instance';
import ProjectDefinition from '../schemas/Project';

export default class Project extends Instance {
  constructor(input) {
    super(input, ProjectDefinition.scaffold());
  }

  //return an unfrozen JSON (
  static classless(input) {
    return cloneDeep(new Project(input));
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }
}
