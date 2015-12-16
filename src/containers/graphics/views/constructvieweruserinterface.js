import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import UserInterface from '../scenegraph2d/userinterface';
import invariant from '../../../utils/environment/invariant';

/**
 * user interface overlay for construct viewer
 */
export default class ConstructViewerUserInterface extends UserInterface {
  constructor(sg) {
    super(sg);
  }

  /**
   * return the top most block at the given local ccordinates
   * @param  {Vector2D} point
   * @return {Part}
   */
  topNodeAt(point) {
    const hits = this.sg.findNodesAt(point);
    return hits.length ? hits.pop() : null;
  }
  /**
   * return the top most block at a given location
   * @param  {[type]} point [description]
   * @return {[type]}       [description]
   */
  topBlockAt(point) {
    const top = this.topNodeAt(point);
    return top ? this.layout.elementFromNode(top) : null;
  }
  /**
   * return the top most block at the given location and whether the point
   * is closer to the left or right edges
   * @param  {Vector2D} point [description]
   * @return {[type]}       [description]
   */
  topBlockAndVerticalEdgeAt(point) {
    const block = this.topBlockAt(point);
    if (block) {
      // get the AABB of the node representing the block
      const node = this.layout.nodeFromElement(block);
      const AABB = node.getAABB();
      return {
        block: block,
        edge: point.x < AABB.cx ? 'left' : 'right',
      }
    }
    // if here no hit
    return null;
  }
  /**
   * mouse down handler
   */
  mouseDown(point, e) {
    const block = this.topBlockAt(point);
    if (block) {
      const node = this.layout.nodeFromElement(block);
      if (e.shiftKey) {
        this.addToSelections(node);
      } else {
        this.setSelections([node]);
      }
    }
  }
  /**
   * drag events
   * @return {[type]} [description]
   */
  dragEnter() {
    // reset insertion point
    this.insertion = null;
  }
  /**
   * drag over comes with viewport/document relative point. We must convert
   * to our local client coordinates, just like a mouse event
   */
  dragOver(point) {
    const local = this.eventToLocal(point.x, point.y, this.el);
    const hit = this.topBlockAndVerticalEdgeAt(local);
    if (hit) {
      this.showInsertionPoint(hit.block, hit.edge);
    } else {
      this.hideInsertionPoint();
    }
  }
  /**
   * user dragged out of the viewer
   */
  dragLeave() {
    this.hideInsertionPoint();
  }
  /**
   * show the insertion point at the given edge of the given block
   */
  showInsertionPoint(block, edge) {
    // create insertion point as necessary
    if (!this.insertionEl) {
      this.insertionEl = document.createElement('div');
      this.insertionEl.className = 'block-insertion-point';
      this.el.appendChild(this.insertionEl);
    }
    // get node representing this part and its AABB
    const node = this.layout.nodeFromElement(block);
    const AABB = node.getAABB();
    const xposition = edge === 'left' ? AABB.x : AABB.right;
    // position insertion element at the appropriate edge
    this.insertionEl.style.left = (xposition - 4) + 'px';
    this.insertionEl.style.top = (AABB.y - 2) + 'px';

    // save the current insertion point
    this.insertion = {block, node, edge};
  }
  /**
   * return the current insertion point if any
   * @return {[type]} [description]
   */
  getInsertionPoint() {
    return this.insertion;
  }
  /**
   * hide / deletion insertion point element
   */
  hideInsertionPoint() {
    if (this.insertionEl) {
      this.el.removeChild(this.insertionEl);
      this.insertionEl = null;
    }
    this.insertion = null;
  }
}
