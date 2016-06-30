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
import Instance from './Instance';
import invariant from 'invariant';
import AnnotationSchema from '../schemas/Annotation';
import cloneDeep from 'lodash.clonedeep';

export default class Annotation extends Instance {
  constructor(input) {
    super(input, AnnotationSchema.scaffold());
  }

  //return an unfrozen JSON (
  static classless(input) {
    return cloneDeep(new Annotation(input));
  }

  static validate(input, throwOnError) {
    return AnnotationSchema.validate(input, throwOnError);
  }

  get length() {
    //todo - this is super naive
    return this.end - this.start;
  }
}
