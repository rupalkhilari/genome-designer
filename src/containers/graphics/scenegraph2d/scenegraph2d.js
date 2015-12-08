import uuid from 'node-uuid';
import React from 'react';
import Node2D from '../scenegraph2d/node2d';
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import invariant from '../../../utils/environment/invariant';

export default class SceneGraph2D {

  constructor(props) {

    // extend this with defaults and supplied properties
    this.props = Object.assign(this, {
      width: 800,
      height: 600,
      uuid: uuid.v4(),
    }, props);

    // we must have a parent before being created
    invariant(this.parent, 'expected a parent DOM element');

    // parent gets the .sceneGraph CSS class
    this.parent.classList.add('sceneGraph');

    // create our root node, which represents the view matrix and to which
    // all other nodes in the graph are ultimately attached.
    this.root = new Node2D({sg: this});

    // root is appended directly to the scene graph BUT without setting a parent node.
    this.parent.appendChild(this.root.el);
  }

  /**
   * generic in-order traversal of the nodes of the graph.
   * @param  {Function} callback
   * @param  {this}   context
   */
  traverse(callback, context) {
    let stack = [this.root];
    while (stack.length) {
      const next = stack.pop();
      callback.call(context, next);
      stack = stack.concat(next.children);
    }
  }

  /**
   * return the union of the AABB of all nodes in the scenegraph
   * except the root node
   * @return {Box2D}
   */
  getAABB() {
    let aabb = null;
    this.traverse( node => {
      // ignore the root, which we can identify because it has no parent
      if (node.parent) {
        const nodeAABB = node.getAABB();
        aabb = aabb ? aabb.union(nodeAABB) : nodeAABB;
      }
    });
    return aabb;
  }

  /**
   * updating the entire graph just involves updating the entire root node branch
   * @return {[type]} [description]
   */
  update() {
    this.root.updateBranch();
  }
}
