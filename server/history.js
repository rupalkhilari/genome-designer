import uuid from 'node-uuid';
import getRecursively from './getRecursively';
import { get, getSafe, set } from './database';

export const makeHistoryKey = (id) => id + '-history';

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
  const ancestryKey = makeHistoryKey(childId);
  const descendantsKey = makeHistoryKey(parentId);

  const setAncestry = getSafe(ancestryKey, {id: ancestryKey, ancestors: [], descendants: []})
    .then(history => {
      const { ancestors } = history;
      const nextVal = Object.assign(history, {ancestors: ancestors.concat(parentId)});
      return set(ancestryKey, nextVal);
    });

  const setDescendants = getSafe(descendantsKey, {id: descendantsKey, ancestors: [], descendants: []})
    .then(history => {
      const { descendants } = history;
      const nextVal = Object.assign(history, {descendants: descendants.concat(childId)});
      return set(descendantsKey, nextVal);
    });

  return Promise.all([
    setAncestry,
    setDescendants,
  ]);
};

export const getImmediateAncestor = (instanceId) => {
  const ancestryKey = makeHistoryKey(instanceId);
  return getSafe(ancestryKey, {})
    .then(history => {
      return history.ancestors || null;
    });
};

export const getImmediateDescendants = (instanceId) => {
  const descendencyKey = makeHistoryKey(instanceId);
  return getSafe(descendencyKey, {})
  .then(history => {
    return history.descendants || [];
  });
};

//todo - need better support in getRecursively (or write new function) for tree, leaves, and so not flat
//todo - getRecursively doesn't exactly work here, since the entry may have multiple values. This is not the same as accessing the field components

export const getAncestors = (instanceId, depth) => {
  return getRecursively(
    [makeHistoryKey(instanceId)],
    (instance) => instance.ancestors.map(makeHistoryKey),
    depth
  );
};

export const getDescendants = (instanceId, depth) => {
  return getRecursively(
    [makeHistoryKey(instanceId)],
    (instance) => instance.descendants.map(makeHistoryKey),
    depth
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
