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
import registry, { register, validRegion } from './clientRegistry';
import merge from 'lodash.merge';
import invariant from 'invariant';

const registerExtension = (manifest, render) => {
  const { name, region } = manifest;
  invariant(name, 'Name is required');
  invariant(typeof render === 'function', 'Must provide a render function to register a plugin');
  invariant(region || region === null, 'Region (manifest.region) is required to register a plugin, or null for non-visual plugins');
  invariant(validRegion(region), 'Region must be a valid region');

  const merged = merge({}, registry[name], manifest, {render});
  register(merged);
  return merged;
};

export default registerExtension;
