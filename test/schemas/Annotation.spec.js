import AnnotationDefinition from '../../src/schemas/Annotation';
import { Annotation as exampleAnnotation } from './examples';
import chai from 'chai';

const { assert } = chai;

describe('AnnotationDefinition', () => {
  it('should be loggable', () => {
    //console.log(AnnotationDefinition);

    assert(true);
  });

  it('should describe', () => {
    const description = AnnotationDefinition.describe();
    //console.log(description);

    assert(typeof description === 'object');
  });


  it('should validate the example', () => {
    assert(AnnotationDefinition.validate(exampleAnnotation));
  });
});
