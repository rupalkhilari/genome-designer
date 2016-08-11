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
import { errorNoPermission } from '../utils/errors';
import { getConfigFromUser } from '../auth/utils';
import { errorExtensionNotFound } from '../utils/errors';
import extensionRegistry  from './registry';

export const checkUserExtensionAccess = (extensionKey, user) => {
  const config = getConfigFromUser(user);
  const extPrefs = config[extensionKey];
  return extPrefs && extPrefs.access === true;
};

export const checkUserExtensionVisible = (extensionKey, user) => {
  const config = getConfigFromUser(user);
  const extPrefs = config[extensionKey];
  return extPrefs && extPrefs.visible === true;
};

//check if the extension has been registered, assign req.extensionKey
export const checkExtensionExistsMiddleware = (req, res, next) => {
  const { ext } = req.params;

  const extension = extensionRegistry[ext];

  if (!extension) {
    console.log(`could not find extension ${ext} in registry (${Object.keys(extensionRegistry).join(', ')})`);
    return res.status(404).send(errorExtensionNotFound);
  }

  Object.assign(req, { extensionKey: ext });

  //let the route continue
  next();
};

//todo - need to set req.extensionKey where appropriate
//expects req.extensionKey and req.user to be set
//run checkExtensionExistsMiddleware first, which sets extensionKey
export const checkUserExtensionAccessMiddleware = (req, res, next) => {
  const config = getConfigFromUser(req.user);

  if (!req.extensionKey) {
    console.warn('[auth extensions permissions] no extensionKey on req');
    next('expected extensionKey on request');
  }

  if (!config) {
    console.warn('[auth extensions permissions] no user config found for user ' + req.user.uuid);
    next('expected a user configuration');
  }

  if (checkUserExtensionAccess(req.extensionKey, config)) {
    return next();
  }
  return res.status(403).send(errorNoPermission);
};
