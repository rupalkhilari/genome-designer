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
import { registry, getSources } from './registry';

/**
 * Searching across inventories loaded in Constructor.
 * @module search
 */

/**
 * Run a search over a inventory source.
 * @memberOf module:search
 * @param {string} term Search term
 * @param {Object} options Options, defined in {@link module:search}
 * @param {string} sourceKey Key of search in search registry
 * @returns {Promise}
 * @resolve {Object} searchResults In form { <key> : <results array> }
 * @reject {Error} Error If the search fails or hits > 400 status code
 */
export const search = (term, options, sourceKey) => {
  const sources = getSources('search');

  invariant(typeof term === 'string', 'Term must be a string');
  invariant(sources.includes(sourceKey), `source ${sourceKey} not found in list of sources: ${sources.join(', ')}`);

  const searchPromise = !term.length ?
    Promise.resolve([]) :
    registry[sourceKey].search(term, options);

  return searchPromise.then(results => ({
    [sourceKey]: results,
  }));
};

/**
 * Search multiple sources at once
 * @memberOf module:search
 * @param {string} term search
 * @param {Object} options See search
 * @param {Array} sourceList
 * @returns {Promise}
 * @resolve {Object} results, keyed by search source
 * @reject {Error} Error while searching, e.g. if one rejected
 */
export const searchMultiple = (term, options, sourceList = []) => {
  const sources = getSources('search');
  const searchSources = (sourceList.length === 0) ? sources : sourceList;

  invariant(Array.isArray(sourceList), 'must pass array of sources');
  invariant(sourceList.every(source => sources.includes(source)), `sourceList contains source not in the list of supported sources: ${sourceList} // ${sources}`);

  return Promise.all(searchSources.map(source => search(term, options, source)))
    .then(results => Object.assign({}, ...results));
};

export const blast = () => {
  invariant(false, 'not implemented');
};
