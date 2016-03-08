import { expect } from 'chai';
import request from 'supertest';
import { login, getUser } from '../../../src/middleware/api';

const devServer = require('../../../server/devServer');

describe('REST', () => {
  describe.only('/login', () => {
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

    it('should return a 200', (done) => {
      request(server)
        .post('/auth/login')
        .send(dummyUser)
        .expect(200, done);
    });

    it('should login using client middleware login()', () => {
      return login(dummyUser.email, dummyUser.password)
        .then(userInfo => {
          expect(userInfo).to.be.not.null;
          expect(userInfo.uuid).to.be.not.null;
          expect(userInfo.email).to.be.not.null;
        });
    });

    it('login() should set a cookie');

    it('should fetch a user object with a session key, if you are logged in', () => {
      return getUser()
        .then(user => {
          expect(user).to.be.not.null;
          expect(user.uuid).to.be.not.null;
          expect(typeof user.uuid).to.be.equal('string');
        });
    });

    it('logout() should clear cookie');

    //it('[future] should return the session key in the database');
    //it('[future] should ensure user exists');
    //it('[future] should error for invalid users');
  });
});
