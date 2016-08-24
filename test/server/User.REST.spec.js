/*
 Copyright 2016 Autodesk,Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
import { assert, expect } from 'chai';
import request from 'supertest';
import { merge } from 'lodash';
import userConfigDefaults from '../../server/onboarding/userConfigDefaults';

const devServer = require('../../server/server');

describe('Server', () => {
  describe.only('User', () => {
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
        .expect(422, done);
    });

    it('GET /user/info should get pruned user', (done) => {
      const agent = request.agent(devServer);
      agent.get('/user/info')
        .expect(200)
        .expect((res) => {
          const user = res.body;
          expect(user.userid).to.be.defined;
          expect(user.email).to.be.defined;
          expect(user.firstName).to.be.defined;
          expect(user.lastName).to.be.defined;
          assert(typeof user.config === 'object', 'expected a config');
        })
        .end(done);
    });

    it('POST /user/update should merge user delta, and return user', (done) => {
      const agent = request.agent(devServer);
      const newEmail = 'billybob@joe.com';
      agent.post('/user/info')
        .send({email: newEmail})
        .expect(200)
        .expect((res) => {
          const user = res.body;
          expect(user.email).to.equal(newEmail);
        })
        .end(done);
    });

    it('POST /user/update errors on fields it doesnt know', (done) => {
      const agent = request.agent(devServer);
      agent.post('/user/info')
        .send({invalidField: 'some value'})
        .expect(422, done);
    });

    it('/register works without a configuration', (done) => {
      const agent = request.agent(devServer);
      const user = {
        email: `T.${Math.random()}@test.com`,
        password: '123456',
      };

      agent.post('/register')
        .send(user)
        .expect(200)
        .expect(res => {
          const user = res.body;
          console.log('got user');
          console.log(user);

          throw new Error('todo');

          //todo - check headers for cookie
          //todo - redirect? handle same way as auth
        })
        .end(done);
    });

    it('/register accepts a configuration, returns the user', (done) => {
      const agent = request.agent(devServer);

      const allInactive = Object.keys(userConfigDefaults.extensions).reduce((acc, key) => Object.assign(acc, { [key]: { active: false } }), {});
      const nextConfig = { projects: {}, extensions: allInactive };
      const user = {
        email: `T.${Math.random()}@test.com`,
        password: '123456',
        config: nextConfig,
      };

      agent.post('/register')
        .send(user)
        .expect(200)
        .expect(res => {
          const user = res.body;
          console.log('got user');
          console.log(user);

          throw new Error('todo');

          //todo - check headers for cookie
          //todo - redirect? handle same way as auth
        })
        .end(done);
    });
  });
});
