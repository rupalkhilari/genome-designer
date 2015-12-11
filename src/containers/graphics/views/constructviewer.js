import React, { Component, PropTypes } from 'react';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Layout from './layout.js';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../../../actions/blocks';
import { block as blockDragType, sbol as sbolDragType, inventoryItem as inventoryItemDragType } from '../../../constants/DragTypes';
import debounce from 'lodash.debounce';
import { nodeIndex } from '../utils';
import ConstructViewerMenu from './constructviewermenu';

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
    layoutAlgorithm: PropTypes.string.isRequired,
    //connectDropTarget: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  /**
   * accessor that fetches the actual scene graph element within our DOM
   * @return {[type]} [description]
   */
  get sceneGraphEl() {
    return this.dom.querySelector('.sceneGraph');
  }

  /**
   * accessor for our DOM node.
   * @return {[type]} [description]
   */
  get dom() {
    return React.findDOMNode(this);
  }

  /**
   * window resize, update layout and scene graph with new dimensions
   * @return {[type]} [description]
   */
  windowResized() {
    this.sg.availableWidth = this.dom.clientWidth;
    this.sg.availableHeight = this.dom.clientHeight;
    this.update();
  }

  /**
   * setup the scene graph and layout component.
   */
  componentDidMount() {

    // select a base color based on our index in the parent
    const nindex = nodeIndex(this.dom);
    const baseColors = ['rgb(225, 163, 116)', 'rgb(199, 109, 107)', 'rgb(83, 155, 163)'];

    // create the scene graph we are going to use to display the construct
    this.sg = new SceneGraph2D({
      width: this.dom.clientWidth,
      height: this.dom.clientHeight,
      availableWidth: this.dom.clientWidth,
      availableHeight: this.dom.clientHeight,
      parent: this.sceneGraphEl,
    });
    // create the layout object
    this.layout = new Layout(this, this.sg, {
      layoutAlgorithm: this.props.layoutAlgorithm,
      baseColor: baseColors[nindex % baseColors.length],
    });
    // initial render won't call componentDidUpdate so force an update to the layout/scenegraph
    this.update();
    // handle window resize to reflow the layout
    window.addEventListener('resize', debounce(this.windowResized.bind(this), 100));
  }

  /**
   * update scene graph after the react component updates`
   */
  componentDidUpdate() {
    this.update();
  }

  /**
   * update the layout and then the scene graph
   */
  update() {
    this.layout.update(this.props.construct, this.props.layoutAlgorithm);
    this.sg.update();
  }
  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div className="construct-viewer" key={this.props.construct.id}>
        <ConstructViewerMenu constructId={this.props.constructId} layoutAlgorithm={this.props.layoutAlgorithm}/>
        <div className="sceneGraphContainer">
          <div className="sceneGraph"/>
        </div>
      </div>
    );
  }
}

export default connect((state, props) => {
  return {construct: state.blocks[props.constructId] };
}, {
  blockCreate,
  blockAddComponent,
})(ConstructViewer);
