import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';
import { inventoryPart as inventoryPartDragType } from '../../constants/DragTypes';

import '../../styles/InventoryItem.css';

const inventorySource = {
  beginDrag(props) {
    return {
      item: props.item,
    };
  },
};

@DragSource(inventoryPartDragType, inventorySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class InventoryItem extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    item: PropTypes.string.isRequired,
  }

  render() {
    const { isDragging, connectDragSource } = this.props;

    return connectDragSource(
      <div>
        <a className={'InventoryItem' + (isDragging ? ' isDragging' : '')}>
          {this.props.item}
        </a>
      </div>
    );
  }
}
