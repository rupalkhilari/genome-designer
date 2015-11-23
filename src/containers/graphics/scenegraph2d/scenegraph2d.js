import React from 'react';
// scene graph classes
import Node2D from '../scenegraph2d/node2d';
// react components for rendering scene graph classes
import SceneGraph2DReact from '../scenegraph2d_react/scenegraph2d';
import uuid from 'node-uuid';

export default class SceneGraph2D {

  constructor(props) {
    // extend default options with the given options
    this.props = Object.assign({
      w: 800,
      h: 600,
      uuid: uuid.v4(),
    }, props);

    // create our root node, which represents the view matrix and to which
    // all other nodes in the graph are ultimately attached.
    this.root = new Node2D();
  }

  traverse(callback, context) {
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

  /**
   * when our underlying element is scrolled / panned
   * @param  {Vector2D} vector
   */
  onScrolled = (vector) => {
  }

  /**
   * set the current scaling of the scenegraph view. This is performed
   * by just changing the scaling of our root node.
   * @param {[type]} s [description]
   */
  setScale(s) {
    // apply to root node
    this.root.set({
      scale: s,
    });
  }

  /**
   * return our scale
   * @return {number}
   */
  getScale() {
    return this.root.props.scale;
  }

  /**
   * render the scenegraph and its root node ( which recursively renders it children )
   * If there is a UI element, then render it on top of everything
   * @return {[type]} [description]
   */
  render() {
    const ui = this.props.userInterface ? this.props.userInterface.render() : null;
    return (<SceneGraph2DReact
      scale={this.root.props.scale}
      uuid={this.props.uuid}
      w={this.props.w}
      h={this.props.h}
      ui={ui}
      onScrolled={this.onScrolled}>
      {this.root.render()}
    </SceneGraph2DReact>);
  }
}
