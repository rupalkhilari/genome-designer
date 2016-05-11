export const inventoryIsVisible = () => {
  return (dispatch, getState) => {
    return getState().inventory.isVisible;
  };
};

export const inspectorIsVisible = () => {
  return (dispatch, getState) => {
    return getState().inspector.isVisible;
  };
};

export const detailViewIsVisible = () => {
  return (dispatch, getState) => {
    return getState().detailView.isVisible;
  };
};
