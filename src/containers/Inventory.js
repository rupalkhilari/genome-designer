import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inventoryToggleVisibility, inventorySelectTab } from '../actions/ui';
import inventoryAndrea from '../inventory/andrea/partsOld';
import InventoryGroup from '../components/Inventory/InventoryGroup';

import '../styles/Inventory.css';
import '../styles/SidePanel.css';

export class Inventory extends Component {
  static propTypes = {
    projectId: PropTypes.string,
    isVisible: PropTypes.bool.isRequired,
    currentTab: PropTypes.string,
    inventoryToggleVisibility: PropTypes.func.isRequired,
    inventorySelectTab: PropTypes.func.isRequired,
  };

  toggle = (forceVal) => {
    this.props.inventoryToggleVisibility(forceVal);
  };

  render() {
    //may be better way to pass in projectId
    const { isVisible, projectId, currentTab, inventorySelectTab } = this.props;

    return (
      <div className={'SidePanel Inventory' + (isVisible ? ' visible' : '')}>
        <div className="SidePanel-heading">
          <span className="SidePanel-heading-trigger Inventory-trigger"
                onClick={() => this.toggle()}/>
          <div className="SidePanel-heading-content">
            <span className="SidePanel-heading-title">Inventory</span>
            <a className="SidePanel-heading-close"
               ref="close"
               onClick={() => this.toggle(false)}/>
          </div>
        </div>

        <div className="SidePanel-content">
          <div className="Inventory-groups">
            <InventoryGroup title="Search"
                            type="search"
                            isActive={currentTab === 'search' || !currentTab}
                            setActive={() => inventorySelectTab('search')}/>
            <InventoryGroup title="EGF Parts"
                            type="block"
                            isActive={currentTab === 'egf'}
                            setActive={() => inventorySelectTab('egf')}
                            items={inventoryAndrea}/>
            <InventoryGroup title="My Projects"
                            type="projects"
                            currentProject={projectId}
                            isActive={currentTab === 'projects'}
                            setActive={() => inventorySelectTab('projects')}/>
            <InventoryGroup title="Sketch Library"
                            type="role"
                            isActive={currentTab === 'role'}
                            setActive={() => inventorySelectTab('role')} />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  const { isVisible, currentTab } = state.ui.inventory;

  return {
    isVisible,
    currentTab,
  };
}

export default connect(mapStateToProps, {
  inventoryToggleVisibility,
  inventorySelectTab,
})(Inventory);
