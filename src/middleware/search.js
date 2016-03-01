import invariant from 'invariant';
import { registry, getSources } from '../inventory/registry';

const flatten = list => list.reduce(
  (one, two) => one.concat(Array.isArray(two) ? flatten(two) : two), []
);

const zip = (keys, vals) => keys.reduce(
  (acc, key, ind) => Object.assign(acc, { [key]: vals[ind] }), {}
);

//todo - ideally, farm these out separately without a Promise.all
export const search = (term, options, sourceList = []) => {
  const sources = getSources();

  invariant(typeof term === 'string', 'Term must be a string');
  invariant(Array.isArray(sourceList), 'must pass array for search source list');
  invariant(sourceList.every(source => sources.includes(source)), `sourceList contains source not in the list of supported sources: ${sourceList} // ${sources}`);

  if (!term.length) {
    return Promise.resolve({});
  }

  const searchSources = (sourceList.length === 0) ? sources : sourceList;

  return Promise.all(
    searchSources.map(source => registry[source].search(term, options))
    )
    .then(results => zip(searchSources, results));
};

export const blast = () => {
  invariant(false, 'not implemented');
};
