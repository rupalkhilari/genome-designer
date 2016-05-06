import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import Block from '../../models/Block';
import { block as blockDragType } from '../../constants/DragTypes';

import InventoryItem from './InventoryItem';

//note - if we know we have a (non-construct) block as inventory item, then we dont need to do any transactions / deep cloning - inventory drag + drop is straight forward. Use InventoryConstruct if you have a block that may be a construct (with components) OR a block.

export default class InventoryItemBlock extends Component {
  static propTypes = {
    block: (props, propName) => {
      if (!(Block.validate(props[propName]) && props[propName] instanceof Block)) {
        return new Error('must pass a real block (Block model) to InventoryItemBlock');
      }
    },
  };

  componentDidMount() {
    invariant(!this.props.block.components.length, 'Do not use InventoryItemBlock on blocks with components');
  }

  render() {
    const { block, ...rest } = this.props;

    return (
      <div className="InventoryItemBlock">
        <InventoryItem {...rest}
          inventoryType={blockDragType}
          defaultName={block.getName()}
          item={block}/>
      </div>
    );
  }
}
