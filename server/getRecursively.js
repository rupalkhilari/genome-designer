import { getSafe } from './database';

function getInstances(ids = []) {
  return Promise.all(ids.map((id) => {
    return getSafe(id, null);
  }));
}

/**
 Fetch multiple entries from the database.
 If the entry is a Block, all subcomponents will be
 fetched recursively into the results object
 @param {Array} ids
 @param {string|function} field (default = `components`) Field of retreived instance to use, or function returning the ID to use
 @param {number} recursionDepth Depth of recursion
 @param {function} idAccessor function to return the ID, default: (inst) => inst.id
 @param {Object} result Dictionary, used for recursing. expects field `leaves`.
 @return {Promise<Object>} result dictionary with IDs which are all ids, and a field `leaves` with the leaf nodes of the tree, and field `tree` which is an object noting the hierarchy
 **/
 //todo - save tree structure
function getRecursively(ids = [],
                        field = 'components',
                        recursionDepth = 5,
                        result = { leaves: [] }) {
  if (!Array.isArray(ids)) {
    return Promise.reject(new Error(`must pass array to getRecursively, got ${ids}`));
  }

  if (!ids.length) {
    return Promise.resolve(result);
  }

  return getInstances(ids)
    .then(instances => {
      return Promise.all(instances.map(inst => {
        //if safeGet did not find anything, we're done

        if (inst === null) {
          return Promise.resolve();
        }

        const instanceId = inst.id;
        result[instanceId] = inst;

        if (recursionDepth === 0) {
          return Promise.resolve();
        }

        const nextAccessor = (typeof field === 'function') ?
          field :
          (instance) => instance[field];
        const next = nextAccessor(inst);

        //if next list to recurse is empty, mark as leaf
        if (!next || !next.length) {
          result.leaves.push(instanceId);
          return Promise.resolve();
        }

        return getRecursively(next, field, (recursionDepth - 1), result);
      }));
    })
    .then(() => result);
}

export const getComponents = (instanceID) => {
  return getSafe(instanceID).then( instance => {
    return getRecursively(instance.components, 'components');
  });
};

export default getRecursively;
