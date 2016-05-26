import * as ActionTypes from '../constants/ActionTypes';

export const inventorySearch = (searchTerm) => {
  return (dispatch, getState) => {
    dispatch({
      type: ActionTypes.INVENTORY_SEARCH,
      searchTerm,
    });
    return searchTerm;
  };
};

export const inventorySourcesVisibility = forceState => {
  return (dispatch, getState) => {
    const currentState = getState().inventory.sourcesToggling;
    const nextState = (forceState !== undefined) ? !!forceState : !currentState;
    dispatch({
      type: ActionTypes.INVENTORY_SOURCES_VISIBILITY,
      nextState,
    });
    return nextState;
  };
};
