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
 * @return {Promise} array, where [0] is ancestry of child, [1] is descendants of parent, and each takes the form:
 * {
 *   id: ID of the relevant instance
 *   ancestors: all ancestors as an array, where index=0 is the direct parent
 *   descendants: direct descendants of the instance
 * }
 */
export const record = (childId, parentId) => {
  const ancestryKey = makeHistoryKey(childId);
  const descendantsKey = makeHistoryKey(parentId);

  return getSafe(descendantsKey, {id: parentId, ancestors: [], descendants: []})
    .then(history => {
      const { ancestors, descendants } = history;

      //Ancestors consists of the entire history of the instance, i.e. all parents up to the root
      const newAncestors = {
        id: childId,
        ancestors: [parentId].concat(ancestors),
        descendants: []
      };

      //descendants only goes one level deep
      const newDescendants = Object.assign(history, {
        descendants: descendants.concat(childId)
      });

      return Promise.all([
        set(ancestryKey, newAncestors),
        set(descendantsKey, newDescendants),
      ]);
    });
  
};

/**
 * @description Get all ancestors
 * @param instanceId {uuid}
 * @returns {Promise<Array>} Returns array of ancestors, direct parent first, or empty array if root
 */
export const getAncestors = (instanceId) => {
  const ancestryKey = makeHistoryKey(instanceId);
  return getSafe(ancestryKey, {ancestors: []})
    .then(history => {
      return history.ancestors || [];
    });
};

/**
 * @description Get immediate descendants
 * @param instanceId {uuid}
 * @returns {Promise<Array>} Array of direct children
 */
export const getDescendants = (instanceId) => {
  const descendencyKey = makeHistoryKey(instanceId);
  return getSafe(descendencyKey, {descendants: []})
  .then(history => {
    return history.descendants || [];
  });
};


/**
 * @description Recursively retrieves descendants for an instance
 * @param instanceId
 * @param depth {number}
 * @returns {Promise<Object>}
 */
export const getDescendantsRecursively = (instanceId, depth) => {
  return getRecursively(
    [makeHistoryKey(instanceId)],
    (instance) => instance.descendants.map(makeHistoryKey),
    depth
  );
};

/**
 * @description Get the ancestor root i.e. oldest ancestor
 * @param instanceId
 * @returns {Promise<UUID>} ID of the root ancestor
 */
export const getRoot = (instanceId) => {
  return getAncestors(instanceId)
    .then(result => (result.length) ? result.pop() : null);
};

/**
 * @description Goes to instance's ancestry root, then retrieves whole tree of descendants
 * @param instanceId
 * @param depthFromRoot {number}
 * @returns {Promise<Object>}
 */
export const getTree = (instanceId, depthFromRoot) => {
  //not tested
  return getRoot(instanceId)
    .then(instanceId => {
      return getDescendantsRecursively(instanceId, depthFromRoot);
    });
};

export const getLeaves = (instance) => {
  //todo
};