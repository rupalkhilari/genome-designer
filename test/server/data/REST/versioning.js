import { assert, expect } from 'chai';
import request from 'supertest';
import Project from '../../../../src/models/Project';
import Block from '../../../../src/models/Block';
import * as filePaths from '../../../../server/utils/filePaths';
import * as versioning from '../../../../server/data/versioning';
import * as persistence from '../../../../server/data/persistence';
import devServer from '../../../../server/devServer';

describe('REST', () => {
  describe('Data', () => {
    describe('Versioning', () => {
      let server;
      const initialFields = {initial: 'value'};
      const projectData = new Project(initialFields);
      const projectId = projectData.id;
      const projectRepoPath = filePaths.createProjectPath(projectId);
      const projectManifestPath = filePaths.createProjectManifestPath(projectId);

      const blockData = new Block();
      const blockId = blockData.id;
      const blockPath = filePaths.createBlockPath(blockId, projectId);
      const blockManifestPath = filePaths.createBlockManifestPath(blockId, projectId);

      before(() => {
        return persistence.projectCreate(projectId, projectData)
          .then(() => persistence.blockCreate(blockId, blockData, projectId));
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('POST project creates commit', (done) => {
        versioning.log(projectRepoPath).then(firstResults => {
          const url = `/data/${projectId}`;
          request(server)
            .post(url)
            .send(projectData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, result) => {
              if (err) {
                done(err);
              }

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length + 1);
                  done();
                })
                .catch(done);
            });
        });
      });

      it('POST block creates commit', (done) => {
        versioning.log(projectRepoPath).then(firstResults => {
          const url = `/data/${projectId}/${blockId}`;
          request(server)
            .post(url)
            .send(blockData)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, result) => {
              if (err) {
                done(err);
              }

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length + 1);
                  done();
                })
                .catch(done);
            });
        });
      });

      it('/commit/ route creates a snapshot, accepting a message', (done) => {
        const messageText = 'some message text';
        versioning.log(projectRepoPath).then(firstResults => {
          const url = `/data/${projectId}/commit`;
          request(server)
            .post(url)
            .send({message: messageText})
            .expect(200)
            .expect('Content-Type', /text/)
            .end((err, result) => {
              if (err) {
                done(err);
              }

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length + 1);
                  const lastCommit = secondResults.slice().shift();
                  assert(lastCommit.message.indexOf(messageText) > 0, 'commit message text is missing...');
                  done();
                })
                .catch(done);
            });
        });
      });
    });
  });
});
