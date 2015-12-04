import React, { Component, PropTypes } from 'react';

import InventoryTabs from './InventoryTabs';
import InventoryGroupBlocks from './InventoryGroupBlocks';
import InventoryGroupSbol from './InventoryGroupSbol';

const inventoryGroupTypeToComponent = (type, props) => {
  if (type === 'sbol') {
    return (<InventoryGroupSbol {...props} />);
  } else if (type === 'block') {
    return (<InventoryGroupBlocks {...props} />);
  } else {
    throw new Error(`Type ${type} is not registered in InventoryGroups`);
  }
};

export default class InventoryGroups extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })).isRequired,
  }

  state = {
    currentTabIndex: 0,
  }

  handleSelectTab = (index) => {
    this.setState({
      currentTabIndex: index,
    });
  }

  //todo - handle scrolling CSS

  render() {
    const { currentTabIndex } = this.state;
    const { groups } = this.props;
    const currentGroup = groups[currentTabIndex];
    const currentGroupComponent = inventoryGroupTypeToComponent(currentGroup.type, {
      key: currentGroup.name,
      items: currentGroup.items,
    });

    return (
      <div className="InventoryGroups">
        <InventoryTabs tabs={groups}
                       activeTabIndex={currentTabIndex}
                       onTabSelect={this.handleSelectTab} />
        {currentGroupComponent}
      </div>
    );
  }
}
