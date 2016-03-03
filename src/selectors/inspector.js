export const inspectorIsVisible = () => {
  return (dispatch, getState) => {
    return getState().inspector.isVisible;
  };
};

export const inspectorGetCurrentSelection = () => {
  return (dispatch, getState) => {
    const state = getState();
    const { forceBlocks } = state.inspector;
    const { currentBlocks } = state.ui;
    return (typeof forceBlock !== 'undefined') ? [forceBlock] : currentBlocks;
  };
};
