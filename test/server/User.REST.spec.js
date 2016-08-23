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

const devServer = require('../../../server/server');

describe('Server', () => {
  describe('User', () => {
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
