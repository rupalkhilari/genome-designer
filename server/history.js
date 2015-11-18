import uuid from 'uuid'; //todo - unify with client side
import getRecursively from './components';
import { get, set } from './database';

/**
 * @description Creates an new instance which is a descendent of the input instance. Does not interact with database
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
 */
export const record = (child, parent) => {
  //todo - what is needed here? should only record one way?
};

export const getParents = (instance) => {
  return getRecursively([instance.parent], undefined, 'parent');
};

export const getChildren = (instance) => {
  //todo - if we only store parent, this is more of a DB specific query
};
