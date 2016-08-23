import { assert, expect } from 'chai';
import request from 'supertest';
import { merge } from 'lodash';
import userConfigDefaults from '../../../server/onboarding/userConfigDefaults';

const devServer = require('../../../server/server');

describe('Server', () => {
  describe.only('Auth', () => {
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

    it('/user/config should get user config', (done) => {
      const agent = request.agent(devServer);

      agent.get('/user/config')
        .expect(200)
        .expect((res) => {
          const config = res.body;
          assert(typeof config === 'object', 'expected a config');
          assert(typeof config.projects === 'object', 'expected projects config');
          assert(typeof config.extensions === 'object', 'expected an extensions config');
        })
        .end(done);
    });

    it('/user/config should set user config', (done) => {
      const agent = request.agent(devServer);

      const allInactive = Object.keys(userConfigDefaults.extensions).reduce((acc, key) => Object.assign(acc, { [key]: { active: false } }), {});
      const nextConfig = merge({}, userConfigDefaults, { extensions: allInactive });

      agent.post('/user/config')
        .send(nextConfig)
        .expect(200)
        .expect((res) => {
          const config = res.body;
          assert(typeof config === 'object', 'expected a config');
          assert(typeof config.projects === 'object', 'expected projects config');
          assert(typeof config.extensions === 'object', 'expected an extensions config');
          expect(config.extensions).to.eql(nextConfig.extensions);
          expect(config.projects).to.eql(nextConfig.projects);
        })
        .end(done);
    });

    it('/user/config should error on setting invalid user config', (done) => {
      const agent = request.agent(devServer);
      agent.post('/user/config')
        .send({ extensions: [] })
        .expect(422, done)
    });

    it('/user/update should merge user update', () => {
      throw new Error('write me');
    });

    it('/register accepts a configuration, returns the user', () => {
      throw new Error('write me');
    });
  });
});
