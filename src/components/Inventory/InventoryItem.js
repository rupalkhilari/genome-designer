import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { inventoryItem as inventoryItemDragType } from '../../constants/DragTypes';

import '../../styles/InventoryItem.css';

const inventorySource = {
  beginDrag(props) {
    return {
      item: props.item,
      type: props.inventoryType,
    };
  },
};

@DragSource(inventoryItemDragType, inventorySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class InventoryItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    inventoryType: PropTypes.string.isRequired,
    item: PropTypes.shape({
      metadata: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  }

  render() {
    const { item, isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div>
        <a className={'InventoryItem' + (isDragging ? ' isDragging' : '')}>
          {item.metadata.name}
        </a>
      </div>
    );
  }
}
