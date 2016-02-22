import { expect } from 'chai';
import request from 'supertest';
import { getSessionKey, login } from '../../../src/middleware/api';

const devServer = require('../../../server/devServer');

describe.skip('REST', () => {
  describe('/login', () => {
    let server;
    const dummyUser = {
      user: 'user',
      password: 'password',
    };
    const sessionkey = '123456';
    const sessionKeyValue = {
      user: dummyUser.user,
      password: dummyUser.password,
    };
    beforeEach('server setup', () => {
      server = devServer.listen();
    });
    afterEach(() => {
      server.close();
    });

    it('should return a 200', (done) => {
      request(server)
        .get(`/login?user=${dummyUser.user}&password=${dummyUser.password}`)
        .expect(200, done);
    });

    it('login() function shouldnt error', (done) => {
      login(dummyUser.user, dummyUser.password)
        .then(sessionkey => {
          done();
        });
    });

    it('should return the session key', () => {
      return login(dummyUser.user, dummyUser.password)
        .then(sessionkey=> {
          expect(typeof sessionkey).to.equal('string');
        });
    });

    it('getSessionKey() should return the same session key as login()', () => {
      return login(dummyUser.user, dummyUser.password)
        .then(sessionkey=> {
          expect(getSessionKey()).to.equal(sessionkey);
        });
    });

    it('[future] should return the session key in the database');
    it('[future] should ensure user exists');
    it('[future] should error for invalid users');
  });
});
