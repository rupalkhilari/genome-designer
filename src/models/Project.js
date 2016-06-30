/*
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import { cloneDeep, isEqual } from 'lodash';
import invariant from 'invariant';
import Instance from './Instance';
import ProjectSchema from '../schemas/Project';
import safeValidate from '../schemas/fields/safeValidate';
import { id, version } from '../schemas/fields/validators';

const idValidator = (input, required = false) => safeValidate(id(), required, input);
const versionValidator = (ver, required = false) => safeValidate(version(), required, ver);

export default class Project extends Instance {
  constructor(input) {
    super(input, ProjectSchema.scaffold());
  }

  //return an unfrozen JSON, no instnace methods
  static classless(input) {
    return Object.assign({}, cloneDeep(new Project(input)));
  }

  static validate(input, throwOnError) {
    return ProjectSchema.validate(input, throwOnError);
  }

  //compares two projects, checking if they are the same (ignoring project version)
  static compare(one, two) {
    if (!one || !two) return false;
    if (one === two) return true;

    //massage two into a temp object with fields from one that we dont want to compare
    const massaged = two.merge({
      version: one.version,
      lastSaved: one.lastSaved,
    });

    return isEqual(one, massaged);
  }

  getName() {
    return this.metadata.name || 'Untitled Project';
  }

  //ideally, this would just return the same instance, would be much easier
  updateVersion(version, lastSaved = Date.now()) {
    invariant(versionValidator(version), 'must pass valid SHA to update version');
    invariant(Number.isInteger(lastSaved), 'must pass valid time to update version');
    return this.merge({ version, lastSaved });
  }

  addComponents(...components) {
    invariant(components.length && components.every(comp => idValidator(comp)), 'must pass component IDs');
    return this.mutate('components', components.concat(this.components));
  }

  removeComponents(...components) {
    return this.mutate('components', [...new Set(this.components.filter(comp => !components.includes(comp)))]);
  }
}
