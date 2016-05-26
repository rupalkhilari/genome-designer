import { assert, expect } from 'chai';
import request from 'supertest';
import { login, getUser } from '../../src/middleware/auth';

const devServer = require('../../server/server');

describe('middleware', () => {
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

    it('login() receive the user object', () => {
      return login(dummyUser.email, dummyUser.password)
        .then(userInfo => {
          expect(userInfo).to.be.not.null;
          expect(userInfo.uuid).to.be.not.null;
          expect(userInfo.email).to.be.not.null;
        });
    });

    //not sure how to test this... jsdom doesn't set cookies apparently
    it('login() should set a cookie');

    it('getUser() should fetch a user object if you are logged in', () => {
      return getUser()
        .then(user => {
          expect(user).to.be.not.null;
          expect(user.uuid).to.be.not.null;
          expect(typeof user.uuid).to.be.equal('string');
        });
    });

    //not sure how to test this...
    it('logout() should clear cookie');
  });
});