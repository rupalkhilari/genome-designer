export const focusGetProject = () => {
  return (dispatch, getState) => {
    const { forceProject, project } = getState().focus;
    return forceProject ? forceProject : project;
  };
};

export const focusGetConstruct = () => {
  return (dispatch, getState) => {
    return getState().focus.construct;
  };
};

export const focusGetBlocks = () => {
  return (dispatch, getState) => {
    const { forceBlocks, blocks } = getState().focus;
    return forceBlocks ? forceBlocks : blocks;
  };
};

export const focusGetBlocksOrdered = () => {
  return (dispatch, getState) => {
    //todo
    console.error('todo');
  };
};
