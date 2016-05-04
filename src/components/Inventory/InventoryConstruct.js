import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import InventoryListGroup from './InventoryListGroup';
import InventoryBlock from './InventoryBlock';

import { block as blockDragType } from '../../constants/DragTypes';

//note - assumes that blocks are in the store

//todo - constructs should be draggable - need to handle complicated cloning etc.
//todo - abstract draggable component from inventory Item and use here

export class InventoryConstruct extends Component {
  static propTypes = {
    blockId: PropTypes.string.isRequired,
    block: PropTypes.object.isRequired,
  };

  render() {
    const { blockId, block, ...rest } = this.props;
    const isConstruct = block.components.length > 0;

    const innerContent = isConstruct ?
      //explicitly call connected component to handle recursion
      (
        <InventoryListGroup title={block.getName()}
                            isSelectable>
          {block.components.map(compId => (
            <InventoryConstructConnected {...rest}
              key={compId}
              blockId={compId}/>
          ))}
        </InventoryListGroup>
      )
      :
      <InventoryBlock block={block} {...rest} />;

    return (
      <div className="InventoryConstruct">
        {innerContent}
      </div>
    );
  }
}

const InventoryConstructConnected = connect((state, props) => {
  const { blockId } = props;
  const block = state.blocks[blockId];

  return {
    block,
  };
})(InventoryConstruct);

export default InventoryConstructConnected;
