import { expect } from 'chai';
import request from 'supertest';
import { getSessionKey, login, user } from '../../../src/middleware/api';

const devServer = require('../../../server/devServer');

describe('REST', () => {
  describe('/login', () => {
    let server;
    let sessionKey;
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
      request(devServer)
        .post('/auth/login')
        .send(dummyUser)
        .expect(200, done);
    });

    it('should login using client middleware login()', (done) => {
      return login(dummyUser.email, dummyUser.password)
        .then(sessionkey => {
          expect(sessionkey).to.be.not.null;
          expect(typeof sessionkey).to.equal("string");
          sessionKey = sessionkey;
          done();
        })
        .catch(function (e) {
          done(e);
        });
    });

    it('getSessionKey() should return the same session key as login()', (done) => {
      var savedSessionKey = getSessionKey();
      return login(dummyUser.email, dummyUser.password)
        .then(sessionkey => {
          expect(savedSessionKey).to.equal(sessionkey);
          done();
        })
        .catch(function (e) {
          done(e);
        });
    });

    it('should fetch a user object with a session key', (done) => {
      return user().then(user => {
        expect(user).to.be.not.null;
        expect(user.uuid).to.be.not.null;
        expect(typeof user.uuid).to.be.equal("string");
        done();
      });
    });

    //it('[future] should return the session key in the database');
    //it('[future] should ensure user exists');
    //it('[future] should error for invalid users');
  });
});
