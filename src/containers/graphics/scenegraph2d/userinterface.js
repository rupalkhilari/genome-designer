import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';

import Vector2D from '../geometry/vector2d';
import UserInterface_React from '../scenegraph2d_react/userinterface';

import Layout1 from './layout1.js';

export default class UserInterface {

  constructor(sceneGraph, dataSet) {

    this.sceneGraph = sceneGraph;
    this.dataSet = dataSet;
    this.layout = new Layout1(this.sceneGraph, this.dataSet, {
      width: 850
    });
    this.layout.update();
  }



  onMouseDown = (e) => {
    const p = this.eventToLocal(e);
    console.log('-------------Mouse Down:' + p.toString());
    this.sceneGraph.traverse( node => {
      if (node.parent && node.containsGlobalPoint(p)) {
        this.drag = node;
        this.dragStart = p;
        // node starting position, relative to parent, in global coordinates
        this.nodeStart = this.drag.parent.localToGlobal(new Vector2D(this.drag.props.x, this.drag.props.y));
        console.log(`HIT:, ${node.props.glyph}, ${node.props.fill}`);
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
   * @param  {[type]} e [description]
   * @return {[type]}   [description]
   */
  eventToLocal(e) {

    function getPosition(element) {
      let xPosition = 0;
      let yPosition = 0;

      while (element) {
          xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }
      return new Vector2D(xPosition, yPosition);
    }

    const parentPosition = getPosition(e.currentTarget);
    return new Vector2D(e.clientX, e.clientY).sub(parentPosition);
  }

  render() {

    // scale according to scene graph
    const s = this.sceneGraph.root.props.scale;
    const style = {
      transform: `scale(${s}, ${s})`
    };

    return <UserInterface_React style={style}
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
      />
  }
}
