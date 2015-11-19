import uuid from 'uuid'; //todo - unify with client side
import getRecursively from './getRecursively';
import { get, getSafe, set } from './database';

const makeAncestoryKey = (id) => id + '-history';
const makeDescendentKey = (id) => id + '-children';

/**
 * @description Record parent-child info in the database
 * @param {uuid} child
 * @param {uuid} parent
 */
export const record = (child, parent) => {
  //todo - in the future, we should not record both parent and child relationships, but use an index on parent, or create a hash in redis that handles the children part. There should not be a need to have a double-linked list
  const ancestryKey = makeAncestoryKey(child.id);
  const descendencyKey = makeDescendentKey(parent.id);

  const setAncestry = get(ancestryKey).then(history => {
    const nextVal = (history === undefined) ? [parent.id] : history.concat(parent.id);
    return set(ancestryKey, nextVal);
  });

  const setDescendence = get(descendencyKey).then(children => {
    const nextVal = (children === undefined) ? [child.id] : children.concat(child.id);
    return set(descendencyKey, nextVal);
  });

  return Promise.all([
    setAncestry,
    setDescendence,
  ]);
};

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

export const getParents = (instance) => {
  return getRecursively([instance.parent], 'parent');
};

export const getRoot = (instance) => {
  //todo
};

//todo - require children field as in Deepak's
//future - these all require redis-specific

export const getImmediateChildren = (instance) => {

};

export const getLeaves = (instance) => {
  //todo
};

export const getTree = (instance) => {
  //todo
};
