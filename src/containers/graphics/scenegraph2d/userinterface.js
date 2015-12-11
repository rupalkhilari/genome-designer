import uuid from 'node-uuid';
import Node2D from './node2d';
import Vector2D from '../geometry/vector2d';
import invariant from '../../../utils/environment/invariant';

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
    this.el.addEventListener('mousedown', this.onMouseMove);
    this.el.addEventListener('mousedown', this.onMouseUp);
  }
  /**
   * mousedown event binding
   */
  onMouseDown = (e) => {
    this.mouseDown(this.eventToLocal(e.clientX, e.clientY, e.currentTarget));
  }
  /**
   * this is the actual mouse down event you should override in descendant classes
   */
  mouseDown(point) {}
  /**
   * mousemove event binding
   */
  onMouseMove = (e) => {
    this.mouseMove(this.eventToLocal(e.clientX, e.clientY, e.currentTarget));
  }
  /**
   * this is the actual mouse move event you should override in descendant classes
   */
  mouseMove(point) {}
  /**
   * mouseup event binding
   */
  onMouseUp = (e) => {
    this.mouseUp(this.eventToLocal(e.clientX, e.clientY, e.currentTarget));
  }
  /**
   * this is the actual mouse up event you should override in descendant classes
   */
  mouseUp(point) {}

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
   * update our element to the current scene graph size
   * @return {[type]} [description]
   */
  updateSize() {
    this.el.style.width = this.sg.width + 'px';
    this.el.style.height = this.sg.height + 'px';
  }
}
