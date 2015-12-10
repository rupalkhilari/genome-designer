import chai from 'chai';
import Block from '../../src/models/Block';
import AnnotationDefinition from '../../src/schemas/Annotation';
import setupAuthentication from '../server/authentication';

const { assert, expect } = chai;

describe('Model', () => {
  describe('Block', () => {
    let block;
    beforeEach(() => {
      block = new Block();
    });

    describe.only('Annotations', () => {
      let annotation;
      beforeEach(() => {
        annotation = AnnotationDefinition.scaffold();
      });

      it('annotate() should validate', () => {
        console.log(block.sequence);
        console.log(annotation);
        //todo - should have fields ID and annotations already present
      });

      it('removeAnnotation() should find by ID', () => {

      });
    });

    describe('save()', () => {
      before(setupAuthentication);

      it('exists', () => {
        expect(typeof block.save).to.equal('function');
      });

      it('persists it', (done) => {
        block.save()
          .then(response => response.json())
          .then(json => {
            expect(json).to.eql(block);
            done();
          });
      });
    });
  });
});
