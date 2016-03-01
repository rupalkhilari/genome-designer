import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType } from '../../constants/DragTypes';
import debounce from 'lodash.debounce';

import defaultBlocks from '../../inventory/andrea';
import exampleSearch from '../../inventory/egf/exampleResults';
import parseResults from '../../inventory/egf/parseResults';
import { registry, getSources } from '../../inventory/registry';
import * as searchApi from '../../middleware/search';

import InventorySources from './InventorySources';
import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  state = {
    searching: false,
    sourceList: getSources(),
    searchResults: parseResults(exampleSearch), //todo - remove (testing)
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
          /*dont do anything for now ... */
        })
        .then(() => this.setState({ searching: false }));
    };

    this.debouncedSearch = debounce(searchingFunction, 200);
  }

  onSourceToggle = (source) => {
    const { sourceList } = this.state;
    const newSourceList = sourceList.length ? sourceList.slice() : getSources();

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

  render() {
    const { searchTerm } = this.props;
    const { searching, sourceList, searchResults } = this.state;

    //want to filter down results while next query running
    const searchRegex = new RegExp(searchTerm, 'gi');
    const listingItems = searchResults.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

    //todo - filter source

    return (
      <div className={'InventoryGroup-content InventoryGroupSearch'}>
        <InventorySearch searchTerm={searchTerm}
                         onSearchChange={this.handleSearchChange}/>
        <InventorySources registry={registry}
                          sourceList={sourceList}
                          onSourceToggle={this.onSourceToggle}/>
        <InventoryList inventoryType={blockDragType}
                       items={listingItems}/>
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
