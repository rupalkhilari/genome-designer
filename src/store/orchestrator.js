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
