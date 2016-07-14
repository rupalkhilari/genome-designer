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
import Immutable from './Immutable';
import AnnotationSchema from '../schemas/Annotation';
import cloneDeep from 'lodash.clonedeep';
import color from '../utils/generators/color';
import { symbolMap } from '../inventory/roles';

/**
 * Annotations mark regions of sequence with notes, colors, roles, etc.
 * Annotations are often used in imports due to the hierarchical nature of the Genetic Constructor data model. Blocks do not allow for overlaps, but many sequences have overlapping annotations. Annotations which do not overlap are used to create the Block hierarchy, while overlaps are converted into instances of the Annotation class.
 * @name Annotation
 * @extends Immutable
 * @gc Model
 */
export default class Annotation extends Immutable {
  /**
   * Create an annotation
   * @param {object} input Input object for the annotation to merge onto the scaffold
   */
  constructor(input) {
    super(input, AnnotationSchema.scaffold(), { color: color() });
  }

  /**
   * Create an unfrozen annotation, extending input with schema
   * @param {object} [input]
   * @returns {object} an unfrozen JSON, no instance methods
   */
  static classless(input) {
    return cloneDeep(new Annotation(input));
  }

  /**
   * Validate an annotation
   * @static
   * @param {object} input Object to validate
   * @param {boolean} [throwOnError=false] Validation should throw on errors
   * @throws if you specify throwOnError
   * @returns {boolean} Whether input valid
   */
  static validate(input, throwOnError) {
    return AnnotationSchema.validate(input, throwOnError);
  }

  /**
   * Get the length of the annotation
   * @returns {number}
   */
  get length() {
    //todo - this is super naive
    return this.end - this.start;
  }

  getRole(userFriendly = true) {
    const friendly = symbolMap[this.role];

    return (userFriendly === true && friendly) ?
      friendly :
      this.role;
  }
}
