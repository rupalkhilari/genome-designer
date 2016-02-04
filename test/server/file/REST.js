import { expect } from 'chai';
import request from 'supertest';
import fs from 'fs';

const devServer = require('../../../server/devServer');

describe('REST', () => {
  describe('Files', () => {
    let server;
    beforeEach('server setup', () => {
      server = devServer.listen();
    });
    afterEach(() => {
      server.close();
    });

    const fileStoragePath = './storage/';
    const fileApiPath = '/file/';

    it('/file POST for creating files, returns route as result', (done) => {
      const fileName = 'test/testfile1';
      const apiPath = fileApiPath + fileName;

      request(server)
        .post(apiPath)
        .send('file contents')
        .expect(200)
        .expect(apiPath, done);
    });

    it('/file GET for getting files', function fileGet(done) {
      const fileName = 'test/testfile2';
      const fileContents = 'yada!';
      const apiPath = fileApiPath + fileName;

      fs.writeFile(fileStoragePath + fileName, fileContents, 'utf8', (err, result) => {
        request(server)
          .get(apiPath)
          .expect(200)
          .expect(fileContents, done);
      });
    });

    it('/file DELETE for deleting files', function fileDelete(done) {
      const fileName = 'test/testfile3';
      const fileContents = 'deleteme';
      const apiPath = fileApiPath + fileName;

      fs.writeFile(fileStoragePath + fileName, fileContents, 'utf8', (writeErr, result) => {
        request(server)
          .delete(apiPath)
          .expect(200)
          .end((deleteErr, res) => {
            fs.readFile(fileStoragePath + fileName, 'utf8', (readErr, result) => {
              expect(readErr.code).to.equal('ENOENT');
              done(deleteErr);
            });
          });
      });
    });

    it('should support deep paths', (done) => {
      const fileName = 'test/deep/path';
      const fileContents = 'content';
      const apiPath = fileApiPath + fileName;

      request(server)
        .post(apiPath)
        .set('sessionkey', sessionkey)
        .send(fileContents)
        .end(() => {
          fs.readFile(fileStoragePath + fileName, 'utf8', (err, result) => {
            expect(result).to.equal(fileContents);
            done();
          });
        });
    });
  });
});
