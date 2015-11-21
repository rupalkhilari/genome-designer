import uuid from 'uuid'; //todo - unify with client side
import getRecursively from './getRecursively';
import { get, getSafe, set } from './database';

export const makeHistoryKey = (id) => id + '-history';

export const makeAncestorKey = (id) => id + '-history';
export const makeDescendantKey = (id) => id + '-children';

/**
 * @description Creates an new instance which is a descendent of the input instance. Does not interact with database.
 * @param instance
 * @returns {*}
 */
export const createDescendant = (instance) => {
  return Object.assign({}, instance, {
    id: uuid.v4(),
    parent: instance.id,
  });
};

/**
 * @description Record parent-child info in the database
 * @param {uuid} childId
 * @param {uuid} parentId
 * @return {Promise} array, where [0] is ancestry of child, [1] is descendants of parent
 */
export const record = (childId, parentId) => {
  //todo - in the future, we should not record both parent and child relationships, but use an index on parent, or create a hash in redis that handles the children part. There should not be a need to have a double-linked list
  //todo - need to handle ACID assurances
  const ancestryKey = makeAncestorKey(childId);
  const descendentsKey = makeDescendantKey(parentId);

  const setAncestry = getSafe(ancestryKey, null)
    .then(history => {
      const nextVal = Array.isArray(history) ? history.concat(parentId) : [parentId];
      return set(ancestryKey, nextVal);
    });

  const setDescendents = getSafe(descendentsKey, null)
    .then(children => {
      const nextVal = Array.isArray(children) ? children.concat(childId) : [childId];
      return set(descendentsKey, nextVal);
    });

  return Promise.all([
    setAncestry,
    setDescendents,
  ]);
};

export const getImmediateAncestor = (instanceId) => {
  const ancestryKey = makeAncestorKey(instanceId);
  return getSafe(ancestryKey, null);
};

export const getImmediateDescendants = (instanceId) => {
  const descendencyKey = makeDescendantKey(instanceId);
  return getSafe(descendencyKey, []);
};

//todo - need better support in getRecursively (or write new function) for tree, leaves, and so not flat
//todo - getRecursively doesn't exactly work here, since the entry may have multiple values. This is not the same as accessing the field components

export const getAncestors = (instanceId, depth) => {
  return getRecursively(
    [makeAncestorKey(instanceId)],
    (instance) => {
      return Array.isArray(instance) ?
        instance.map(instance => makeAncestorKey(instance)) :
        [];
    },
    depth,
    (inst) => inst
  );
};

export const getDescendants = (instanceId, depth) => {
  return getRecursively(
    [makeDescendantKey(instanceId)],
    (instance) => {
      return Array.isArray(instance) ?
        instance.map(instance => makeDescendantKey(instance)) :
        [];
    },
    depth,
    (inst) => inst
  );
};

export const getRoot = (instanceId) => {
  return getAncestors(instanceId)
    .then(result => {
      (result.leaves.length > 1) && console.error('more than one root', result.leaves); //eslint-disable-line
      return result.leaves[0];
    });
};

//get root, get whole tree
export const getTree = (id) => {
  return getRoot(id)
    .then(instance => {
      return getDescendants(instance.id);
    });
};

export const getLeaves = (instance) => {
  //todo
};
