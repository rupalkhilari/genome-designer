import { getSafe } from './database';

function getInstances(ids = []) {
  return Promise.all(ids.map(getSafe));
}

/**
 Fetch multiple entries from the database.
 If the entry is a Block, all subcomponents will be
 fetched recursively into the results object
 @param {Array} ids
 @param {Object} result Dictionary, used for recursing. expects field `leaves`.
 @param {string} field (default = `components`)
 @return {Object} result dictionary with IDs which are all ids, and a field `leaves` with the leaf nodes of the tree
 **/
//todo - store tree structure
//todo - verify this works, assert ids is array
function getRecursively(ids = [],
                        field = 'components',
                        result = {leaves: []}) {
  if (!ids.length) {
    return Promise.resolve();
  }

  const promise = getInstances(ids).then(instances => {
    return instances.map(inst => {
      result[inst.id] = inst;
      const next = inst[field];

      //if next list to recurse is empty, mark as leaf
      if (!next || !next.length) {
        result.leaves.push(inst.id);
        return Promise.resolve();
      }

      return getRecursively(next, field, result);
    });
  });

  return promise.then(() => result);
}

export const getComponents = (instance) => {
  return getRecursively(instance.components, 'components');
};

export default getRecursively;
