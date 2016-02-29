import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType } from '../../constants/DragTypes';
import debounce from 'lodash.debounce';

import defaultBlocks from '../../inventory/andrea';
import exampleSearch from '../../inventory/egf/egf_example';
import parseResults from '../../inventory/egf/egf_parseResults';
import * as searchApi from '../../middleware/search';

import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  state = {
    searchResults: parseResults(exampleSearch),
  };

  componentDidMount() {
    const searchingFunction = (term) => searchApi.search(term)
      .then(searchResults => this.setState({ searchResults }));
    this.debouncedSearch = debounce(searchingFunction, 200);
  }

  handleSearchChange = (value) => {
    this.props.inventorySearch(value);
    this.debouncedSearch(value);
  };

  render() {
    const { searchTerm } = this.props;
    const { searchResults } = this.state;

    //if we want to filter down results while next query running
    //const searchRegex = new RegExp(searchTerm, 'gi');
    //const listingItems = items.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

    const listingItems = searchResults;

    return (
      <div className="InventoryGroup-content InventoryGroupSearch">
        <InventorySearch searchTerm={searchTerm}
                         onSearchChange={this.handleSearchChange}/>
        <InventoryList inventoryType={blockDragType}
                       items={listingItems}/>
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
