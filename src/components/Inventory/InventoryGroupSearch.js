import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventorySearch } from '../../actions/inventory';
import { block as blockDragType} from '../../constants/DragTypes';
import BlockDefinition from '../../schemas/Block';
import * as validators from '../../schemas/fields/validators';

import defaultBlocks from '../../inventory/andrea';

import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';

export class InventoryGroupSearch extends Component {
  static propTypes = {
    searchTerm: PropTypes.string.isRequired,
    inventorySearch: PropTypes.func.isRequired,
  };

  handleSearchChange = (value) => {
    this.props.inventorySearch(value);
  };

  render() {
    const { searchTerm } = this.props;
    //pending search functionality
    const items = defaultBlocks;

    //in the future, we will want smarter searching
    const searchRegex = new RegExp(searchTerm, 'gi');
    const listingItems = items.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

    return (
      <div className="InventoryGroupSearch">
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
