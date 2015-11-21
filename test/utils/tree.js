import uuid from 'uuid';
import range from '../../src/utils/array/range';

const createNode = (childField = 'components',
                    parent = {}) => {
  const obj = {
    id: uuid.v4(),
    [childField]: [],
  };
  if (parent.id) {
    Object.assign(obj, {parent: parent.id});
  }
  return obj;
};

const generateTree = (depth = 5,
                      numberChildren = 3,
                      field = 'components',
                      parent = createNode(field)) => {

  //will only happen if directly call with depth 0
  if (depth === 0) {
    return parent;
  }

  const childDepth = depth - 1;
  const nodes = range(numberChildren).map(() => {
    if (depth <= 1) {
      return Object.assign(createNode(field, parent), {
        depth: childDepth,
      });
    }

    const node = createNode(field, parent);
    //don't assign here or create circular references
    generateTree(childDepth, numberChildren, field, node);
    return node;
  });

  Object.assign(parent, {
    depth,
    [field]: nodes,
  });

  return parent;
};

/**
 * Flatten a tree
 @param {Object} node
 @param {string|function} field (default = `components`) Field containing child instances, or function returning them
 @param {string} idField Field to use for ID
 @param {Object} result Dictionary, used for recursing. expects field `leaves`.
 @return {Object} result dictionary with IDs which are all ids, and a field `leaves` with the leaf node IDs of the tree
 **/
export const flattenTree = (node = {},
                            field = 'components',
                            idField = 'id',
                            result = {leaves: []}) => {
  result[node[idField]] = node;

  const nextAccessor = (typeof field === 'function') ?
    field :
    (instance) => instance[field];
  const next = nextAccessor(node);

  //if next list to recurse is empty, save as leaf
  if (!next || !next.length) {
    result.leaves.push(node.id);
  } else {
    next.forEach((instance) => {
      flattenTree(instance, field, idField, result);
    });
  }

  return result;
};

export default generateTree;
