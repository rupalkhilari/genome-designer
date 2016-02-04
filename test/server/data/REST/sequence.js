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

      const sequence = 'aaaaacccccccgggggggtttttt';

      before(() => {
        return persistence.projectCreate(projectId, projectData)
          .then(() => persistence.blockCreate(blockId, blockData, projectId))
          .then(() => persistence.sequenceWrite(blockId, sequence, projectId));
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('GET a not real sequence returns null and a 204', (done) => {
        const url = `/data/${projectId}/${blockId}/sequence`;
        request(server)
          .get(url)
          .expect(204)
          .expect(result => {
            expect(result.body).to.be.null;
          })
          .end(done);
      });

      it('GET an existing sequence returns the block', (done) => {
        const url = `/data/${projectId}/${blockId}/sequence`;
        request(server)
          .get(url)
          .expect(200)
          .expect(result => {
            expect(result.body).to.eql(blockData);
          })
          .end(done);
      });
    });
  });
});
