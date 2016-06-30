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
import { registry, getSources } from '../inventory/registry';

const zip = (keys, vals) => keys.reduce(
  (acc, key, ind) => Object.assign(acc, { [key]: vals[ind] }), {}
);

//todo - ideally, farm these out separately without a Promise.all (dont wait for all to resolve)
export const search = (term, options, sourceList = []) => {
  const sources = getSources('search');

  invariant(typeof term === 'string', 'Term must be a string');
  invariant(Array.isArray(sourceList), 'must pass array for search source list');
  invariant(sourceList.every(source => sources.includes(source)), `sourceList contains source not in the list of supported sources: ${sourceList} // ${sources}`);

  const searchSources = (sourceList.length === 0) ? sources : sourceList;

  return Promise.all(
    searchSources.map(source => {
      //dont search if no term, just return empty set
      if (!term.length) {
        return Promise.resolve([]);
      }
      return registry[source].search(term, options);
    })
    )
    .then(results => zip(searchSources, results));
};

export const blast = () => {
  invariant(false, 'not implemented');
};
