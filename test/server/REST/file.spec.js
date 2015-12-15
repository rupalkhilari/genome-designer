import { expect } from 'chai';
import request from 'supertest';
import fs from 'fs';
import { set as dbSet } from '../../../server/database';
import { readFile, writeFile } from '../../../src/middleware/api';

const devServer = require('../../../devServer');

describe('REST', () => {
  describe('Files', () => {
    let server;
    const sessionkey = '123456';
    beforeEach('server setup', () => {
      server = devServer.listen();
    });
    afterEach(() => {
      server.close();
    });

    const fileStoragePath = './storage/';
    const fileApiPath = '/api/file/';

    it('/api/file POST for creating files, returns route as result', (done) => {
      const fileName = 'test/testfile1';
      const apiPath = fileApiPath + fileName;

      request(server)
        .post(apiPath)
        .set('sessionkey', sessionkey)
        .send('file contents')
        .expect(200)
        .expect(apiPath, done);
    });

    it('/api/file GET for getting files', function fileGet(done) {
      this.timeout(5000);
      const fileName = 'test/testfile2';
      const fileContents = 'yada!';
      const apiPath = fileApiPath + fileName;

      fs.writeFile(fileStoragePath + fileName, fileContents, 'utf8', (err, result) => {
        request(server)
          .get(apiPath)
          .set('sessionkey', sessionkey)
          .expect(200)
          .expect(fileContents, done);
      });
    });

    it('/api/file DELETE for deleting files', function fileDelete(done) {
      this.timeout(5000);
      const fileName = 'test/testfile3';
      const fileContents = 'deleteme';
      const apiPath = fileApiPath + fileName;

      fs.writeFile(fileStoragePath + fileName, fileContents, 'utf8', (writeErr, result) => {
        request(server)
          .delete(apiPath)
          .set('sessionkey', sessionkey)
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
