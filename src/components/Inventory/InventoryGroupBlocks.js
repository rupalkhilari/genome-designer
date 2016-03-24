import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { block as blockDragType} from '../../constants/DragTypes';
import BlockDefinition from '../../schemas/Block';
import * as validators from '../../schemas/fields/validators';
import { escapeRegExp } from 'lodash';

import InventorySearch from './InventorySearch';
import InventoryList from './InventoryList';

export default class InventoryGroupBlocks extends Component {
  static propTypes = {
    items: ({items}) => validators.arrayOf(item => BlockDefinition.validate(item, true))(items) || null,
  };

  state = {
    searchTerm: '',
  };

  handleSearchChange = (searchTerm) => {
    this.setState({ searchTerm });
  };

  render() {
    const { items } = this.props;
    const { searchTerm } = this.state;

    //in the future, we will want smarter searching
    const searchRegex = new RegExp(escapeRegExp(searchTerm), 'gi');
    const listingItems = items.filter(item => searchRegex.test(item.metadata.name) || searchRegex.test(item.rules.sbol));

    return (
      <div className="InventoryGroup-content InventoryGroupBlocks">
        <InventorySearch searchTerm={searchTerm}
                         placeholder="Filter by name or biological function"
                         onSearchChange={this.handleSearchChange}/>
        <InventoryList inventoryType={blockDragType}
                       items={listingItems}/>
      </div>
    );
  }
}

