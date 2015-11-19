import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';

// scene graph classes
import Node2D from '../scenegraph2d/node2d';

// react components for rendering scene graph classes
import SceneGraph2D_React from '../scenegraph2d_react/scenegraph2d';
import Node2D_React from '../scenegraph2d_react/node2d';


export default class SceneGraph2D {

  constructor(props) {

    // extend default options with the given options
    this.props = Object.assign({
      w: 800,
      h: 600
    }, props);

    // create our root node, which represents the view matrix and to which
    // all other nodes in the graph are ultimately attached.
    this.root = new Node2D();
  }

  traverse (callback, context) {
    let stack = [this.root];
    while (stack.length) {
      const next = stack.pop();
      callback.call(context, next);
      stack = stack.concat(next.children);
    }
  }

  /**
   * update involves re-rendering by our owner
   */
  update() {
    this.props.owner.forceUpdate();
  }

  render() {
    const ui = this.props.userInterface ? this.props.userInterface.render() : null;

    return <SceneGraph2D_React w={this.props.w} h={this.props.h}>
      {this.root.render()}
      {ui}
    </SceneGraph2D_React>;

  }
}
