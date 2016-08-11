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
import invariant from 'invariant';
import { values } from 'lodash';

import userConfigDefaults from './userConfigDefaults';
import { userConfigKey } from './userConstants';

//validate config on user.data
//todo - should validate that the projects and extensions exist
export const validateConfig = (config) => {
  const { projects, extensions } = config;

  if (projects !== undefined) {
    invariant(typeof projects === 'object', 'config.projects must be an object');
    invariant(values(projects).every(projectConfig => projectConfig.access === true || projectConfig.access === false), 'each project configuration must specify access');
  }

  if (extensions !== undefined) {
    invariant(typeof extensions === 'object', 'config.extensions must be an object');
    invariant(values(extensions).every(projectConfig => projectConfig.access === true || projectConfig.access === false), 'each project configuration must specify access');
  }

  return true;
};

export const getConfigFromUser = (user, def = userConfigDefaults) => {
  const { data } = user;
  if (!data) {
    return def;
  }
  return data[userConfigKey] || def;
};

//validate + create a merged config
//throws if invalid, so should try-catch appropriately
export const updateUserConfig = (user, newConfig) => {
  const oldConfig = getConfigFromUser(user);

  //question!!!! - merge deeply, or shallow assign? For now, shallow assign so have to explicitly include default projects + extensions for them to show up
  const config = Object.assign({}, oldConfig, newConfig);

  validateConfig(config);

  const userData = {
    constructor: true,
    [userConfigKey]: config,
  };

  return Object.assign({}, user, { data: userData });
};

export const pruneUserObject = (user) => {
  const config = getConfigFromUser(user);
  const fields = ['uuid', 'firstName', 'lastName', 'email'];
  const fieldsObject = fields.reduce((acc, field) => Object.assign(acc, { [field]: user[field] }), {});

  return Object.assign(fieldsObject, { config });
};

export const pruneUserObjectMiddleware = (req, res, next) => {
  Object.assign(req, { user: pruneUserObject(req.user) });
  next();
};

export const ensureReqUserMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send('no user found on request');
  }
  next();
};
