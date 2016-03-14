import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType } from '../../constants/DragTypes';
import { debounce } from 'lodash';

import defaultBlocks from '../../inventory/andrea';
import { registry, getSources } from '../../inventory/registry';
import * as searchApi from '../../middleware/search';

import InventorySources from './InventorySources';
import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';
import InventoryListGroup from './InventoryListGroup';

//todo - better solution for default results
const defaultSearchResults = {
  igem: [],
  egf: defaultBlocks,
};

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  state = {
    searching: false,
    sourceList: getSources(),
    searchResults: defaultSearchResults,
  };

  componentDidMount() {
    const searchingFunction = (term, options = null) => {
      this.setState({ searching: true });
      const sourceList = this.state.sourceList;

      searchApi.search(term, options, sourceList)
        .then(searchResults => this.setState({
          searchResults,
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
    const { searching, sourceList, searchResults } = this.state;

    //want to filter down results while next query running
    const searchRegex = new RegExp(searchTerm, 'gi');
    //todo - filter by source

    return (
      <div className={'InventoryGroup-content InventoryGroupSearch'}>
        <InventorySearch searchTerm={searchTerm}
                         onSearchChange={this.handleSearchChange}/>
        <InventorySources registry={registry}
                          sourceList={sourceList}
                          onSourceToggle={this.onSourceToggle}/>

        <div className="InventoryGroupSearch-groups">
          {Object.keys(searchResults).map(key => {
            const group = searchResults[key];
            const listingItems = group.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

            return (
              <InventoryListGroup title={`${key} (${listingItems.length})`}
                                  key={key}>
                <InventoryList inventoryType={blockDragType}
                               onDrop={(...args) => this.handleOnDrop(key, ...args)}
                               items={listingItems}/>
              </InventoryListGroup>
            );
          })}
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
