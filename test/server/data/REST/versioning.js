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
      let versionLog;
      let versions;
      const projectData = new Project();
      const projectId = projectData.id;
      const projectRepoPath = filePaths.createProjectPath(projectId);
      const newProject = projectData.merge({projectData: 'new stuff'});

      const blockData = new Block();
      const blockId = blockData.id;
      const newBlock = blockData.merge({blockData: 'new data'});

      before(() => {
        return persistence.projectCreate(projectId, projectData)
          .then(() => persistence.blockCreate(blockId, blockData, projectId))
          .then(() => persistence.projectSave(projectId))
          .then(() => persistence.projectWrite(projectId, newProject))
          .then(() => persistence.projectSave(projectId))
          .then(() => persistence.blockWrite(blockId, newBlock, projectId))
          .then(() => persistence.projectSave(projectId))
          .then(() => versioning.log(projectRepoPath))
          .then(log => {
            versionLog = log;
            versions = versionLog.map(commit => commit.sha);
          });
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('POST /:projectId does not create commit', (done) => {
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
                return;
              }

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length);
                  done();
                })
                .catch(done);
            });
        });
      });

      it('POST /:projectId/:blockId does not create commit', (done) => {
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
                return;
              }

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length);
                  done();
                })
                .catch(done);
            });
        });
      });

      it('POST /:projectId/commit/ creates a snapshot, accepting a message, returns a SHA', (done) => {
        const messageText = 'some message text';
        versioning.log(projectRepoPath).then(firstResults => {
          const url = `/data/${projectId}/commit`;
          request(server)
            .post(url)
            .send({message: messageText})
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, result) => {
              if (err) {
                done(err);
                return;
              }

              expect(result.sha).to.be.defined;
              expect(result.message).to.be.defined;

              versioning.log(projectRepoPath)
                .then(secondResults => {
                  expect(secondResults.length).to.equal(firstResults.length + 1);
                  const lastCommit = secondResults.slice().shift();
                  assert(lastCommit.message.indexOf(messageText) >= 0, 'commit message text is missing...');
                  done();
                })
                .catch(done);
            });
        });
      });

      it('GET /:projectId/commit returns the git log');

      it('GET /:projectId/commit/:sha returns the project at a certain point', (done) => {
        const url = `/data/${projectId}/commit/${versions[3]}`;
        request(server)
          .get(url)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, result) => {
            if (err) {
              done(err);
              return;
            }
            expect(result.body).to.eql(projectData);
            done();
          });
      });

      it('GET /:projectId/:blockId/commit returns the git log');

      it('GET /:projectId/:blockId/commit/:sha returns block at a certain point', (done) => {
        const url = `/data/${projectId}/${blockId}/commit/${versions[2]}`;
        request(server)
          .get(url)
          .expect(200)
          .expect('Content-Type', /json/)
          .end((err, result) => {
            if (err) {
              done(err);
              return;
            }
            expect(result.body).to.eql(blockData);
            done();
          });
      });
    });
  });
});
