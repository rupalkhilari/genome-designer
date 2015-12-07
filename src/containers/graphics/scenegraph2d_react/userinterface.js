import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import SelectionBox from './selectionbox';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../../../actions/blocks';
import { block as blockDragType, sbol as sbolDragType, inventoryItem as inventoryItemDragType } from '../../../constants/DragTypes';

const constructTarget = {

  drop(props, monitor) {
    const { item, type } = monitor.getItem();

    if (type === blockDragType) {
      // fixme
      // really, we just need to add it to the store...
      // going to leave for now... let's discuss how to handle
      // do we just want an action to associate a block with the store, since this isn't really creating it if its coming from the inventory?
      // do we want to clone inventory?
      // What happens when you pull something from inventory to associate with your project?
      // doing this will use the provided ID, and cause problems in the store

      const block = props.blockCreate(item);
      props.blockAddComponent(props.construct.id, block.id);
    } else if (type === sbolDragType) {
      console.log(item); //eslint-disable-line
      //todo - assign type to the block, likely using block.rules ...
    } else {
      // ?
    }
  },
};

@DropTarget(inventoryItemDragType, constructTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export class UserInterface extends Component { //

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
