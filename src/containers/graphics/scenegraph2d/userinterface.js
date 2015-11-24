import React from 'react';
import Vector2D from '../geometry/vector2d';
import UserInterfaceReact from '../scenegraph2d_react/userinterface';
import Layout1 from './layout1.js';

export default class UserInterface {

  constructor(sceneGraph, dataSet) {
    this.sceneGraph = sceneGraph;
    this.dataSet = dataSet;
    this.layout = new Layout1(this.sceneGraph, this.dataSet, {
      width: 850,
    });
    this.layout.update();
  }

  onMouseDown = (e) => {
    const point = this.eventToLocal(e);
    this.sceneGraph.traverse( node => {
      if (node.parent && node.containsGlobalPoint(point)) {
        this.drag = node;
        this.dragStart = point;
        // node starting position, relative to parent, in global coordinates
        this.nodeStart = this.drag.parent.localToGlobal(new Vector2D(this.drag.props.x, this.drag.props.y));
        //console.log(`HIT:, ${node.props.glyph}, ${node.props.fill}`);
      }
    }, this);
  }

  onMouseMove = (e) => {
    if (this.drag) {
      const p = this.eventToLocal(e);
      // the delta includes accomodating the view scale on the root node
      const delta = p.sub(this.dragStart); //.multiply(1/this.sceneGraph.root.props.scale);
      // add the delta to the nodes starting global position
      const g = this.nodeStart.add(delta);
      // transform this point back into local space of the dragged node
      const l = this.drag.parent.globalToLocal(g);
      // apply to the nodes position
      this.drag.props.x = l.x;
      this.drag.props.y = l.y;
      // update the entire graph ... yuk
      this.sceneGraph.update();
    }
  }

  onMouseUp = (e) => {
    this.drag = null;
  }

  /**
   * convert clientX/clientY to local coordinates
   * @param  {[type]} evt [description]
   * @return {[type]}   [description]
   */
  eventToLocal(evt) {
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

    const parentPosition = getPosition(evt.currentTarget);
    return new Vector2D(evt.clientX, evt.clientY).sub(parentPosition);
  }

  render() {
    // size to cover scene graph but don't scale
    const scale = this.sceneGraph.getScale();
    const style = {
      width: (this.sceneGraph.props.w * scale) + 'px',
      height: (this.sceneGraph.props.h * scale) + 'px',
    };

    return (<UserInterfaceReact style={style}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
      />);
  }
}
