import * as ActionTypes from '../constants/ActionTypes';
import { registry, getSources } from '../inventory/registry';
import { getItem, setItem } from '../middleware/localStorageCache';

const searchSources = getSources('search');
const initialSearchSources = getItem('searchSources') ? getItem('searchSources').split(',') : searchSources;
const defaultSearchResults = searchSources.reduce((acc, source) => Object.assign(acc, { [source]: [] }), {});

const createSourcesVisible = (valueFunction = () => false) => {
  return getSources('search').reduce((acc, source) => Object.assign(acc, { [source]: valueFunction(source) }), {});
};

export const initialState = {
  sourcesToggling: false,
  searchTerm: '',
  searching: false,
  sourceList: initialSearchSources,
  sourcesVisible: createSourcesVisible(() => false),
  searchResults: defaultSearchResults,
  lastSearch: {
    searchTerm: '',
    sourceList: [],
  },
};

export default function inventory(state = initialState, action) {
  switch (action.type) {
  case ActionTypes.INVENTORY_SEARCH : {
    const { searchTerm } = action;
    return Object.assign({}, state, {
      searchTerm,
      searching: true,
    });
  }
  case ActionTypes.INVENTORY_SEARCH_RESOLVE : {
    const { searchTerm, sourceList, searchResults } = action;

    if (searchTerm === state.searchTerm) {
      return Object.assign({}, state, {
        searching: false,
        searchResults,
        //we can assign just based on filter, because search already limited by which sources the user has allowed
        sourcesVisible: createSourcesVisible((source) => searchResults[source] && searchResults[source].length > 0),
        lastSearch: {
          searchTerm,
          sourceList,
        },
      });
    }
    return state;
  }
  case ActionTypes.INVENTORY_SEARCH_REJECT : {
    const { searchTerm } = action;
    if (searchTerm === state.searchTerm) {
      return Object.assign({}, state, {
        searching: false,
        searchResults: defaultSearchResults,
      });
    }
    return state;
  }
  case ActionTypes.INVENTORY_SET_SOURCES : {
    const { sourceList } = action;
    setItem('searchSources', sourceList.join(','));
    return Object.assign({}, state, {
      sourceList,
    });
  }
  case ActionTypes.INVENTORY_SOURCES_VISIBILITY : {
    const { nextState } = action;
    return Object.assign({}, state, { sourcesToggling: nextState });
  }
  case ActionTypes.INVENTORY_SOURCES_VISIBLE : {
    const { sourcesVisible } = action;
    return Object.assign({}, state, { sourcesVisible });
  }
  case ActionTypes.INVENTORY_SET_SEARCH_TERM : {
    const { searchTerm } = action;
    return Object.assign({}, state, {
      searchTerm,
    });
  }

  case ActionTypes.USER_SET_USER :
    return Object.assign({}, initialState);

  default :
    return state;
  }
}
