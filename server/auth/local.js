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
import userConfigDefaults from './userConfigDefaults';
import { userConfigKey } from './userConstants';
import { getConfigFromUser } from './utils';

export const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json();

const defaultUserForcedFields = {
  uuid: '0',
};

const configForDefaultUser = Object.assign({}, userConfigDefaults);
const userData = Object.assign({}, { [userConfigKey]: configForDefaultUser });

//this object will get updated as /register and /update the user (one user in local auth)
export const defaultUser = Object.assign(
  {
    email: 'developer@localhost',
    firstName: 'Dev',
    lastName: 'Eloper',
  },
  { data: userData },
  defaultUserForcedFields
);

// @ req.user.data[userConfigKey]

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

router.get('/logout', (req, res) => {
  res.status(501).send('cant log out of local auth');
});

// simulate saving to the user object.
// allow writing user config, but not ID etc.
// expects full user object to be posted
const handleRegisterOrUpdate = (req, res, next) => {
  const userInput = req.body;
  const inputConfig = getConfigFromUser(userInput);

  //todo - should we merge deep?
  const userConfig = Object.assign({}, configForDefaultUser, inputConfig);
  const userData = Object.assign({}, defaultUser.data, { [userConfigKey]: userConfig });

  //assign to the default user
  Object.assign(defaultUser, userInput, { data: userData }, defaultUserForcedFields);

  //console.log('[Local Auth - User Update]');
  //console.log(JSON.stringify(defaultUser, null, 2));

  res.json(defaultUser);
};

// register the new user
// POST user object
//we aren't really creating a user - we are just updating the preferences of default user (since there is only one user in local auth)
router.post('/register', jsonParser, handleRegisterOrUpdate);

// update user information
// POST user object
// for the moment, not actually persisted, just save for the session of the server (and there is only one user)
router.post('/update-all', jsonParser, handleRegisterOrUpdate);

// testing only

// route not present in auth module
router.get('/cookies', (req, res) => {
  if (req.cookies.sess) {
    return res.send(req.cookies.sess);
  }

  res.send(':(');
});

//assign the user to the request, including their config
export const mockUser = (req, res, next) => {
  if (req.cookies.sess !== null) {
    Object.assign(req, { user: defaultUser });
  }

  //stub the initial user setup here as well
  checkUserSetup({ uuid: defaultUser.uuid })
    .then(() => next());
};
