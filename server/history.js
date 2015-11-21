import uuid from 'uuid'; //todo - unify with client side
import getRecursively from './getRecursively';
import { get, getSafe, set } from './database';

const makeAncestoryKey = (id) => id + '-history';
const makeDescendentKey = (id) => id + '-children';

/**
 * @description Creates an new instance which is a descendent of the input instance. Does not interact with database.
 * @param instance
 * @returns {*}
 */
export const createDescendent = (instance) => {
  return Object.assign({}, instance, {
    id: uuid.v4(),
    parent: instance.id,
  });
};

/**
 * @description Record parent-child info in the database
 * @param {uuid} childId
 * @param {uuid} parentId
 * @return {Promise} array, where [0] is ancestry, [1] is descendence
 */
export const record = (childId, parentId) => {
  //todo - in the future, we should not record both parent and child relationships, but use an index on parent, or create a hash in redis that handles the children part. There should not be a need to have a double-linked list
  const ancestryKey = makeAncestoryKey(childId);
  const descendencyKey = makeDescendentKey(parentId);

  const setAncestry = getSafe(ancestryKey, null)
    .then(history => {
      const nextVal = (history === null) ? [parentId] : history.concat(parentId);
      return set(ancestryKey, nextVal);
    });

  const setDescendence = getSafe(descendencyKey, null)
    .then(children => {
      const nextVal = (children === null) ? [childId] : children.concat(childId);
      return set(descendencyKey, nextVal);
    });

  return Promise.all([
    setAncestry,
    setDescendence,
  ]);
};

export const getImmediateAncestor = (instanceId) => {
  const ancestryKey = makeAncestoryKey(instanceId);
  return getSafe(ancestryKey, null);
};

export const getImmediateDescendents = (instanceId) => {
  const descendencyKey = makeDescendentKey(instanceId);
  return getSafe(descendencyKey, []);
};

export const getAncestors = (instanceId, depth) => {
  return getRecursively(
    [makeAncestoryKey(instanceId)],
    (instance) => makeAncestoryKey(instance),
    depth
  );
};

export const getDescendents = (instanceId, depth) => {
  return getRecursively(
    [makeDescendentKey(instanceId)],
    (instance) => makeDescendentKey(instance),
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
      return getDescendents(instance.id);
    });
};

export const getLeaves = (instance) => {
  //todo
};
