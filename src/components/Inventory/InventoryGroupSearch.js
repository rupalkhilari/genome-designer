import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType } from '../../constants/DragTypes';
import { debounce } from 'lodash';

import { registry, getSources } from '../../inventory/registry';
import * as searchApi from '../../middleware/search';

import InventorySources from './InventorySources';
import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';
import InventoryListGroup from './InventoryListGroup';

const defaultSearchResults = {
  igem: [],
  egf: [],
};

const createSourcesVisible = (valueFunction = () => false) => {
  return getSources().reduce((acc, source) => Object.assign(acc, {[source]: valueFunction(source)}), {});
};

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  state = {
    searching: false,
    sourceList: getSources(),
    sourcesVisible: createSourcesVisible(),
    searchResults: defaultSearchResults,
  };

  componentDidMount() {
    const searchingFunction = (term, options = null) => {
      this.setState({ searching: true });
      const sourceList = this.state.sourceList;

      searchApi.search(term, options, sourceList)
        .then(searchResults => this.setState({
          searchResults,
          sourcesVisible: createSourcesVisible((source) => !!searchResults[source].length),
        }))
        .catch(err => {
          console.log('couldnt fetch results!', err);
          this.setState({
            searchResults: defaultSearchResults,
          });
        })
        .then(() => this.setState({ searching: false }));
    };

    this.debouncedSearch = debounce(searchingFunction, 200);
  }

  onListGroupToggle = (source) => {
    console.log(source, this.state.sourcesVisible);
    this.setState({
      sourcesVisible: Object.assign(this.state.sourcesVisible, { [source]: !this.state.sourcesVisible[source] }),
    });
  };

  onSourceToggle = (source) => {
    const { sourceList } = this.state;
    const newSourceList = sourceList.length ? sourceList.slice() : getSources();

    //xor, reset if empty
    const indexOfSource = newSourceList.indexOf(source);
    if (indexOfSource >= 0) {
      newSourceList.splice(indexOfSource, 1);
      if (newSourceList.length === 0) {
        newSourceList.push(...getSources());
      }
    } else {
      newSourceList.push(source);
    }

    this.setState({ sourceList: newSourceList });
  };

  handleSearchChange = (value) => {
    this.props.inventorySearch(value);
    this.debouncedSearch(value);
  };

  handleOnDrop = (registryKey, item, target, position) => {
    const { source, id } = item.source;
    if (source && id) {
      return registry[source].get(id)
        .then(result => {
          return result;
        });
    }
  };

  render() {
    const { searchTerm } = this.props;
    const { searching, sourceList, searchResults, sourcesVisible } = this.state;

    //want to filter down results while next query running
    const searchRegex = new RegExp(searchTerm, 'gi');

    //todo - account for filtering...
    const noSearchResults = Object.keys(searchResults).reduce((acc, key) => acc + searchResults[key].length, 0) === 0;

    const groupsContent = noSearchResults ?
      null :
      sourceList.map(key => {
        if (!searchResults[key]) {
          return null;
        }

        const name = registry[key].name;
        const group = searchResults[key];
        const listingItems = group.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

        return (
          <InventoryListGroup title={`${name} (${listingItems.length})`}
                              disabled={!listingItems.length}
                              manual
                              isExpanded={sourcesVisible[key]}
                              onToggle={() => this.onListGroupToggle(key)}
                              key={key}>
            <InventoryList inventoryType={blockDragType}
                           onDrop={(...args) => this.handleOnDrop(key, ...args)}
                           items={listingItems}/>
          </InventoryListGroup>
        );
      });

    return (
      <div className={'InventoryGroup-content InventoryGroupSearch'}>
        <InventorySearch searchTerm={searchTerm}
                         onSearchChange={this.handleSearchChange}/>
        <InventorySources registry={registry}
                          sourceList={sourceList}
                          onSourceToggle={this.onSourceToggle}/>

        <div className="InventoryGroupSearch-groups">
          {groupsContent}
        </div>

        {searching && <div className="loader"/>}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { searchTerm } = state.inventory;

  return {
    searchTerm,
  };
}

export default connect(mapStateToProps, {
  inventorySearch,
})(InventoryGroupSearch);
