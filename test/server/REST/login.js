import { expect } from 'chai';
import request from 'supertest';
import { set as dbSet } from '../../../server/database';
import { getSessionKey, login } from '../../../src/middleware/api';

const devServer = require('../../../devServer');

describe('REST', () => {
  describe('/login', () => {
    let server;
    const dummyUser = {
      user: 'user',
      password: 'password',
    };
    const sessionkey = '123456';
    beforeEach('server setup', () => {
      server = devServer.listen();
      return dbSet(sessionkey, {});
    });
    afterEach(() => {
      server.close();
    });

    it('should return a 200', (done) => {
      request(server)
        .get(`/login?user=${dummyUser.user}&password=${dummyUser.password}`)
        .expect(200, done);
    });

    it('login() function shuold work', (done) => {
      login('user', 'password')
        .then(sessionkey => {
          done();
        });
    });

    it('should return the session key', () => {
      return login('user', 'password')
        .then(sessionkey=> {
          expect(typeof sessionkey).to.equal('string');
        });
    });

    it('[future] should ensure user exists');
  });
});
