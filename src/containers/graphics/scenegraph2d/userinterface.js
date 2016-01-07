import uuid from 'node-uuid';
import Node2D from './node2d';
import Vector2D from '../geometry/vector2d';
import invariant from 'invariant';

export default class UserInterface {

  constructor(sg) {
    // the scenegraph we are on top of.
    this.sg = sg;
    invariant(this.sg, 'user interface must have a scenegraph');
    // build our element
    this.el = document.createElement('div');
    this.el.className = 'scenegraph-userinterface';
    // append after our scenegraph
    this.sg.parent.parentNode.insertBefore(this.el, this.sg.parent.nextSibiling);
    // sink mouse events
    this.el.addEventListener('mousedown', this.onMouseDown);
    this.el.addEventListener('mousemove', this.onMouseMove);
    this.el.addEventListener('mouseup', this.onMouseUp);
    // base class can handle simple selections based on the AABB of nodes
    this.selections = [];
    // maps selected node UUID's to their display glyph
    this.selectionMap = {};
  }
  /**
   * replace current selections, call with falsey to reset selections
   * @param {[type]} newSelections [description]
   */
  setSelections(newSelections) {
    this.selections = newSelections ? newSelections.slice() : [];
    this.updateSelections();
  }
  /**
   * add to selections, ignores if already present
   * @param {[type]} node [description]
   */
  addToSelections(node) {
    invariant(node.sg === this.sg, 'node is not in our scenegraph');
    if (!this.isSelected(node)) {
      this.selections.push(node);
      this.updateSelections();
    }
  }
  /**
   * remove from selections, ignores if not present
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  removeFromSelections(node) {
    invariant(node.sg === this.sg, 'node is not in our scenegraph');
    const index = this.selections.indexOf(node);
    if (index >= 0) {
      this.selections.splice(index, 1);
      this.updateSelections();
    }
  }
  /**
   * returns true if the node is selected
   * @param  {[type]}  node [description]
   * @return {Boolean}      [description]
   */
  isSelected(node) {
    return this.selections.indexOf(node) >= 0;
  }

  /**
   * create / add / remove selection elements according to current selections
   * @return {[type]} [description]
   */
  updateSelections() {
    this.selections.forEach(node => {
      // create an element if we need one
      let sel = this.selectionMap[node.uuid];
      if (!sel) {
        sel = this.selectionMap[node.uuid] = this.createSelectionElement(node);
        this.el.appendChild(sel);
      }
      // update to current node bounds
      const bounds = node.getAABB();
      sel.style.left = bounds.x + 'px';
      sel.style.top = bounds.y + 'px';
      sel.style.width = bounds.width + 'px';
      sel.style.height = bounds.height + 'px';
    });
    // remove any elements no longer required.
    const keys = Object.keys(this.selectionMap);
    keys.forEach(nodeUUID => {
      if (!this.selections.find(node => nodeUUID === node.uuid)) {
        const element = this.selectionMap[nodeUUID];
        delete this.selectionMap[nodeUUID];
        this.el.removeChild(element);
      }
    });
  }

  /**
   * create a selection element for a given node. Override this method to create
   * selection elements with a different appearance.
   * @param  {Node2D} node
   */
  createSelectionElement(node) {
    const d = document.createElement('div');
    d.className = 'scenegraph-userinterface-selection';
    return d;
  }

  /**
   * mousedown event binding
   */
  onMouseDown = (e) => {
    this.mouseDown(this.eventToLocal(e.clientX, e.clientY, e.currentTarget), e);
  }
  /**
   * this is the actual mouse down event you should override in descendant classes
   */
  mouseDown(point, e) {}
  /**
   * mousemove event binding
   */
  onMouseMove = (e) => {
    this.mouseMove(this.eventToLocal(e.clientX, e.clientY, e.currentTarget), e);
  }
  /**
   * this is the actual mouse move event you should override in descendant classes
   */
  mouseMove(point, e) {}
  /**
   * mouseup event binding
   */
  onMouseUp = (e) => {
    this.mouseUp(this.eventToLocal(e.clientX, e.clientY, e.currentTarget), e);
  }
  /**
   * this is the actual mouse up event you should override in descendant classes
   */
  mouseUp(point, e) {}

  /**
   * [eventToLocal description]
   * @param  {Number} clientX
   * @param  {Number} clientY
   * @param  {Node} target
   * @return {Vector2D}
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
   * general update, called whenever our scenegraph updates
   * @return {[type]} [description]
   */
  update() {
    this.updateSelections();
  }

  /**
   * update our element to the current scene graph size
   * @return {[type]} [description]
   */
  updateSize() {
    this.el.style.width = this.sg.width + 'px';
    this.el.style.height = this.sg.height + 'px';
  }
}
