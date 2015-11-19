import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';

import Vector2D from '../geometry/vector2d';
import UserInterface_React from '../scenegraph2d_react/userinterface';

export default class UserInterface {

  constructor(sceneGraph) {
    this.sceneGraph = sceneGraph;
  }

  onMouseDown = (e) => {
    const p = this.eventToLocal(e);
    console.log('-------------Mouse Down:' + p.toString());

    this.sceneGraph.traverse( node => {
      if (node.containsGlobalPoint(p)) {
        this.drag = node;
        this.dragStart = p;
        this.nodeStart = new Vector2D(this.drag.props.x, this.drag.props.y);
        console.log("HIT:", node.props.text);
      }
    }, this);
  }

  onMouseMove = (e) => {
    if (this.drag) {
      const p = this.eventToLocal(e);
      const delta = p.sub(this.dragStart);
      this.drag.props.x = this.nodeStart.x + delta.x;
      this.drag.props.y = this.nodeStart.y + delta.y;
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
    return <UserInterface_React
      onMouseDown={this.onMouseDown}
      onMouseMove={this.onMouseMove}
      onMouseUp={this.onMouseUp}
      />
  }
}
