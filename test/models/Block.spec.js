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

    describe('Annotations', () => {
      const annotation = AnnotationDefinition.scaffold();

      it('annotate() should validate invalid annotations', () => {
        const clone = Object.assign({}, annotation);
        delete clone.id;
        expect(block.annotate.bind(block, clone)).to.throw();
      });

      it('annotate() should add the annotation', () => {
        const annotated = block.annotate(annotation);
        expect(annotated.sequence.annotations.length).to.equal(1);
      });

      it('removeAnnotation() should find by ID', () => {
        const annotated = block.annotate(annotation);
        const unannotated = annotated.removeAnnotation(annotation.id);
        expect(unannotated.sequence.annotations.length).to.equal(0);
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
