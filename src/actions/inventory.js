import * as ActionTypes from '../constants/ActionTypes';
import { registry, getSources } from '../inventory/registry';
import * as searchApi from '../middleware/search';
import { debounce } from 'lodash';

const searchSources = getSources('search');

const searchFunction = (searchTerm, options, sourceList) => {
  return searchApi.search(searchTerm, options, sourceList);
};

//todo - re-enable debounced searching here, not in inventory component
const debouncedSearchFunction = debounce(searchFunction, 250);

export const inventorySearch = (inputTerm = '', options = null, skipDebounce = false) => {
  return (dispatch, getState) => {
    const state = getState();
    const { sourceList } = state.inventory;
    const searchTerm = !!inputTerm ? inputTerm : state.inventory.searchTerm;

    dispatch({
      type: ActionTypes.INVENTORY_SEARCH,
      sourceList,
      searchTerm,
    });

    return searchFunction(searchTerm, options, sourceList)
      .then(searchResults => {
        dispatch({
          type: ActionTypes.INVENTORY_SEARCH_RESOLVE,
          searchResults,
          searchTerm,
          sourceList,
        });
        return searchResults;
      })
      .catch(err => {
        dispatch({
          type: ActionTypes.INVENTORY_SEARCH_REJECT,
        });
        return null;
      });
  };
};

export const inventoryShowSourcesToggling = (forceState) => {
  return (dispatch, getState) => {
    const state = getState();
    const { sourcesToggling, sourceList, lastSearch, searchTerm } = state.inventory;

    const nextState = (forceState !== undefined) ? !!forceState : !sourcesToggling;
    dispatch({
      type: ActionTypes.INVENTORY_SOURCES_VISIBILITY,
      nextState,
    });

    //if not toggling any more, check if need to run a new search
    if (!nextState) {
      if (sourceList.some(source => !lastSearch.sourceList.indexOf(source) < 0)) {
        dispatch(inventorySearch(searchTerm, null, true));
      }
    }

    return nextState;
  };
};

export const inventorySetSources = (sourceList = []) => {
  return (dispatch, getState) => {
    if (!(sourceList.length && sourceList.every(source => searchSources.indexOf(source) >= 0))) {
      return getState().inventory.sourceList;
    }

    dispatch({
      type: ActionTypes.INVENTORY_SET_SOURCES,
      sourceList,
    });

    return sourceList;
  };
};

export const inventoryToggleSource = (source) => {
  return (dispatch, getState) => {
    if (searchSources.indexOf(source) < 0) {
      return null;
    }

    const sourceList = getState().inventory.sourceList.slice();

    //xor, reset if empty
    const indexOfSource = sourceList.indexOf(source);
    if (indexOfSource >= 0) {
      sourceList.splice(indexOfSource, 1);
      if (sourceList.length === 0) {
        sourceList.push(...getSources('search'));
      }
    } else {
      sourceList.push(source);
    }

    return dispatch(inventorySetSources(sourceList));
  };
};

//don't check this for source being in source list since currently use this for also handling whether a role is visible (see inventory component, depends on how grouped)
export const inventoryToggleSourceVisible = (source) => {
  return (dispatch, getState) => {
    const { sourcesVisible } = getState().inventory;
    const nextState = Object.assign({}, sourcesVisible, { [source]: !sourcesVisible[source] });

    dispatch({
      type: ActionTypes.INVENTORY_SOURCES_VISIBLE,
      sourcesVisible: nextState,
    });

    return nextState;
  };
};
