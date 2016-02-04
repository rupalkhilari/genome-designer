import { assert, expect } from 'chai';
import request from 'supertest';
import Project from '../../../../src/models/Project';
import Block from '../../../../src/models/Block';
import * as persistence from '../../../../server/data/persistence';
import devServer from '../../../../server/devServer';

describe('REST', () => {
  describe('Data', () => {
    describe('Sequence', () => {
      let server;
      const projectData = new Project();
      const projectId = projectData.id;

      const blockData = new Block();
      const blockId = blockData.id;

      const blockNoSequence = new Block();
      const blockNoSequenceId = blockNoSequence.id;

      const sequence = 'aaaaacccccccgggggggtttttt';

      before(() => {
        return persistence.projectCreate(projectId, projectData)
          .then(() => persistence.blockCreate(blockId, blockData, projectId))
          .then(() => persistence.blockCreate(blockNoSequenceId, blockNoSequence, projectId))
          .then(() => persistence.sequenceWrite(blockId, sequence, projectId));
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('GET errors with 400 when block doesnt exist', (done) => {
        const url = `/data/${projectId}/InvalidId/sequence`;
        request(server)
          .get(url)
          .expect(400, done);
      });

      it('GET a non-extant sequence returns empty and a 204', (done) => {
        const url = `/data/${projectId}/${blockNoSequenceId}/sequence`;
        request(server)
          .get(url)
          .expect(204)
          .expect(result => {
            expect(result.body).to.be.empty;
          })
          .end(done);
      });

      it('GET an existing sequence returns the sequence', (done) => {
        const url = `/data/${projectId}/${blockId}/sequence`;
        request(server)
          .get(url)
          .expect(200)
          .expect('Content-Type', /text/)
          .expect(result => {
            console.log('receieved ', result);
            expect(result.text).to.eql(sequence);
          })
          .end(done);
      });

      it('POST writes the sequence', (done) => {
        const newSequence = 'acgtacgtacgtacgtacgt';
        const url = `/data/${projectId}/${blockId}/sequence`;
        request(server)
          .post(url)
          .type('text/plain')
          .send(newSequence)
          .expect(200)
          .end((err, result) => {
            if (err) {
              done(err);
            }

            persistence.sequenceGet(blockId, projectId)
              .then(seq => {
                expect(seq).to.equal(newSequence);
                done();
              })
              .catch(done);
          });
      });

      //todo
      it('POST returns the sequence length and md5');

      //future
      it('POST validates the sequence');

      it('DELETE deletes the sequence', (done) => {
        const url = `/data/${projectId}/${blockId}/sequence`;
        request(server)
          .delete(url)
          .expect(200)
          .end((err, result) => {
            if (err) {
              done(err);
            }

            persistence.sequenceGet(blockId, projectId)
              .then((seq) => {
                assert(!seq);
                done();
              })
              .catch(done);
          });
      });

      it('DELETE errors when sequence doesnt exist', (done) => {
        const url = `/data/${projectId}/${blockNoSequenceId}/sequence`;
        request(server)
          .delete(url)
          .expect(400, done);
      });
    });
  });
});
