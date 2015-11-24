import uuid from 'node-uuid';
import React from 'react';
import Node2D from '../scenegraph2d/node2d';
import SceneGraph2DReact from '../scenegraph2d_react/scenegraph2d';
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';

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

    // scroll offset defaults to 0,0
    this.scrollOffset = new Vector2D();
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
   * when our underlying element is scrolled / panned. We will sometimes
   * need to know the scroll offset e.g. when the user wants to scroll to
   * a specific position.
   * @param  {Vector2D} vector
   */
  onScrolled = (vector) => {
    this.scrollOffset = vector.clone();
    console.log(this.getVisibleBounds().toString());
  }

  /**
   * the current (raw) scroll position i.e. not adjusted for scaling.
   * @return {Vector2D}
   */
  getScrollPosition() {
    return this.scrollOffset.clone();
  }

  /**
   * set the scroll position
   * @param {[type]} v [description]
   */
  setScrollPosition(v) {
    this.scrollOffset = v.clone();
  }

  /**
   * get the measure dimensions of our container
   * @return {Vector2D}
   */
  getSize() {
    return new Vector2D(this.props.w, this.props.h);
  }

  /**
   * return the visible bounds of the scene graph
   * @return {[type]} [description]
   */
  getVisibleBounds() {
    const sp = this.getScrollPosition();
    const w = this.getSize();
    return new Box2D(sp.x, sp.y, w.x, w.y).divide(this.getScale());
  }

  /**
   * set the current scaling of the scenegraph view. This is performed
   * by just changing the scaling of our root node.
   * @param {[type]} s [description]
   */
  setScale(s) {
    // remember the current center
    let center = this.getVisibleBounds().center;
    console.log(`old center ${center.toString()}`);

    // apply to root node
    this.root.set({
      scale: s,
    });

    // keep the old center
    this.centerOn(center);
    center = this.getVisibleBounds().center;
    console.log(`new center ${center.toString()}`);
  }

  /**
   * center on the given global point
   * @param  {[type]} p [description]
   * @return {[type]}   [description]
   */
  centerOn(p) {
    // size of window in graph coordinates
    var w = this.getSize().divide(this.getScale());
    // top/left edge required
    var leftTop = p.sub(w.divide(2));
    // set scroll position
    this.setScrollPosition(new Vector2D(leftTop.x * this.getScale(), leftTop.y * this.getScale()));
    // must redraw for this to take effect
    this.update();
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
      scrollOffset={this.scrollOffset}
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
