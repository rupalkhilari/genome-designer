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

  static validate(input, throwOnError) {
    return ProjectDefinition.validate(input, throwOnError);
  }

  addComponents(...components) {
    return this.mutate('components', this.components.concat(components));
  }

  removeComponents(...components) {
   return this.mutate('components', [...new Set(this.components.filter(comp => !components.includes(comp)))]);
 }
}
