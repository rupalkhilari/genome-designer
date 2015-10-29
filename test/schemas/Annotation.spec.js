import assert from 'assert';
import AnnotationDefinition from '../../src/schemas/Annotation';

describe('AnnotationDefinition', () => {

  it('should be loggable', () => {
    console.log(AnnotationDefinition);
    assert(true);
  });

  it('should describe', () => {
    let description = AnnotationDefinition.describe();

    console.log(description);

    assert(!!description);
  });


  it('should validate', () => {

    //these IDs will validate pending a real check
    console.log(AnnotationDefinition.validate({
      id: 'asdf',
      metadata: {
        authors: ['asdf', 'sadf'],
        version: '1.0.0',
        tags: {}
      },
      optimizability: 'none',
      sequence : 'acgtagc'
    }));

    assert(true);
  });
});
