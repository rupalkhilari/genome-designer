import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import SceneGraph2D from '../scenegraph2d/scenegraph2d';
import Vector2D from '../geometry/vector2d';
import Layout from './layout.js';
import PopupMenu from '../../../components/Menu/PopupMenu';
import {connect } from 'react-redux';
import {
  blockCreate,
  blockDelete,
  blockDetach,
  blockAddComponent,
  blockAddComponents,
  blockClone,
  blockSetSbol,
  blockRename,
  blockRemoveComponent,
} from '../../../actions/blocks';
import {
  uiShowDNAImport,
  uiToggleDetailView,
} from '../../../actions/ui';
import {
  blockGetParents,
} from '../../../selectors/blocks';

import { sbol as sbolDragType } from '../../../constants/DragTypes';
import debounce from 'lodash.debounce';
import { nodeIndex } from '../utils';
import ConstructViewerMenu from './constructviewermenu';
import UserInterface from './constructvieweruserinterface';
import { inspectorToggleVisibility } from '../../../actions/inspector';
import {
  focusBlocks,
  focusBlocksAdd,
  focusBlocksToggle,
  focusConstruct,
} from '../../../actions/focus';
import invariant from 'invariant';
import { projectGetVersion } from '../../../selectors/projects';
import * as undoActions from '../../../store/undo/actions';

// static hash for matching viewers to constructs
const idToViewer = {};

export class ConstructViewer extends Component {

  static propTypes = {
    projectId: PropTypes.string.isRequired,
    construct: PropTypes.object.isRequired,
    constructId: PropTypes.string.isRequired,
    layoutAlgorithm: PropTypes.string.isRequired,
    inspectorToggleVisibility: PropTypes.func.isRequired,
    focusBlocks: PropTypes.func.isRequired,
    focusBlocksAdd: PropTypes.func.isRequired,
    focusBlocksToggle: PropTypes.func.isRequired,
    focusConstruct: PropTypes.func.isRequired,
    currentBlock: PropTypes.array,
    blockSetSbol: PropTypes.func,
    blockCreate: PropTypes.func,
    blockGetParent: PropTypes.func,
    blockClone: PropTypes.func,
    blockAddComponent: PropTypes.func,
    blockRemoveComponent: PropTypes.func,
    blockGetParents: PropTypes.func,
    projectGetVersion: PropTypes.func,
    blocks: PropTypes.object,
    focus: PropTypes.object,
  };

  constructor(props) {
    super(props);
    idToViewer[this.props.constructId] = this;
    this.state = {
      blockPopupMenuOpen: false,    // context menu for blocks
      menuPosition: new Vector2D(), // position for any popup menu,
      modalOpen: false,             // controls visibility of test modal window
    };
    this.update = debounce(this._update.bind(this), 1);
  }

  /**
   * given a construct ID return the current viewer if there is one
   */
  static getViewerForConstruct(id) {
    return idToViewer[id];
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
    this.resizeDebounced = debounce(this.windowResized.bind(this), 5);
    window.addEventListener('resize', this.resizeDebounced);

    // if there is no focused construct, then we should focus our construct
    if (!this.props.focus.construct) {
      this.props.focusConstruct(this.props.constructId);
    }
  }
  /**
   * update scene graph after the react component updates
   */
  componentDidUpdate() {
    this.update();
  }

  /**
   * ensure we don't get any resize events after dismounting
   */
  componentWillUnmount() {
    delete idToViewer[this.props.constructId];
    this.resizeDebounced.cancel();
    window.removeEventListener('resize', this.resizeDebounced);
  }

  /**
   * get the parent of the given block, which is either the construct or the parents
   * of the block if a nested construct.
   *
   */
  getBlockParent(blockId) {
    const parents = this.props.blockGetParents(blockId);
    invariant(parents && parents.length, 'blocks are expected to have parents');
    return parents[0];
  }

  /**
   * add the given item using an insertion point from the constructviewer user interface.
   * Insertion point may be null, in which the block is added at the end
   */
  addItemAtInsertionPoint(payload, insertionPoint, event) {
    const { item, type } = payload;
    // get the immediate parent ( which might not be the top level block if this is a nested construct )
    let parent = insertionPoint ? this.getBlockParent(insertionPoint.block) : this.props.construct;
    if (type === sbolDragType) {

      // insert next to block, inject into a block, or add as the first block of an empty construct
      if (insertionPoint) {
        if (insertionPoint.edge) {
          // create new block
          const block = this.props.blockCreate({rules: {sbol: item.id}});
          // get index of insertion allowing for the edge closest to the drop if provided
          const index = parent.components.indexOf(insertionPoint.block) + (insertionPoint.edge === 'right' ? 1 : 0);
          // add
          this.props.blockAddComponent(parent.id, block.id, index);
          // return the newly created block or the block dropped on
          return [block.id];
        }
        // drop on existing block
        this.props.blockSetSbol(insertionPoint.block, item.id);
        return [insertionPoint.block];
      } else {
        // create new block
        const block = this.props.blockCreate({rules: {sbol: item.id}});
        // the construct must be empty, add as the first child of the construct
        this.props.blockAddComponent(parent.id, block.id, 0);
        return [block.id];
      }
    }

    // get index of insertion allowing for the edge closest to the drop
    let index = parent.components.length;
    if (insertionPoint) {
      index = parent.components.indexOf(insertionPoint.block) + (insertionPoint.edge === 'right' ? 1 : 0);
    }
    // just a HACK for now to allow new nested construct to be created.
    if (insertionPoint && insertionPoint.block && event && event.metaKey) {
      parent = this.props.blocks[insertionPoint.block];
      index = 0;
    }

    // add all blocks in the payload
    const blocks = Array.isArray(payload.item) ? payload.item : [payload.item];
    // return the list of newly added blocks so we can select them for example
    const newBlocks = [];
    const projectVersion = this.props.projectGetVersion(this.props.projectId);
    blocks.forEach(block => {
      const newBlock = (payload.source === 'inventory' || payload.copying)
        ? this.props.blockClone(block, projectVersion)
        : this.props.blocks[block];
      newBlocks.push(newBlock.id);
    });
    // now insert the blocks in one go
    return this.props.blockAddComponents(parent.id, newBlocks, index);
  }
  /**
   * remove the given block, which we assume if part of our construct and
   * return the scenegraph node that was representing it.
   */
  removePart(partId) {
    this.props.blockDetach(partId);

    // const parent = this.getBlockParent(partId);
    // this.props.blockRemoveComponent(parent.id, partId);
  }

