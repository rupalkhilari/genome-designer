import React, { Component, PropTypes } from 'react';

import InventoryGroupBlocks from './InventoryGroupBlocks';
import InventoryGroupSbol from './InventoryGroupSbol';

export default class InventoryGroups extends Component {
  static propTypes = {
    groups: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })).isRequired,
  }

  render() {
    return (
      <div className="InventoryGroups">
        {/* <InventoryTabs></InventoryTabs> */}

        {this.props.groups.map(group => {
          switch (group.type) {
          case 'sbol' : {
            return (
              <InventoryGroupSbol items={group.items} />
            );
          }
          case 'block' : {
            return (
              <InventoryGroupBlocks items={group.items} />
            );
          }
          default: {
            throw new Error(`Type ${group.type} is not registered in InventoryGroups`);
          }
          }
        })}
      </div>
    );
  }
}
