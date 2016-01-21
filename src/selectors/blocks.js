/***************************************
 * Parent accessing / store knowledge-requiring
 ***************************************/

//todo - work for project.components
const getParentFromStore = (blockId, store, def) => {
  const id = Object.keys(store.blocks).find(id => {
    return store.blocks[id].components.includes(blockId);
  });
  return !!id ? store.blocks[id] : def;
};

//Non-mutating
export const blockGetParents = (blockId) => {
  return (dispatch, getState) => {
    const parents = [];
    const store = getState();
    let parent = getParentFromStore(blockId, store);
    while (parent) {
      parents.push(parent.id);
      parent = getParentFromStore(parent.id, store);
    }
    return parents;
  };
};

//Non-mutating
export const blockGetSiblings = (blockId) => {
  return (dispatch, getState) => {
    const parent = getParentFromStore(blockId, getState(), {});
    return parent.components;
  };
};

//Non-mutating
export const blockGetIndex = (blockId) => {
  return (dispatch, getState) => {
    const parent = getParentFromStore(blockId, getState(), {});
    return Array.isArray(parent.components) ? parent.components.indexOf(blockId) : -1;
  };
};
