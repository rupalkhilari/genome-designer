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

    //todo - should we be generating this?
    let id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    //these IDs will validate pending a real check
    console.log(AnnotationDefinition.validate({
      id: id,
      metadata: {
        authors: [id, id],
        version: '1.0.0',
        tags: {}
      },
      optimizability: 'none',
      sequence : 'acgtagc'
    }));

    assert(true);
  });
});
