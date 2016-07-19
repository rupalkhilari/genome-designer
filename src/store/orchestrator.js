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
import { dispatch } from './index.js';
import mapValues from '../utils/object/mapValues';

const dispatchWrapper = (action) => (...args) => dispatch(action(...args));

const sections = ['blocks', 'clipboard', 'projects', 'ui', 'focus', 'inventory', 'inspector', 'orders'];

/**
 * The Orchestrator provides the API for third parties to interact with Genetic Constructor's Instances.
 * The Orchestrator is the object exposed on the window at `gd.api`. It merges all the actions and selectors into a single object, with a section for each group of actions + selectors.
 * Internally, all actions and selectors are automatically bound so they dispatch, without requiring the Redux syntax `store.dispatch(<action>)`.
 * @name Orchestrator
 * @example
 * //create a project with a single block in it, and rename the block
 * const block = gd.api.blocks.blockCreate({metadata: {name: 'First Name'}});
 * const project = gd.api.projects.projectCreate({components: [block.id]});
 * gd.api.blocks.blockRename(block.id, 'My New Name');
 */
export default sections.reduce((acc, section) => {
  //dont need to use static imports so long as we're using babel...
  const rawActions = require(`../actions/${section}.js`);
  const rawSelectors = require(`../selectors/${section}.js`);

  const actions = mapValues(rawActions, dispatchWrapper);
  const selectors = mapValues(rawSelectors, dispatchWrapper);

  return Object.assign(acc, {
    [section]: {
      ...actions,
      ...selectors,
    },
  });
}, {});
