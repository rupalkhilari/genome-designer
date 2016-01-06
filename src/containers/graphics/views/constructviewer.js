import React, { Component, PropTypes } from 'react';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Vector2D from '../geometry/vector2d';
import Layout from './layout.js';
import { DropTarget } from 'react-dnd';
import {connect } from 'react-redux';
import {
  blockCreate,
  blockAddComponent,
  blockClone,
  blockSetSbol,
  blockRename,
  blockRemoveComponent,
} from '../../../actions/blocks';
import { block as blockDragType, sbol as sbolDragType, inventoryItem as inventoryItemDragType } from '../../../constants/DragTypes';
import debounce from 'lodash.debounce';
import { nodeIndex } from '../utils';
import ConstructViewerMenu from './constructviewermenu';
import UserInterface from './constructvieweruserinterface';
import { inspectorToggleVisibility } from '../../../actions/inspector';
import { uiSetCurrent } from '../../../actions/ui';

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
    uiSetCurrent: PropTypes.func.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    currentBlock: PropTypes.string,
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
    this.forceUpdate();
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
    // getting more ugly, the UI needs access to ourselves, the constructviewer
    this.sg.ui.constructViewer = this;
    // initial render won't call componentDidUpdate so force an update to the layout/scenegraph
    this.update();
    // handle window resize to reflow the layout
    window.addEventListener('resize', debounce(this.windowResized.bind(this), 15));
  }

  /**
   * select the given block
   */
  blockSelected(partId) {
    this.props.uiSetCurrent(partId);
    this.props.inspectorToggleVisibility(true);
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
    // construct object that was dropped
    const { item, type } = monitor.getItem();
    if (type === sbolDragType) {
      // must have an insertion point for sbol
      if (insertionPoint) {
        // change to the sbol type
        this.props.blockSetSbol(insertionPoint.block, item.id);
      }
    } else {
      // get index of insertion allowing for the edge closest to the drop
      let index = this.props.construct.components.length;
      if (insertionPoint) {
        index = this.props.construct.components.indexOf(insertionPoint.block) + (insertionPoint.edge === 'right' ? 1 : 0);
      }
      // clone and add the block
      this.props.blockClone(item).then(block => {
        this.props.blockAddComponent(this.props.construct.id, block.id, index);
      });
    }
  }
  /**
   * add the given item using an insertion point from the constructviewer user interface.
   * Insertion point may be null, in which the block is added at the end
   */
  addItemAtInsertionPoint(item, insertionPoint) {
    // get index of insertion allowing for the edge closest to the drop
    let index = this.props.construct.components.length;
    if (insertionPoint) {
      index = this.props.construct.components.indexOf(insertionPoint.block) + (insertionPoint.edge === 'right' ? 1 : 0);
    }
    // clone and add the block
    this.props.blockClone(item).then(block => {
      this.props.blockAddComponent(this.props.construct.id, block.id, index);
    });
  }

  /**
   * remove the given block, which we assume if part of our construct
   */
  removePart(partId) {
    const node = this.layout.removePart(partId);
    this.props.blockRemoveComponent(this.props.construct.id, partId);
    return node;
  }

  /**
   * rename one of our blocks
   * @param  {[type]} blockId [description]
   * @param  {[type]} newName [description]
   * @return {[type]}         [description]
   */
  blockRename(blockId, newName) {

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
    this.layout.update(this.props.construct, this.props.layoutAlgorithm, this.props.blocks, this.props.currentBlock.currentBlock);
    this.sg.update();
    this.sg.ui.update();
  }

  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {

    this.layout && this.layout.update(this.props.construct, this.props.layoutAlgorithm, this.props.blocks, this.props.currentBlock.currentBlock);

    const width = this.sg ? this.sg.width + 'px' : '100%';
    const height = this.sg ? this.sg.height + 'px' : '100%';

    const {connectDropTarget} = this.props;

    const rendered = connectDropTarget(
      <div className="construct-viewer" key={this.props.construct.id}>
        <ConstructViewerMenu constructId={this.props.constructId} layoutAlgorithm={this.props.layoutAlgorithm}/>
        <div className="sceneGraphContainer">
          <div className="sceneGraph"/>
        </div>
      </div>
    );
    return rendered;
  }
}

function mapStateToProps(state, props) {
  return {
    currentBlock: state.ui,
    construct: state.blocks[props.constructId],
    blocks: state.blocks,
  }
}

export default connect(mapStateToProps, {
  blockCreate,
  blockClone,
  blockAddComponent,
  blockRemoveComponent,
  blockSetSbol,
  blockRename,
  uiSetCurrent,
  inspectorToggleVisibility,
})(ConstructViewer);
