import { get } from './database';

function getInstances(ids = []) {
  return Promise.all(ids.map(get));
}

/**
 Fetch multiple entries from the database.
 If the entry is a Block, all subcomponents will be
 fetched recursively into the results object
 @param {Array} ids
 @param {Object} result
 @param {string} field (default = `components`)
 **/
//todo - verify this works, assert ids is array
export default function getRecursively(ids = [],
                                       result = {},
                                       field = 'components') {
  const promise = getInstances(ids).then(instances => {
    return instances.map(inst => {
      result[inst.id] = inst;
      return getRecursively(inst[field], result, field);
    });
  });

  return promise.then(() => result);
}