  /**
   * remove all parts in the list
   */
  removePartsList(partList) {
    this.props.blockDetach(...partList)
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
   * select the given block
   */
  constructSelected(id) {
    this.props.focusConstruct(id);
  }

  /**
   * select the given block
   */
  blockSelected(partIds) {
    this.props.focusBlocks(partIds);
  }

  /**
   * select the given block
   */
  blockToggleSelected(partIds) {
    this.props.focusBlocksToggle(partIds);
  }

  /**
   * add the given part by ID to the selections
   */
  blockAddToSelections(partIds) {
    this.props.focusBlocksAdd(partIds);
  }
  /**
   * Join the given block with any other selected block in the same
   * construct level and select them all
   */
  blockAddToSelectionsRange(partId, currentSelections) {
    // get all the blocks at the same level as this one
    const levelBlocks = (this.props.blockGetParents(partId)[0]).components;
    // find min/max index of these blocks if they are in the currentSelections
    let min = levelBlocks.indexOf(partId);
    let max = min;
    currentSelections.forEach((blockId, index) => {
      const blockIndex = levelBlocks.indexOf(blockId);
      if (blockIndex >= 0) {
        min = Math.min(min, blockIndex);
        max = Math.max(max, blockIndex);
      }
    });
    // now we can select the entire range
    this.props.focusBlocksAdd(levelBlocks.slice(min, max + 1));
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
   * accessor for our DOM node.
   * @return {[type]} [description]
   */
  get dom() {
    return ReactDOM.findDOMNode(this);
  }
  /**
   * accessor that fetches the actual scene graph element within our DOM
   * @return {[type]} [description]
   */
  get sceneGraphEl() {
    return this.dom.querySelector('.sceneGraph');
  }

  /**
   * update the layout and then the scene graph
   */
  _update() {
    this.layout.update(
      this.props.construct,
      this.props.layoutAlgorithm,
      this.props.blocks,
      this.props.focus.blocks,
      this.props.focus.construct);
    this.sg.update();
    this.sg.ui.update();
  }

  /**
   * close all popup menus
   */
  closePopups() {
    this.setState({blockPopupMenuOpen: false});
  }
  /**
   * open any popup menu by apply the appropriate state and global position
   */
  openPopup(state) {
    this.setState(state);
  }
  /**
   * return JSX for block construct menu
   */
  blockContextMenu() {
    return (<PopupMenu
      open={this.state.blockPopupMenuOpen}
      position={this.state.menuPosition}
      closePopup={this.closePopups.bind(this)}
      menuItems={
        [
          {
            text: 'Inspect',
            action: () => {
              this.props.inspectorToggleVisibility(true);
            },
          },
          {},
          {
            text: 'Import DNA Sequence',
            action: () => {
              this.props.uiShowDNAImport(true);
            }
          },
          {},
          {
            text: 'Delete',
            action: () => {
              this.removePartsList(this.sg.ui.selectedElements);
            }
          },
        ]
      }/>);
  }
  /**
   * render the component, the scene graph will render later when componentDidUpdate is called
   */
  render() {
    // TODO, can be conditional when master is fixed and this is merged with construct select PR
    let menu = <ConstructViewerMenu
      open={this.props.construct.id === this.props.focus.construct}
      constructId={this.props.constructId}
      layoutAlgorithm={this.props.layoutAlgorithm}
      />;


    const rendered = (
      <div className="construct-viewer" key={this.props.construct.id}>
        {menu}
        <div className="sceneGraphContainer">
          <div className="sceneGraph"/>
        </div>
        {this.blockContextMenu()}
      </div>
    );
    return rendered;
  }
}

function mapStateToProps(state, props) {
  return {
    focus: state.focus,
    construct: state.blocks[props.constructId],
    blocks: state.blocks,
  };
}

export default connect(mapStateToProps, {
  blockCreate,
  blockDelete,
  blockDetach,
  blockClone,
  blockAddComponent,
  blockAddComponents,
  blockRemoveComponent,
  blockGetParents,
  blockSetSbol,
  blockRename,
  focusBlocks,
  focusBlocksAdd,
  focusBlocksToggle,
  focusConstruct,
  projectGetVersion,
  inspectorToggleVisibility,
  uiShowDNAImport,
  uiToggleDetailView,
})(ConstructViewer);
