import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import SelectionBox from './selectionbox';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../../../actions/blocks';
import { block as blockDragType, inventoryPart as inventoryPartDragType } from '../../../constants/DragTypes';

const constructTarget = {
  drop(props, monitor, component) {
    const type = monitor.getItemType();
    const monitorItem = monitor.getItem();
    const offset = monitor.getClientOffset();
    const target = findDOMNode(component);

    let block = null;
    if (type === blockDragType) {
      block = monitorItem.block;
    } else {
      block = props.blockCreate({metadata: {name: monitorItem.item}});
    }
    props.blockAddComponent(props.construct.id, block.id);
    component.props.onDrop.call(this);
  },
};

@DropTarget([blockDragType, inventoryPartDragType], constructTarget, (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
})
export class UserInterface extends Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,

    //drag-drop
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    lastDroppedItem: PropTypes.object,

    blockCreate: PropTypes.func.isRequired,
    blockAddComponent: PropTypes.func.isRequired,

    construct: PropTypes.object.isRequired,
  }

  render() {
    const { connectDropTarget } = this.props;

    // create selection boxes
    const selectionElements = this.props.selectionInfo.map(info => {
      return <SelectionBox bounds={info.bounds} key={info.node.props.uuid}/>;
    });

    return connectDropTarget(
      <div
        className="userInterface"
        style={this.props.style}
        onMouseDown={this.props.onMouseDown}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}>
        {selectionElements}
      </div>
    );
  }
}

export default connect(() => ({}), {
  blockCreate,
  blockAddComponent,
})(UserInterface);
