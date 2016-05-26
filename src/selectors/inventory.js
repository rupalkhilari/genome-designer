export const inventoryGetSearchTerm = () => {
  return (dispatch, getState) => {
    return getState().inventory.searchTerm;
  };
};

export const inventoryGetSearchResults = () => {
  return (dispatch, getState) => {
    return getState().inventory.searchResults;
  };
};
