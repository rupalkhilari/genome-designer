import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventoryToggleVisibility } from '../actions/inventory';
import inventoryDummyBlocks from '../inventory/dummyBlocks';
import inventorySbol from '../inventory/sbol';

import InventorySearch from '../components/Inventory/InventorySearch';
import InventoryGroups from '../components/Inventory/InventoryGroups';

import '../styles/Inventory.css';

// todo - find a new home for this? Plug-in friendly
// should also better enumerate types...
const inventoryData = [
  {
    key: 'dummy',
    type: 'block',
    items: inventoryDummyBlocks,
  },
  {
    key: 'sbol',
    type: 'sbol',
    items: inventorySbol,
  },
];

export class Inventory extends Component {
  static propTypes = {
    isVisible: PropTypes.bool.isRequired,
    inventoryToggleVisibility: PropTypes.func.isRequired,
  }

  render() {
    const { isVisible, inventoryToggleVisibility } = this.props;

    return (
      <div className={'Inventory' + (isVisible ? ' visible' : '')}>

        <div className="Inventory-heading">
          <span className="Inventory-title">Inventory</span>
          <a className="Inventory-close"
             ref="close"
             onClick={inventoryToggleVisibility.bind(null, false)}>&times;</a>
        </div>

        <InventoryGroups groups={inventoryData} />
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible } = state.inventory;

  return {
    isVisible,
  };
}

export default connect(mapStateToProps, {
  inventoryToggleVisibility,
})(Inventory);
