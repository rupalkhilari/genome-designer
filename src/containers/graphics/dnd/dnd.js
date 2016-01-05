import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import invariant from '../../../utils/environment/invariant';

/**
 * actual Drag and Drop manager.
 */
class DnD {

  constructor() {
    this.targets = [];
    this.mouseMove = this.onMouseMove.bind(this);
    this.mouseUp = this.onMouseUp.bind(this);
  }

  // start a drag operation using the given element proxy for display purposes
  // and starting from the given global position. Payload is any object representing
  // what is being dragged
  startDrag(elementProxy, globalPosition, payload) {

    // the body must have position relative for this to work ( or we could add
    // an element to act as a drag surface but that seems like overkill )
    document.body.style.position = 'relative';

    // the element proxy is positioned absolutely on top of the body so give
    // it the correct style and add to the body with a maximum z-index
    this.proxy = elementProxy;
    this.proxy.style.position = 'absolute';
    // http://www.puidokas.com/max-z-index/
    this.proxy.style.zIndex = 2147483647;

    document.body.appendChild(this.proxy);

    // track mouse move until user releases
    document.body.addEventListener('mousemove', this.mouseMove);
    document.body.addEventListener('mouseup', this.mouseUp);

    // initial update of proxy
    this.updateProxyPosition(globalPosition);
  }

  /**
   * mouse move during drag
   */
  onMouseMove(e) {
    invariant(this.proxy, 'not expecting mouse events when not dragging');
    this.updateProxyPosition(this.mouseToGlobal(e));
    const element = this.findTargetAt(e);
    if (element) {
      console.log("Hit at:", this.mouseToGlobal(e).toString());
    } else {
      console.log('No target');
    }
  }
  /**
   * mouse up during drag
   */
  onMouseUp(e) {
    invariant(this.proxy, 'not expecting mouse events when not dragging');
    this.cancelDrag();
  }

  /**
   * update proxy to given global position
   */
  updateProxyPosition(globalPoint) {
    const bounds = this.proxy.getBoundingClientRect();
    this.proxy.style.left = `${globalPoint.x - bounds.width / 2}px`;
    this.proxy.style.top = `${globalPoint.y - bounds.height / 2}px`;
  }

  /**
   * cancel / end a drag/drop in progress
   */
  cancelDrag() {
    if (this.proxy) {
      document.body.removeEventListener('mousemove', this.mouseMove);
      document.body.removeEventListener('mouseup', this.mouseUp);
      this.proxy.parentElement.removeChild(this.proxy);
      this.proxy = null;
    }
  }

  // clean up the component
  dispose() {
    this.cancelDrag();
  }

  /**
   * given a mouse event, find the drop target if any at the given location
   */
  findTargetAt(event) {
    const globalPoint = this.mouseToGlobal(event);
    return this.targets.find(element => {
      return this.getDocumentBounds(element).pointInBox(globalPoint);
    });
  }

  /**
   * register a target for drop events
   */
  registerTarget(element) {
    invariant(element, 'expected an element to register');
    invariant(this.targets.indexOf(element) < 0, 'element already registered');
    this.targets.push(element);
  }

  /**
   * unregister a drop target
   */
  unregisterTarget(element) {
    const index = this.targets.indexOf(element);
    invariant(index >= 0, 'element not registered');
    this.targets.splice(index, 1);
  }

  /**
   * return the bounds of the element in document coordinates.
   */
  getDocumentBounds(e) {
    // first get the elements document position.
    invariant(e, 'Bad parameter');
    // use the elements offset + the nearest positioned element, back to the root to find
    // the absolute position of the element
    let element = e;
    let curleft = element.offsetLeft;
    let curtop = element.offsetTop;
    while (element.offsetParent) {
      element = element.offsetParent;
      curleft += element.offsetLeft;
      curtop += element.offsetTop;
    }
    // curLeft, curTop are the position,  now get the viewport size
    const bounds = e.getBoundingClientRect();
    // now we can return the document size
    return new Box2D(curleft, curtop, bounds.width, bounds.height);
  }
  /**
   * x-browser solution for the document coordinates of the given mouse event
   */
  mouseToGlobal(e) {
    // get the position in document coordinates, allowing for browsers that don't have pageX/pageY
    var pageX = e.pageX;
    var pageY = e.pageY;
    if (pageX === undefined) {
      pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return new Vector2D(pageX, pageY);
  }
}

// export the singleton
export default new DnD();
