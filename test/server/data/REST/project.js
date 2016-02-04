import { expect } from 'chai';
import request from 'supertest';
import Project from '../../../../src/models/Project';
import * as persistence from '../../../../server/data/persistence';
import devServer from '../../../../server/devServer';

describe('REST', () => {
  describe('Data', () => {
    describe('Projects', () => {
      let server;
      const projectData = new Project();
      const projectId = projectData.id;

      before(() => {
        return persistence.projectCreate(projectId, projectData);
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('GET a not real project returns null and a 204', (done) => {
        const url = `/data/fakeId`;
        request(server)
          .get(url)
          .expect(204)
          .expect(result => {
            expect(result.body).to.be.null;
          })
          .end(done);
      });

      it('GET an existing project returns the project', (done) => {
        const url = `/data/${projectId}`;
        request(server)
          .get(url)
          .expect(200)
          .expect(result => {
            expect(result.body).to.eql(projectData);
          })
          .end(done);
      });
    });
  });
});
