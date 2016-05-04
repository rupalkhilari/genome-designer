import React, { Component, PropTypes } from 'react';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryItem from './InventoryItem';

//todo - if we know we have a block, then we dont need to do any deep cloning - inventory drag + drop is straight forward

export default class InventoryBlock extends Component {
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
