import { getSafe } from './database';

function getInstances(ids = []) {
  return Promise.all(ids.map(getSafe));
}

/**
 Fetch multiple entries from the database.
 If the entry is a Block, all subcomponents will be
 fetched recursively into the results object
 @param {Array} ids
 @param {string|function} field (default = `components`) Field of retreived instance to use, or function returning the ID to use
 @param {number} recursionDepth Depth of recursion
 @param {Object} result Dictionary, used for recursing. expects field `leaves`.
 @return {Object} result dictionary with IDs which are all ids, and a field `leaves` with the leaf nodes of the tree, and field `tree` which is an object noting the hierarchy
 **/
//todo - verify this works
//todo - save tree structure
function getRecursively(ids = [],
                        field = 'components',
                        recursionDepth = 5,
                        result = {tree: {}, leaves: []}) {
  if (!ids.length) {
    return Promise.resolve(result);
  }

  return getInstances(ids)
    .then(instances => {
      return Promise.all(instances.map(inst => {
        result[inst.id] = inst;

        if (recursionDepth === 0) {
          return Promise.resolve();
        }

        const nextAccessor = (typeof field === 'function') ?
          field :
          (instance) => instance[field];
        const next = nextAccessor(inst);

        //if next list to recurse is empty, mark as leaf
        if (!next || !next.length) {
          result.leaves.push(inst.id);
          return Promise.resolve();
        }

        return getRecursively(next, field, (recursionDepth - 1), result);
      }));
    })
    .then(() => result);
}

export const getParents = (instance) => {
  return getRecursively([instance.parent], 'parent');
};

export const getComponents = (instance) => {
  return getRecursively(instance.components, 'components');
};

export default getRecursively;
