import uuid from 'node-uuid';
import Node2D from './node2d';
import UserInterface from './userinterface';
import invariant from '../../../utils/environment/invariant';
import debounce from 'lodash.debounce';
import Box2D from '../geometry/box2d';

export default class SceneGraph2D {

  constructor(props) {
    // extend this with defaults and supplied properties.
    // width / height are the actual dimensions of the scene graph.
    // availableWidth, availableHeight are the dimensions of the window we are in.
    Object.assign(this, {
      width: 800,
      height: 600,
      availableWidth: 800,
      availableHeight: 600,
      uuid: uuid.v4(),
      userInterfaceConstructor: null,
    }, props);

    // we must have a parent before being created
    invariant(this.parent, 'expected a parent DOM element');

    // ensure our parent element has the scene graph class
    this.parent.classList.add('sceneGraph');

    // create our root node, which represents the view matrix and to which
    // all other nodes in the graph are ultimately attached.
    this.root = new Node2D({sg: this});

    // root is appended directly to the scene graph BUT without setting a parent node.
    this.parent.appendChild(this.root.el);

    // create the user interface layer as required
    if (this.userInterfaceConstructor) {
      this.ui = new this.userInterfaceConstructor(this);
    }

    // size our element to initial scene graph size
    this.updateSize();

    // if you want an immediate update call this._update(). The this.update()
    // method is debounced since React tends to over send updates.
    this.updateDebounced = debounce(this._update, 15);
  }


  /**
   * update our element to the current scene graph size
   * @return {[type]} [description]
   */
  updateSize() {
    this.parent.style.width = this.width + 'px';
    this.parent.style.height = this.height + 'px';
    if (this.ui) {
      this.ui.updateSize();
    }
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
   * return a list of nodes at the given location, the higest in the z-order
   * will be towards tht end of the list, the top most node is the last.
   * @param  {Vector2D} point
   * @return {[Node2D]}
   */
  findNodesAt(point) {
    let hits = [];
    this.traverse( node => {
      if (node.parent && node.containsGlobalPoint(point)) {
        hits.push(node);
      }
    }, this);
    return hits;
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
    this.updateDebounced();
  }
  _update() {
    this.root.updateBranch();
    if (this.ui) {
      this.ui.update();
    }
  }

  /**
   * start a drag using the detached node at its last position / size
   */
  simulateDrag(node) {
    this.sdrag = {
      node: node,
      translateX: node.translateX,
      translateY: node.translateY,
    }
    this.root.appendChild(node);
    node.update();
  }
  dragMove(point) {
    console.log('drag move ', point.toString());
    if (this.sdrag) {
      this.sdrag.node.set({
        translateX: point.x,
        translateY: point.y,
      });
      this.sdrag.node.update();
    }
  }
  dragUp(point) {
    if (this.sdrag) {
      this.sdrag.node.parent.removeChild(this.sdrag.node);
      this.sdrag = null;
    }
  }
}
