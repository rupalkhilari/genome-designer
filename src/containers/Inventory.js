import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventoryToggleVisibility } from '../actions/inventory';
import inventoryDummyBlocks from '../inventory/dummyBlocks';
import inventorySbol from '../inventory/sbol';

import InventoryGroups from '../components/Inventory/InventoryGroups';

import '../styles/Inventory.css';

// find a new home for this when dynamic, consider Plug-in friendly
// should also better enumerate types...
const inventoryData = [
  {
    name: 'dummy',
    type: 'block',
    items: inventoryDummyBlocks,
  },
  {
    name: 'sbol',
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
