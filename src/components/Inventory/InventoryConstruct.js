import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { focusForceBlocks } from '../../actions/focus';
import InventoryListGroup from './InventoryListGroup';
import InventoryItemBlock from './InventoryItemBlock';

import { block as blockDragType } from '../../constants/DragTypes';

//note - assumes that blocks are in the store

//todo - constructs should be draggable - need to handle complicated cloning etc.
//todo - abstract draggable component from inventory Item and use here

export class InventoryConstruct extends Component {
  static propTypes = {
    blockId: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    block: PropTypes.object.isRequired,
    focusForceBlocks: PropTypes.func.isRequired,
  };

  render() {
    const { blockId, block, isActive, focusForceBlocks, ...rest } = this.props;
    const isConstruct = block.components.length > 0;

    const innerContent = isConstruct ?
      //explicitly call connected component to handle recursion
      (
        <InventoryListGroup title={block.getName()}
                            isActive={isActive}
                            onSelect={() => focusForceBlocks([block])}
                            isSelectable>
          {block.components.map(compId => (
            <InventoryConstructConnected {...rest}
              key={compId}
              blockId={compId}/>
          ))}
        </InventoryListGroup>
      )
      :
      <InventoryItemBlock block={block} {...rest} />;

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
  const isActive = state.focus.forceBlocks.some(block => block.id === blockId);

  return {
    block,
    isActive,
  };
}, {
  focusForceBlocks,
})(InventoryConstruct);

export default InventoryConstructConnected;
