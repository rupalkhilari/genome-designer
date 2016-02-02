import { expect } from 'chai';
import { Block as exampleBlock } from '../../schemas/_examples';
import { set as dbSet } from '../../../server/deprecated/database';
import request from 'supertest';

const devServer = require('../../../server/devServer');

describe.skip('REST', () => {
  let server;
  const sessionkey = '123456';
  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionkey, {});
  });
  afterEach(() => {
    server.close();
  });

  describe('Clone', () => {
    it('should require an ID', (done) => {
      const parent = exampleBlock;
      request(server)
        .post('/api/clone')
        .set('sessionkey', sessionkey)
        .send(parent)
        .expect(404, done);
    });

    it('should be a valid endpoint with an ID', (done) => {
      const parent = exampleBlock;
      request(server)
        .put(`/api/block/${parent.id}`)
        .set('sessionkey', sessionkey)
        .send(parent)
        .expect(200, makeClone);

      function makeClone() {
        request(server)
          .post(`/api/clone/${parent.id}`)
          .set('sessionkey', sessionkey)
          .send()
          .expect(200, done);
      }
    });

    it('should only work with instances in the database');

    it('should return the clone, with proper parent', (done) => {
      const parent = Object.assign(exampleBlock, {
        other: 'field',
      });
      request(server)
        .put(`/api/block/${parent.id}`)
        .set('sessionkey', sessionkey)
        .send(parent)
        .expect(200, makeClone);

      function makeClone() {
        request(server)
          .post(`/api/clone/${parent.id}`)
          .set('sessionkey', sessionkey)
          .send()
          .expect(200)
          .expect(result => {
            const descendent = result.body;
            expect(descendent.id).to.not.equal(parent.id);
            expect(descendent.parent).to.equal(parent.id);
            expect(descendent.other).to.equal(parent.other);
          })
          .end(done);
      }
    });

    it('should save the clone to the database', (done) => {
      const parent = Object.assign(exampleBlock, {
        other: 'field',
      });
      let descendent;
      request(server)
        .put(`/api/block/${parent.id}`)
        .set('sessionkey', sessionkey)
        .send(parent)
        .expect(200, makeClone);

      function makeClone() {
        request(server)
          .post(`/api/clone/${parent.id}`)
          .set('sessionkey', sessionkey)
          .send()
          .expect(result => {
            descendent = result.body;
            expect(descendent.id).to.not.equal(parent.id);
            expect(descendent.parent).to.equal(parent.id);
            expect(descendent.other).to.equal(parent.other);
          })
          .expect(200, testClone);
      }

      function testClone() {
        request(server)
          .get(`/api/block/${descendent.id}`)
          .set('sessionkey', sessionkey)
          .expect(200)
          .expect(result => {
            expect(result.body).to.eql(descendent);
          })
          .end(done);
      }
    });
  });
});
