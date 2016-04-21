import Instance from './Instance';
import invariant from 'invariant';
import AnnotationDefinition from '../schemas/Annotation';
import cloneDeep from 'lodash.clonedeep';

export default class Annotation extends Instance {
  constructor(input) {
    super(input, AnnotationDefinition.scaffold());
  }

  //return an unfrozen JSON (
  static classless(input) {
    return cloneDeep(new Annotation(input));
  }

  static validate(input, throwOnError) {
    return AnnotationDefinition.validate(input, throwOnError);
  }

  get length() {
    //todo - this is super naive
    return this.end - this.start;
  }
}
