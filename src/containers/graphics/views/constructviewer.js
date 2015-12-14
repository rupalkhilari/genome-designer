import React, { Component, PropTypes } from 'react';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Vector2D from '../geometry/vector2d';
import Layout from './layout.js';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { blockCreate, blockAddComponent } from '../../../actions/blocks';
import { block as blockDragType, sbol as sbolDragType, inventoryItem as inventoryItemDragType } from '../../../constants/DragTypes';
import debounce from 'lodash.debounce';
import { nodeIndex } from '../utils';
import ConstructViewerMenu from './constructviewermenu';
import UserInterface from './constructvieweruserinterface';

const constructTarget = {
  drop(props, monitor, component) {
    component.drop.call(component, monitor);
  },
  hover(props, monitor, component) {
    component.dragOver.call(component, monitor);
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
      userInterfaceConstructor: UserInterface,
    });
    // create the layout object
    this.layout = new Layout(this, this.sg, {
      layoutAlgorithm: this.props.layoutAlgorithm,
      baseColor: baseColors[nindex % baseColors.length],
    });
    // the user interface will also need access to the layout component
    this.sg.ui.layout = this.layout;
    // initial render won't call componentDidUpdate so force an update to the layout/scenegraph
    this.update();
    // handle window resize to reflow the layout
    window.addEventListener('resize', debounce(this.windowResized.bind(this), 100));
  }

  /**
   * update drag state
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.isOver && !nextProps.isOver) {
      this.sg.ui.dragLeave();
    }
    if (!this.props.isOver && nextProps.isOver) {
      this.sg.ui.dragEnter();
    }
  }

  /**
   * drag over event
   */
  dragOver(monitor) {
    const point = monitor.getClientOffset();
    this.sg.ui.dragOver(new Vector2D(point.x, point.y));
  }

  /**
   * something was dropped on us
   * @param  {[type]} monitor [description]
   * @return {[type]}         [description]
   */
  drop(monitor) {
    // get the current insertion point
    const insertionPoint = this.sg.ui.getInsertionPoint();
    if (insertionPoint) {
      console.log(`Insert at: node:${insertionPoint.node.uuid}, block:${insertionPoint.block}, edge:${insertionPoint.edge}`);
      // because react / dnd is effite we need to construct the thing
      // that was dropped here using the current insertion point
      const { item, type } = monitor.getItem();
      if (type === blockDragType) {
        const block = this.props.blockCreate(item);
        this.props.blockAddComponent(this.props.construct.id, block.id);
      } else if (type === sbolDragType) {
        console.log(item); //eslint-disable-line
        //todo - assign type to the block, likely using block.rules ...
      } else {
        // ?
      }
    }
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
    this.layout.update(this.props.construct, this.props.layoutAlgorithm, this.props.blocks);
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
  return {
    construct: state.blocks[props.constructId],
    blocks: state.blocks,
   };
}, {
  blockCreate,
  blockAddComponent,
})(ConstructViewer);
