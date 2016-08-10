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
/**
 * Mock authentication for local development, or when the bionano-auth package is not in use.
 *
 * The default user is used for all requests, and its ID is used for all permissions / keying.
 *
 * Exposes a few routes but does not exhaustively cover the bionano-auth router.
 *
 * This user is used in unit testing.
 */
import express from 'express';
import bodyParser from 'body-parser';
import checkUserSetup from './userSetup';
import onboardingDefaults from './onboardingDefauts';
import { userConfigKey } from './constants';

export const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

export const defaultUser = {
  uuid: '0',
  email: 'developer@localhost',
  firstName: 'Dev',
  lastName: 'Eloper',
};

//basic auth routes

router.post('/login', (req, res) => {
  res.cookie('sess', 'mock-auth');
  res.statusCode = 200;
  res.send(defaultUser);
  return res.end();
});

router.get('/current-user', (req, res) => {
  if (req.cookies.sess === null) {
    console.log('didnt find the session cookie; check the mock login route.');
    return res.status(401).end();
  }

  if (req.user === null) {
    console.log('auth middleware error; req.user is null');
    res.statusCode = 500;
    return res.end();
  }

  res.statusCode = 200;
  res.send(req.user);
  return res.end();
});

// testing only

// route not present in auth module
router.get('/cookies', (req, res) => {
  if (req.cookies.sess) {
    return res.send(req.cookies.sess);
  }

  res.send(':(');
});

// user config

// @ req.user.data[userConfigKey]
const configForDefaultUser = Object.assign({}, onboardingDefaults);

// simulate saving to the user object.
// expects full user object to be posted
// for the moment, not actually persistend, just save for the session of the server (and there is only one user)
router.post('/update-all', jsonParser, (req, res) => {
  const userObject = req.body;
  Object.assign(configForDefaultUser, userObject.data[userConfigKey]);
});

//assign the user to the request, including their config
export const mockUser = (req, res, next) => {
  if (req.cookies.sess !== null) {
    const userData = Object.assign({}, req.user.data, { [userConfigKey]: configForDefaultUser });
    const user = Object.assign({}, defaultUser, { data: userData });
    Object.assign(req, { user });
  }

  //stub the initial user setup here as well
  checkUserSetup({ uuid: defaultUser.uuid })
    .then(() => next());
};
