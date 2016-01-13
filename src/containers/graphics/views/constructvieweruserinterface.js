import UserInterface from '../scenegraph2d/userinterface';
import { sbol as sbolDragType } from '../../../constants/DragTypes';
import DnD from '../dnd/dnd';

// # of pixels of mouse movement before a drag is triggered.
const dragThreshold = 4;

/**
 * user interface overlay for construct viewer
 */
export default class ConstructViewerUserInterface extends UserInterface {
  constructor(sg) {
    super(sg);
    // register ourselves as a drop target
    DnD.registerTarget(this.el, {
      dragEnter: this.onDragEnter.bind(this),
      dragLeave: this.onDragLeave.bind(this),
      dragOver: this.onDragOver.bind(this),
      drop: this.onDrop.bind(this),
    });
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
      };
    }
    // if no edit then return the right edge of the last block
    const count = this.construct.components.length;
    if (count) {
      return {
        block: this.construct.components[count - 1],
        edge: 'right',
      };
    }
    // construct is empty, we should an insertion point but for now we don't.
    return null;
  }
  /**
   * accessor for the construct in our constructviewer owner
   */
  get construct() {
    return this.constructViewer.props.construct;
  }
  /**
   * mouse down handler
   */
  mouseDown(evt, point) {
    evt.preventDefault();
    const block = this.topBlockAt(point);
    if (block) {
      const node = this.layout.nodeFromElement(block);
      // single select the node and track the mouse
      if (evt.shiftKey) {
        this.addToSelections([node]);
        this.constructViewer.blockAddToSelections([block]);
      } else {
        this.setSelections([node]);
        this.constructViewer.blockSelected([block]);
      }
    }
  }
  /**
   * move drag handler, if the user initiates a drag of a block hand over
   * to the DND manager to handle
   */
  mouseDrag(evt, point, startPoint, distance) {
    if (distance > dragThreshold) {
      // start a block drag if we have one
      const block = this.topBlockAt(startPoint);
      if (block) {
        // cancel our own mouse operations for now
        this.mouseTrap.cancelDrag();
        // get global point as starting point for drag
        const globalPoint = this.mouseTrap.mouseToGlobal(evt);
        // create proxy and drag
        const node = this.layout.nodeFromElement(block);
        // the proxy is actual a clone of scene graphs DOM element.
        const proxy = node.el.cloneNode(true);
        // remove the block
        this.constructViewer.removePart(block);
        // start the drag with the proxy and the removed block as the payload
        DnD.startDrag(proxy, globalPoint, {
          item: block,
        });
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
   * a drag entered the construct viewer
   */
  onDragEnter(globalPoint, payload) {
    this.hideInsertionPoint();
  }
  /**
   * drag left the construct viewer
   */
  onDragLeave() {
    this.hideInsertionPoint();
  }
  /**
   * drag over event
   */
  onDragOver(globalPosition, payload) {
    // convert global point to local space via our mousetrap
    const localPosition = this.mouseTrap.globalToLocal(globalPosition, this.el);
    // there is a different highlight / UX experience depending on what is being dragged
    const { item, type } = payload;
    if (type === sbolDragType) {
      // sbol symbol so we highlight the targeted block
      const block = this.topBlockAt(localPosition);
      if (block) {
        this.showInsertionPointForBlock(block);
      } else {
        this.hideInsertionPoint();
      }
    } else {
      // block, so we highlight the insertion point
      const hit = this.topBlockAndVerticalEdgeAt(localPosition);
      if (hit) {
        this.showInsertionPointForEdge(hit.block, hit.edge);
      } else {
        this.hideInsertionPoint();
      }
    }
  }
  /**
   * user dropped the payload on us at the given position. Defer the insertion
   * to our actual constructViewer which has all the necessary props
   */
  onDrop(globalPosition, payload) {
    this.constructViewer.addItemAtInsertionPoint(payload, this.insertion);
  }
  /**
   * show the insertion point at the given edge of the given block...usually
   * used when dropping a new block(s) into the construct
   */
  showInsertionPointForEdge(block, edge) {
    // create insertion point as necessary
    if (!this.insertionEl) {
      this.insertionEl = document.createElement('div');
      this.insertionEl.className = 'edge-insertion-point';
      this.el.appendChild(this.insertionEl);
    }
    // get node representing this part and its AABB
    const node = this.layout.nodeFromElement(block);
    const AABB = node.getAABB();
    const xposition = edge === 'left' ? AABB.x : AABB.right;
    // position insertion element at the appropriate edge
    this.insertionEl.style.left = (xposition - 1) + 'px';
    this.insertionEl.style.top = (AABB.y - 2) + 'px';

    // save the current insertion point
    this.insertion = {block, node, edge};
  }
 /**
  * show the insertion point over the given block, usually used when dropping
  * an SBOL symbol onto an existing block.
  */
  showInsertionPointForBlock(block, edge) {
    // create insertion point as necessary
    if (!this.insertionEl) {
      this.insertionEl = document.createElement('div');
      this.insertionEl.className = 'block-insertion-point';
      this.el.appendChild(this.insertionEl);
    }
    // get node representing this part and its AABB
    const node = this.layout.nodeFromElement(block);
    const AABB = node.getAABB();
    // position insertion element at the appropriate edge
    this.insertionEl.style.left = AABB.x + 'px';
    this.insertionEl.style.top = AABB.y + 'px';
    this.insertionEl.style.width = AABB.w + 'px';
    this.insertionEl.style.height = AABB.h + 'px';

    // save the current insertion point
    this.insertion = {block, node};
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
