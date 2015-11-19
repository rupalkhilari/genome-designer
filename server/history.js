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

export const getAncestors = (id) => {
  const ancestryKey = makeAncestoryKey(id);
  return getSafe(ancestryKey, null);
};

export const getImmediateChildren = (id) => {
  const descendencyKey = makeDescendentKey(id);
  return getSafe(descendencyKey, []);
};

export const getTree = (id) => {  
  var output = {};
      
  //promise object for fetching the tree from an ID
  function createPromiseObj(id) {
    return getTree(id).then(
          res => {
            output[id] = res;
            console.log("p: " + JSON.stringify(output));
            return Promise.resolve(null);
          });
  };


  //for each child...
  return getImmediateChildren(id).
      then(result => {

        console.log(result);
        
        //create promise objects from each child ID
        var promiseArr = [], 
            promiseObj;

        for (var i=0; i < result.length; ++i) {
          promiseObj = createPromiseObj(result[i]);
          promiseArr.push(promiseObj);
        };

        //when all sub-trees have been fetched...
        Promise.all(promiseArr).
          then(res => {

            //return output
            console.log("res: " + JSON.stringify(output));
            return output;
          });
      });
};

export const getRoot = (instance) => { 

  //getAncestors will return all parents in order 
  return getAncestors(instance).then(result => {
    return result[0];
  });
};

export const getLeaves = (instance) => {
  //todo
};
