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
 * @param {uuid} child
 * @param {uuid} parent
 * @return {Promise} array, where [0] is ancestry, [1] is descendence
 */
export const record = (child, parent) => {
  //todo - in the future, we should not record both parent and child relationships, but use an index on parent, or create a hash in redis that handles the children part. There should not be a need to have a double-linked list
  const ancestryKey = makeAncestoryKey(child.id);
  const descendencyKey = makeDescendentKey(parent.id);

  const setAncestry = getSafe(ancestryKey, null)
    .then(history => {
      const nextVal = (history === null) ? [parent.id] : history.concat(parent.id);
      return set(ancestryKey, nextVal);
    });

  const setDescendence = getSafe(descendencyKey, null)
    .then(children => {
      const nextVal = (children === null) ? [child.id] : children.concat(child.id);
      return set(descendencyKey, nextVal);
    });

  return Promise.all([
    setAncestry,
    setDescendence,
  ]);
};

export const getImmediateAncestors = (instance) => {
  const ancestryKey = makeAncestoryKey(instance.id);
  return getSafe(ancestryKey, null);
};

export const getImmediateChildren = (instance) => {
  const descendencyKey = makeDescendentKey(instance.id);
  return getSafe(descendencyKey, []);
};

export const getAncestors = (instance) => {
  //todo - recurse
  return getImmediateAncestors(instance);
};

export const getTree = (instance) => {
  //todo - recurse
  return getImmediateChildren(instance);
};

export const getRoot = (instance) => {
  //todo - recurse
  /*
  return getAncestors(instance).then(result => {
    (result.leaves.length > 1) && console.error('more than one root', result.leaves); //eslint-disable-line
    return result.leaves[0];
  });
   */
};

export const getLeaves = (instance) => {
  //todo
};
