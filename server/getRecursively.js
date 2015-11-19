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
 @return {Object} result dictionary with IDs which are all ids, and a field `leaves` with the leaf nodes of the tree, and field `tree` which is an object noting the hierarchy
 **/
//todo - verify this works
//todo - support depth
//todo - save tree structure
function getRecursively(ids = [],
                        field = 'components',
                        result = {tree: {}, leaves: []}) {
  if (!ids.length) {
    return Promise.resolve(result);
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

  //todo - store tree structure once we've retrieved things
  return promise.then(() => result);
}

export const getParents = (instance) => {
  return getRecursively([instance.parent], 'parent');
};

export const getComponents = (instance) => {
  return getRecursively(instance.components, 'components');
};

export default getRecursively;
