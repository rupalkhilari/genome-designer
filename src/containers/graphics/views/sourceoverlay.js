import React, { Component, PropTypes } from 'react';
import { DragSource } from 'react-dnd';

const dummySource = {
  beginDrag(props) {
    return {
      item: "ABC",
      type: "BLOCK",
    };
  },
};

@DragSource("INVENTORY ITEM", dummySource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class SourceOverlay extends Component {

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
  }

  render() {
    const style = {
      width: this.props.width,
      height: this.props.height,
      left: '0px',
      top: '0px',
      position: 'absolute',
      backgroundColor: 'rgba(255,0,0,0.1)',
    }

    const connectDragSource = this.props.connectDragSource;

    return connectDragSource(
      <div style={style}></div>
    )
  }
}
