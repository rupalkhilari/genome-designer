import React, { Component, PropTypes } from 'react';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Layout from './layout.js';
import { DropTarget } from 'react-dnd';
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
export class ConstructViewer extends Component {

  static propTypes = {
    construct: PropTypes.object.isRequired,
    constructId: PropTypes.string.isRequired,
    connectDropTarget: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // we will need a reference to our actual DOM node
    const dom = React.findDOMNode(this);
    // create the scene graph we are going to use to display the construct
    this.sg = new SceneGraph2D({
      width: dom.clientWidth,
      height: dom.clientHeight,
      parent: dom,
    });
    // create the layout object
    this.layout = new Layout(this, this.sg, {
      width: dom.clientWidth,
    });
    // initial render won't call componentDidUpdate so force an update to the layout/scenegraph
    this.layout.update(this.props.construct);
    this.sg.update();
  }

  /**
   * update scene graph after the react component updates`
   */
  componentDidUpdate() {
    this.layout.update(this.props.construct);
    this.sg.update();
  }
  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(<div className="construct-viewer" key={this.props.construct.id}/>);
  }
}

export default connect((state, props) => {
  return {construct: state.blocks[props.constructId] };
}, {

  blockCreate,
  blockAddComponent,
})(ConstructViewer);
