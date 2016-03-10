import { assert, expect } from 'chai';
import request from 'supertest';
import { login, getUser } from '../../../src/middleware/api';

const devServer = require('../../../server/devServer');

describe('REST', () => {
  describe('auth', () => {
    let server;
    const dummyUser = {
      email: 'bio.nano.dev@autodesk.com',
      password: 'HelpMe#1',
    };

    before('server setup', (done) => {
      // this is needed for the middleware functions and could cause conflicts with other tests
      // recommend creating a global module to provide an app proxy to all tests using the web server from client side
      // methods
      server = devServer.listen(3000, 'localhost', function (err) {
        if (err) {
          console.log("server failure", err);
          return done(err);
        }
        done();
      });
    });

    after(() => {
      server.close();
    });

    it('/auth/login route should return a 200', (done) => {
      request(server)
        .post('/auth/login')
        .send(dummyUser)
        .expect(200, done);
    });

    it('/auth/login should set a cookie on the client', (done) => {
      request(server)
        .post('/auth/login')
        .send(dummyUser)
        .expect((res) => {
          const cookie = res.headers['set-cookie'].join(';');
          assert(cookie, 'no cookie on response for login...');
        })
        .end(done);
    });

    it('/auth/cookies should return cookies sent on request', (done) => {
      const agent = request.agent(server);

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

    //it('[future] should return the session key in the database');
    //it('[future] should ensure user exists');
    //it('[future] should error for invalid users');
  });
});
