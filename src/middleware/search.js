import invariant from 'invariant';
import { registry, sources } from '../inventory/registry';

const flatten = list => list.reduce(
  (one, two) => one.concat(Array.isArray(two) ? flatten(two) : two), []
);

export const search = (term, sourceList = ['egf']) => {
  invariant(Array.isArray(sourceList), 'must pass array for search source list');
  invariant(sourceList.every(source => sources.includes(source)), `sourceList contains source not in the list of supported sources: ${sourceList} // ${sources}`);

  return Promise.all(
    sourceList.map(source => registry[source].search(term))
  )
    .then(results => flatten(results));
};

export const blast = () => {
  invariant(false, 'not implemented');
};
