import chai from 'chai';
import merge from 'lodash.merge';
import { writeFile } from '../../src/middleware/api';
import Block from '../../src/models/Block';
import AnnotationDefinition from '../../src/schemas/Annotation';

const { expect } = chai;

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

    describe('Sequence', () => {
      const withoutSequence = new Block();
      const sequence = 'acgtacgt';
      const sequenceUrl = 'test/block/sequence';
      const withSequence = withoutSequence.mutate('sequence.url', sequenceUrl);

      before(() => {
        return writeFile(sequenceUrl, sequence);
      });

      it('getSequenceUrl() opts for local sequence url over id', () => {
        const { id } = withoutSequence;
        const idUrl = withoutSequence.getSequenceUrl();
        expect(idUrl.indexOf(id) >= 0);

        const seqUrl = withSequence.getSequenceUrl();
        expect(seqUrl.indexOf(sequenceUrl) >= 0);
      });

      it('hasSequenceUrl() checks for sequence URL', () => {
        expect(withoutSequence.hasSequenceUrl()).to.equal(false);
        expect(withSequence.hasSequenceUrl()).to.equal(true);
      });

      it('getSequence() returns promise -> null when there is no sequence', (done) => {
        return withoutSequence.getSequence()
          .then((result) => {
            expect(result).to.eql(null);
            done();
          });
      });

      it('getSequence() retrieves the sequence as promise', () => {
        return withSequence.getSequence()
          .then(result => {
            expect(result).to.eql(sequence);
          });
      });

      it('setSequenceUrl() only sets the URL (use action instead)', () => {
        const assignedSequence = merge({}, withoutSequence, {
          sequence: {
            url: sequenceUrl,
          },
        });
        expect(assignedSequence).to.eql(withSequence);
      });
    });

    describe('save()', () => {
      it('exists', () => {
        expect(typeof block.save).to.equal('function');
      });

      //need to pass in project (a valid one, so can commit project)
      it.skip('persists it', (done) => {
        block.save()
          .then(json => {
            expect(json).to.eql(block);
            done();
          })
          .catch(done);
      });
    });
  });
});
