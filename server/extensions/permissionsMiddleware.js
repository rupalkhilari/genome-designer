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
import onboardingDefaults from '../auth/onboardingDefauts';
import { errorNoPermission } from '../utils/errors';
import { userConfigKey } from '../auth/constants';

export const checkUserAccess = (extensionKey, config) => {
  const extPrefs = config[extensionKey];
  return extPrefs && extPrefs.access === true;
};

export const checkUserVisible = (extensionKey, config) => {
  const extPrefs = config[extensionKey];
  return extPrefs && extPrefs.visible === true;
};

//expects req.extensionKey and req.user
export const checkUserAccessMiddleware = (req, res, next) => {
  const config = req.user.data[userConfigKey] || onboardingDefaults;

  //handling not set e.g. for old users - just use defaults?

  invariant(req.extensionKey, 'expected extensionKey on request');
  invariant(config, 'expected a user configuration');

  if (checkUserAccess(req.extensionKey, config)) {
    return next();
  }
  return next(errorNoPermission);
};

