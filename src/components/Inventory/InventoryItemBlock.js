import React, { Component, PropTypes } from 'react';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryItem from './InventoryItem';

//note - if we know we have a (non-construct) block as inventory item, then we dont need to do any transactions / deep cloning - inventory drag + drop is straight forward

export default class InventoryItemBlock extends Component {
  static propTypes = {
    block: PropTypes.object.isRequired,
  };

  render() {
    const { block, ...rest } = this.props;

    return (
      <div className="InventoryBlock">
        <InventoryItem {...rest}
          inventoryType={blockDragType}
          item={block}/>
      </div>
    );
  }
}
