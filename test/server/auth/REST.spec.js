import { assert, expect } from 'chai';
import request from 'supertest';
import { login, getUser } from '../../../src/middleware/auth';

const devServer = require('../../../server/server');

describe('Server', () => {
  describe('Auth', () => {
    const dummyUser = {
      email: 'bio.nano.dev@autodesk.com',
      password: 'HelpMe#1',
    };

    it('/auth/login route should return a 200', (done) => {
      request(devServer)
        .post('/auth/login')
        .send(dummyUser)
        .expect(200, done);
    });

    it('/auth/login should set a cookie on the client', (done) => {
      request(devServer)
        .post('/auth/login')
        .send(dummyUser)
        .expect((res) => {
          const cookie = res.headers['set-cookie'].join(';');
          assert(cookie.length, 'no cookie on response for login...');
        })
        .end(done);
    });

    it('/auth/cookies should return cookies sent on request', (done) => {
      const agent = request.agent(devServer);

      agent
        .post('/auth/login')
        .send(dummyUser)
        .end((err, res) => {
          const cookie = res.headers['set-cookie'].join(';');
          assert(cookie, 'no cookie on response for login...');

          agent
            .get('/auth/cookies')
            .expect((res) => {
              expect(res.text).to.not.equal(':(');
              expect(res.text).to.equal('mock-auth');
            })
            .end(done);
        });
    });

    //todo - e2e tests for auth config / update account

    it('/user/config should get user config', () => {
      throw new Error('write me');
    });

    it('/user/config should set user config', () => {
      throw new Error('write me');
    });

    it('/user/config should error on setting invalid user config', () => {
      throw new Error('write me');
    });

    it('/user/update should merge user update', () => {
      throw new Error('write me');
    });

    it('/register accepts a configuration, returns the user', () => {
      throw new Error('write me');
    });
  });
});
