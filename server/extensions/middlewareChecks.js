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
import { errorNoPermission } from '../utils/errors';
import { getConfigFromUser } from '../auth/utils';
import { errorExtensionNotFound } from '../utils/errors';
import extensionRegistry from './registry';

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
//expects :extension in the route
export const checkExtensionExistsMiddleware = (req, res, next) => {
  const { extension } = req.params;

  //invariant, since this is not run-time
  invariant(!!extension, 'expected :extension in route params');

  Object.assign(req, { extensionKey: extension });

  const extensionManifest = extensionRegistry[extension];

  if (!extensionManifest) {
    console.log(`could not find extension ${extension} in registry (${Object.keys(extensionRegistry).join(', ')})`);
    return res.status(404).send(errorExtensionNotFound);
  }

  //let the route continue
  next();
};

//expects req.extensionKey and req.user to be set, and user to have a config (or valid default)
//run checkExtensionExistsMiddleware first, which sets extensionKey
export const checkUserExtensionAccessMiddleware = (req, res, next) => {
  const { user, extensionKey } = req;
  const config = getConfigFromUser(user);

  //only should call this middleware when extensionKey exists
  invariant(extensionKey, '[auth extensions permissions] no extensionKey on req');

  //config should always exist, at least returning a default
  invariant(config, '[auth extensions permissions] no user config found for user ' + user.uuid);

  if (checkUserExtensionAccess(extensionKey, config)) {
    return next();
  }
  return res.status(403).send(errorNoPermission);
};
