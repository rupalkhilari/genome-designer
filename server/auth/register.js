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
/*
 Registration + onboarding for new users.

 Handle the root /register route, which:
 - takes in their user preferences, allowing referrers to send a configuration for new user defaults
 - delegates to auth/register, to register the user
 - saves that configuration at auth/update-all
 - onboards the user according to their configuration
 */

import fetch from 'isomorphic-fetch';
import onboardingDefaults from './onboardingDefauts';
import { validateConfig } from './onboardNewUser';
import { userConfigKey } from './constants';
import { headersPost } from '../../src/middleware/headers';

// POST /register handler
/*
 Body in form  --- NB different than /auth/register
 {
 user
 config
 }
 */
export default function registerRouteHandler(req, res, next) {
  const { user: userInput, config: configInput } = req.body;

  //generate config from input + defaults
  //question!!!! - merge deeply, or shallow assign? For now, shallow assign so have to explicitly include default projects + extensions for them to show up
  const config = Object.assign({}, onboardingDefaults, configInput);

  //validate config format
  try {
    validateConfig(config);
  } catch (err) {
    return res.status(422).send(err);
  }

  const userData = {
    constructor: true,
    [userConfigKey]: config,
  };
  const user = Object.assign({}, userInput, { data: userData });

  //delegate to auth/register
  //todo - ensure this sets the full configuation (including the default preferences) and is returned on req.user for onboarding callback
  //this will check if they have been registered, and onboard them if needed
  //todo - handle them already being registered
  //fixme - non-static URL, or share constant with server

  console.log('sending');
  console.log(user);

  fetch('http://0.0.0.0:3000/auth/register', headersPost(JSON.stringify(user)))
    .then(resp => resp.json())
    .then(userPayload => {
      console.log('got payload');
      console.log(userPayload);

      if (!!userPayload.message) {
        return Promise.reject(userPayload.message);
      }
      res.json(userPayload);
    })
    .catch(err => {
      console.log('got error');
      console.log(err);
      res.status(500).send(err);
    });
}
