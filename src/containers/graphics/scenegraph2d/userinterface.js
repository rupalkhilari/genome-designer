import React from 'react';
import Vector2D from '../geometry/vector2d';
import UserInterfaceReact from '../scenegraph2d_react/userinterface';
import Blocky from './blocky/blockybase';
import uuid from 'node-uuid';
import randomColor from '../../../utils/generators/color';
import { block as blockDragType, inventoryPart as inventoryPartDragType } from '../../../constants/DragTypes';
import { blockCreate, blockAddComponent } from '../../../actions/blocks';

export default class UserInterface {

  constructor(sceneGraph, dataSet) {
    this.sceneGraph = sceneGraph;
    this.dataSet = dataSet;

    this.blocky = new Blocky(this.sceneGraph, this, this.dataSet, {
      width: 750,
    });
    this.blocky.update();
    this.selections = [];
  }

  findNodeAt(point) {
    let hitNode = null;
    this.sceneGraph.traverse( node => {
      if (node.parent && node.containsGlobalPoint(point)) {
        hitNode = node;
      }
    }, this);
    return hitNode;
  }

  /**
   * change the layout algorithm
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  layoutAlgorithm(name) {
    this.blocky.layoutAlgorithm(name);
    this.sceneGraph.update();
  }

  /**
   * add the given node to the selections if not already present
   * @param {[type]} node [description]
   */
  addToSelections(node) {
    if (!this.isSelected(node)) {
      this.selections.push(node);
    }
  }
  /**
   * remove a node from the selections
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  removeFromSelections(node) {
    if (this.isSelected(node)) {
      this.selections.splice(this.selections.indexOf(node), 1);
    }
  }
  /**
   * true if the node is already in the selections collection
   * @param {[type]} node [description]
   * @return boolean
   */
  isSelected(node) {
    return this.selections.indexOf(node) >= 0;
  }

  onMouseDown = (e) => {
    const point = this.eventToLocal(e.clientX, e.clientY, e.currentTarget);
    const node = this.findNodeAt(point);
    if (node) {
      console.log('clicked:', node.props.text);
      if (e.shiftKey) {
        // toggle in selections
        if (this.isSelected(node)) {
          this.removeFromSelections(node);
        } else {
          this.addToSelections(node);
        }
        this.sceneGraph.update();
      } else {
        this.selections = [node];
        this.sceneGraph.update();
        // if (node) {
        //   this.drag = node;
        //   this.dragStart = point;
        //   this.nodeStart = this.drag.parent.localToGlobal(new Vector2D(this.drag.props.x, this.drag.props.y));
        // }
      }
    } else {
      this.selections = [];
      this.sceneGraph.update();
    }
  }

  onMouseMove = (e) => {
    // if (this.drag) {
    //   const p = this.eventToLocal(e.clientX, e.clientY, e.currentTarget);
    //   // the delta includes accomodating the view scale on the root node
    //   const delta = p.sub(this.dragStart); //.multiply(1/this.sceneGraph.root.props.scale);
    //   // add the delta to the nodes starting global position
    //   const g = this.nodeStart.add(delta);
    //   // transform this point back into local space of the dragged node
    //   const l = this.drag.parent.globalToLocal(g);
    //   // apply to the nodes position
    //   this.drag.props.x = l.x;
    //   this.drag.props.y = l.y;
    //   // update the entire graph ... yuk
    //   this.sceneGraph.update();
    // }
  }

  onMouseUp = (e) => {
    //this.drag = null;
  }

  onDrop = () => {
    console.log('dropped');
  }

  /**
   * adjust the size of the scenegraph to accomodate the current
   * size of the visualization
   */
  autoSizeSceneGraph() {
    const aabb = this.sceneGraph.getAABB();
    if (aabb) {
      this.sceneGraph.setSize(new Vector2D(aabb.right + 50, aabb.bottom + 50));
      this.sceneGraph.update();
    }
  }
  /**
   * convert clientX/clientY to local coordinates
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  eventToLocal(clientX, clientY, target) {
    function getPosition(element) {
      let xPosition = 0;
      let yPosition = 0;
      let el = element;
      while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
      }
      return new Vector2D(xPosition, yPosition);
    }
    const parentPosition = getPosition(target);
    return new Vector2D(clientX, clientY).sub(parentPosition);
  }

  /**
   * convert the AABB of the node into coordinates for the user interface element
   * @param  {Node2D} node
   * @return {Box2D}
   */
  transformedNodeBounds(node) {
    // start with the nodes axis align bounding box
    const naabb = node.getAABB();
    return naabb;
    return naabb.multiply(this.sceneGraph.getScale());
  }

  render() {
    // size to cover scene graph but don't scale
    const scale = this.sceneGraph.getScale();
    const style = {
      width: (this.sceneGraph.props.w * scale) + 'px',
      height: (this.sceneGraph.props.h * scale) + 'px',
    };
    // map the AABB's of the current selections to be rendered. The user interface
    // scrolls with the scenegraph but does NOT scale. So we have to adjust to
    // a different coordinate space.
    //this.selections = [this.sceneGraph.root.children[0], this.sceneGraph.root.children[1]];
    const selectionInfo = this.selections.map(node => {
      return {
        bounds: this.transformedNodeBounds(node),
        node: node,
      }
    });

    return (<UserInterfaceReact style={style}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
      onDrop={this.onDrop}
      selectionInfo={selectionInfo}
      construct={this.dataSet}
      />);
  }
}
