/***************************************
 * Parent accessing / store knowledge-requiring
 ***************************************/

const _getBlockFromStore = (blockId, store) => {
  return store.blocks[blockId] || null;
};

const _getParentFromStore = (blockId, store, def) => {
  const id = Object.keys(store.blocks).find(id => {
    return _getBlockFromStore(id, store).components.includes(blockId);
  });
  return !!id ? store.blocks[id] : def;
};

export const blockGet = (blockId) => {
  return (dispatch, getState) => {
    return _getBlockFromStore(blockId, getState());
  };
};

export const blockGetParents = (blockId) => {
  return (dispatch, getState) => {
    const parents = [];
    const store = getState();
    let parent = _getParentFromStore(blockId, store);
    while (parent) {
      parents.push(parent.id);
      parent = _getParentFromStore(parent.id, store);
    }
    return parents;
  };
};

export const blockGetChildrenRecursive = (blockId) => {
  return (dispatch, getState) => {
    const store = getState();
    const block = _getBlockFromStore(blockId, store);

    const getChildrenShallow = (block) => block.components.map(id => _getBlockFromStore(id, store));

    const getAllChildren = (root, children = []) => {
      const kids = getChildrenShallow(root);
      if (kids.length) {
        children.push(...kids);
        kids.forEach(kid => getAllChildren(kid, children));
      }
      return children;
    };

    return getAllChildren(block);
  };
};

export const blockGetSiblings = (blockId) => {
  return (dispatch, getState) => {
    const parent = _getParentFromStore(blockId, getState(), {});
    return parent.components;
  };
};

export const blockGetIndex = (blockId) => {
  return (dispatch, getState) => {
    const parent = _getParentFromStore(blockId, getState(), {});
    return Array.isArray(parent.components) ? parent.components.indexOf(blockId) : -1;
  };
};
