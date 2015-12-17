import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventoryToggleVisibility } from '../actions/inventory';
import andreaBlocks from '../inventory/andrea';
import inventorySbol from '../inventory/sbol';

import InventoryGroups from '../components/Inventory/InventoryGroups';

import '../styles/Inventory.css';
import '../styles/SidePanel.css';

// find a new home for this when dynamic, consider Plug-in friendly
// should also better enumerate types...
const inventoryData = [
  {
    name: 'EGF',
    type: 'block',
    items: andreaBlocks,
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

  toggle = () => {
    this.props.inventoryToggleVisibility.call(null);
    window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  }

  render() {
    const { isVisible, inventoryToggleVisibility } = this.props;

    return (
      <div className={'SidePanel Inventory' + (isVisible ? ' visible' : '')}>
        <div className="SidePanel-heading">
          <span className="SidePanel-heading-trigger Inventory-trigger"
                onClick={this.toggle} />
          <div className="SidePanel-heading-content">
            <span className="SidePanel-title">Inventory</span>
            <a className="SidePanel-close"
               ref="close"
               onClick={this.toggle}>&times;</a>
          </div>
        </div>

        <div className="SidePanel-content">
          <InventoryGroups groups={inventoryData}/>
        </div>
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
