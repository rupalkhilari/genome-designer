import UserInterface from '../scenegraph2d/userinterface';
import { sbol as sbolDragType } from '../../../constants/DragTypes';
import DnD from '../dnd/dnd';
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import kT from './layoutconstants';


// # of pixels of mouse movement before a drag is triggered.
const dragThreshold = 8;
// if within this threshold of a block edge the edge is selected versus
// the entire blocks
const edgeThreshold = 20;

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
      zorder: 0,
    });
  }

  /**
   * select all blocks within the given rectangle
   */
  selectNodesByRectangle(box) {
    const hits = this.sg.findNodesWithin(box);
    const parts = [];
    hits.forEach(node => {
      const element = this.layout.elementFromNode(node);
      if (element) {
        parts.push(element);
      }
    });
    this.constructViewer.blockSelected(parts);
  }

  /**
   * return the top most block at the given local ccordinates
   * @param  {Vector2D} point
   * @return {Part}
   */
  topNodeAt(point) {
    const hits = this.sg.findNodesAt(point);
    // nodes might include anything added to the scenegraph
    // so work backwards in the list and return the first
    // block found
    for (let i = hits.length - 1; i >= 0; i--) {
      if (this.layout.elementFromNode(hits[i])) {
        return hits[i];
      }
    }
    // no hits or no blocks in the hits
    return null;
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
   * return the top most block at the given location and whether the point
   * is closer to the left or right edges ( if within a threshold, otherwise
   * just the block is returned )
   */
  topBlockAndOptionalVerticalEdgeAt(point) {
    const block = this.topBlockAt(point);
    if (block) {
      // get the AABB of the node representing the block
      const node = this.layout.nodeFromElement(block);
      const AABB = node.getAABB();
      let edge = null;
      if ((point.x - AABB.x) < edgeThreshold) {
        edge = 'left';
      }
      if ((point.x - AABB.x) > AABB.width - edgeThreshold) {
        edge = 'right';
      }
      return {block, edge};
    }
    // if no edit then return the right edge of the last block
    const count = this.construct.components.length;
    if (count) {
      return {
        block: this.construct.components[count - 1],
        edge: 'right',
      };
    }
    // construct is empty, we should an insertion point for the construct
    return null;
  }
  /**
   * accessor for the construct in our constructviewer owner
   */
  get construct() {
    return this.constructViewer.props.construct;
  }
  /**
   * mouse enter/leave are used to ensure no block is in the hover state
   */
  mouseEnter(event) {
    this.setHover();
  }
  mouseLeave(event) {
    this.setHover();
  }
  /**
   * set the given block to the hover state
   */
  setHover(block) {
    if (this.hover) {
      this.hover.node.set({
        hover: false,
      });
      this.hover.node.updateBranch();
      this.hover = null;
    }
    if (block) {
      this.hover = {
        block: block,
        node: this.layout.nodeFromElement(block),
      };
      this.hover.node.set({
        hover: true,
      });
      this.hover.node.updateBranch();
    }
  }

  /**
   * mouse move handler ( note, not the same as drag which is with a button held down )
   */
  mouseMove(evt, point) {
    this.setHover(this.topBlockAt(point));
  }
  /**
   * mouse down handler
   */
  mouseDown(evt, point) {
    this.mouseSelect(evt, point);
  }

  /**
   * Might signal the end of fence drag
   */
  mouseUp(evt, point) {
    if (this.fence) {
      // select blocks within the fence
      this.selectNodesByRectangle(Box2D.boxFromPoints([this.fence.start, this.fence.end]));
      this.fence = null;
      this.updateFence();
    }
  }
  /**
   * mouse section can occur by click or when a drag is started so it gets
   * its own method.
   */
  mouseSelect(evt, point) {
    evt.preventDefault();
    const block = this.topBlockAt(point);
    if (block) {
      // select construct when block selected
      this.selectConstruct();
      // if the user clicks a sub component ( ... menu accessor or expand / collapse for example )
      // the clicked block is just added to the selections, otherwise it replaces the selection.
      // Also, if the shift key is used the block is added and does not replace the selection
      let action = 'replace';
      if (evt.shiftKey || window.__shifty ) {
        action = 'add';
      }
      if (evt.metaKey || evt.altKey) {
        action = 'toggle';
      }
      // if they clicked the context menu area, open it
      // for now, open a context menu
      const globalPoint = this.mouseTrap.mouseToGlobal(evt);
      const region = this.getBlockRegion(block, globalPoint);
      switch (region) {

        case 'dots':
        this.constructViewer.openPopup({
          blockPopupMenuOpen: true,
          menuPosition: globalPoint,
        });

        break;

        case 'triangle':
        const node = this.layout.nodeFromElement(block);
        node.showChildren = !node.showChildren;
        this.constructViewer.update();
        // change replace to add if opening the menu
        if (action === 'replace') {
          action = 'add';
        }
        break;
      }
      // perform the final selection action using block
      switch (action) {
        case 'toggle' : this.constructViewer.blockToggleSelected([block]); break;
        case 'add': this.constructViewer.blockAddToSelectionsRange(block, this.selectedElements); break;
        default: this.constructViewer.blockSelected([block]); break;
      }

    } else {
      // select construct if no block clicked and deselect all blocks
      this.constructViewer.blockSelected([]);
      this.constructViewer.constructSelected(this.constructViewer.props.constructId);
    }
  }

  /**
   * selected construct is lighter than unselected constructs
   * @return {[type]} [description]
   */
  update() {
    super.update();
    this.isSelectedConstruct() ? this.lighten() : this.darken();
  }
  /**
   * true if we are the selected construct
   */
  isSelectedConstruct() {
    return this.constructViewer.props.construct.id === this.constructViewer.props.focus.construct;
  }
  /**
   * select the construct if not already selected
   */
  selectConstruct() {
    // select the construct if not already the selected construct ( changing
    // the construct will remove blocks that are not part of the construct from the selections )
    if (this.constructViewer.props.construct.id !== this.constructViewer.props.focus.construct) {
      this.constructViewer.constructSelected(this.constructViewer.props.construct.id);
    }
  }
  /**
   * return an indication of where in the block this point lies.
   * One of ['none', 'main, 'dots']
   */
  getBlockRegion(block, globalPoint) {
    // substract window scrolling from global point to get viewport coordinates
    const vpt = globalPoint.sub(new Vector2D(window.scrollX, window.scrollY));
    // compare against viewport bounds of node representing the block
    const node = this.layout.nodeFromElement(block);
    const box = node.el.getBoundingClientRect();
    // compare to bounds
    if (vpt.x < box.left || vpt.x > box.right || vpt.y < box.top || vpt.y > box.bottom) {
      return 'none';
    }
    // context menu area?
    if (vpt.x >= box.right - kT.contextDotsW) {
      return 'dots';
    }
    // child expander, if present
    if (node.hasChildren) {
      const triSize = 18;     // width / height equilateral triangle, slightly larger than css but makes for a better feel
      const insetX = vpt.x - box.left;
      const insetY = vpt.y - box.top;
      if (insetX < triSize && insetY < triSize) {
        // whatever the x position is ( 0..triSize ), y must be less than trisize - x
        if (insetY <= (triSize - insetX)) {
          return 'triangle';
        }
      }
    }
    // in block but nowhere special
    return 'main';
  }
  /**
   * list of all selected blocks, based on our selected scenegraph blocks
   * @return {[type]} [description]
   */
  get selectedElements() {
    return this.selections.map((node) => {
      return this.layout.elementFromNode(node);
    });
  }
  /**
   * move drag handler, if the user initiates a drag of a block hand over
   * to the DND manager to handle
   */
  mouseDrag(evt, point, startPoint, distance) {
    if (distance > dragThreshold && !this.fence) {
      // start a block drag if we have one
      const block = this.topBlockAt(startPoint);
      // must be dragging a selected block
      if (block) {
        // cancel our own mouse operations for now
        this.mouseTrap.cancelDrag();
        // ensure the block being dragged is selected
        this.constructViewer.blockAddToSelections([block]);
        // get global point as starting point for drag
        const globalPoint = this.mouseTrap.mouseToGlobal(evt);
        // proxy representing 1 ore more blocks
        const proxy = this.makeDragProxy();
        // remove the blocks, unless meta key pressed
        let copying = evt.altKey;
        if (!copying) {
          this.constructViewer.removePartsList(this.selectedElements);
        }
        // start the drag with the proxy and the removed block as the payload
        // and indicate that the source of the drag is another construct viewer
        DnD.startDrag(proxy, globalPoint, {
          item: this.selectedElements,
          source: 'construct-viewer',
          copying: copying,
        });
      }
    } else {
      if (this.fence) {
        // continue with existing fence
        this.fence.end = point.clone();
        this.updateFence();
      } else {
        // check for fence operation starting
        const block = this.topBlockAt(startPoint);
        if (!block) {
          this.fence = {
            start: startPoint.clone(),
          }
        }
      }
    }
  }
  /**
   * update fence rendering or remove
   */
  updateFence() {
    if (this.fence) {
      if (!this.fenceElement) {
        // create fence element on demand
        this.fenceElement = document.createElement('div');
        this.fenceElement.className = 'fence-element';
        this.el.appendChild(this.fenceElement);
      }
      // get a normalized rectangle from the start/end points
      const box = Box2D.boxFromPoints([this.fence.start, this.fence.end]);
      this.fenceElement.style.left = box.x + 'px';
      this.fenceElement.style.top = box.y + 'px';
      this.fenceElement.style.width = box.w + 'px';
      this.fenceElement.style.height = box.h + 'px';
      // intersect with our client bounds
      const bounds = new Box2D(0, 0, 0, 0);

    } else {
      // remove the fence element if we have one
      if (this.fenceElement) {
        this.fenceElement.parentElement.removeChild(this.fenceElement);
        this.fenceElement = null;
      }
    }
  }
  /**
   * make a drag proxy by gathering all the selected blocks into a group ( up to
   * a limit )
   */
  makeDragProxy() {
    // create a div to hold the first five blocks at most
    const div = document.createElement('div');
    div.style.display = 'inline-block';
    div.style.position = 'relative';
    const nodes = this.selectedElements.map(elem => this.layout.nodeFromElement(elem));
    const limit = Math.min(5, nodes.length);
    let x = 0;
    let width = 0;
    let height = 0;
    for (let i = 0; i < limit; i += 1) {
      const node = nodes[i].el;
      const clone = node.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.left = `${x}px`;
      clone.style.top = `0px`;
      clone.style.transform = null;
      clone.style.opacity = (1 / limit) * (limit - i);
      div.appendChild(clone);
      width += node.clientWidth;
      height = Math.max(height, node.clientHeight);
      x += node.clientWidth;
    }
    div.style.width = `${width}px`;
    div.style.height = `${height}px`;
    return div;
  }

  /**
   * a drag entered the construct viewer
   */
  onDragEnter(globalPoint, payload) {
    this.hideEdgeInsertionPoint();
    this.hideBlockInsertionPoint();
    this.selectConstruct();
  }
  /**
   * drag left the construct viewer
   */
  onDragLeave() {
    this.hideEdgeInsertionPoint();
    this.hideBlockInsertionPoint();
  }

  darken() {
    this.sg.darken();
  }

  lighten() {
    this.sg.lighten();
  }
  /**
   * drag over event
   */
  onDragOver(globalPosition, payload) {
    // select construct on drag over
    this.selectConstruct();
    // convert global point to local space via our mousetrap
    const localPosition = this.mouseTrap.globalToLocal(globalPosition, this.el);
    // there is a different highlight / UX experience depending on what is being dragged
    const { type } = payload;
    if (type === sbolDragType) {
      // sbol symbol so we highlight the targeted block
      const hit = this.topBlockAndOptionalVerticalEdgeAt(localPosition);
      if (hit) {
        if (hit.edge) {
          this.showInsertionPointForEdge(hit.block, hit.edge);
        } else {
          this.showInsertionPointForBlock(hit.block);
        }
      } else {
        this.showDefaultInsertPoint();
      }
    } else {
      // block, so we highlight the insertion point
      const hit = this.topBlockAndVerticalEdgeAt(localPosition);
      if (hit) {
        this.showInsertionPointForEdge(hit.block, hit.edge);
      } else {
        this.showDefaultInsertPoint();
      }
    }
  }
  /**
   * user dropped the payload on us at the given position. Defer the insertion
   * to our actual constructViewer which has all the necessary props
   */
  onDrop(globalPosition, payload, event) {
    const blocks = this.constructViewer.addItemAtInsertionPoint(payload, this.insertion, event);
    this.constructViewer.blockSelected(blocks);
    this.constructViewer.constructSelected(this.constructViewer.props.constructId);
  }
  /**
   * show the insertion point at the top left of an empty construct.
   */
  showDefaultInsertPoint() {
    // insertion point may alternate so ensure we remove the block cursor
    this.hideBlockInsertionPoint();
    const point = this.layout.getInitialLayoutPoint();
    this.showInsertionPointForEdgeAt(point.x, point.y);
  }
  /**
   * show the insertion point at the given edge of the given block...usually
   * used when dropping a new block(s) into the construct
   */
  showInsertionPointForEdge(block, edge) {
    // insertion point may alternate so ensure we remove the block cursor
    this.hideBlockInsertionPoint();

    // get node representing this part and its AABB
    const node = this.layout.nodeFromElement(block);
    const AABB = node.getAABB();
    const xposition = edge === 'left' ? AABB.x : AABB.right;
    this.showInsertionPointForEdgeAt(xposition - 1, AABB.y + 1);

    // save the current insertion point
    this.insertion = {block, node, edge};
  }
  /**
   * create and show insertion point for edge at the given position
   */
  showInsertionPointForEdgeAt(x, y) {
    // create insertion point as necessary
    if (!this.insertionEdgeEl) {
      this.insertionEdgeEl = document.createElement('div');
      this.insertionEdgeEl.className = 'edge-insertion-point';
      this.el.appendChild(this.insertionEdgeEl);
    }
    this.insertionEdgeEl.style.left = x + 'px';
    this.insertionEdgeEl.style.top = y + 'px';
  }
 /**
  * show the insertion point over the given block, usually used when dropping
  * an SBOL symbol onto an existing block.
  */
  showInsertionPointForBlock(block, edge) {
    // insertion point may alternate so ensure we remove the block cursor
    this.hideEdgeInsertionPoint();
    // create insertion point as necessary
    if (!this.insertionBlockEl) {
      this.insertionBlockEl = document.createElement('div');
      this.insertionBlockEl.className = 'block-insertion-point';
      this.el.appendChild(this.insertionBlockEl);
    }
    // get node representing this part and its AABB
    const node = this.layout.nodeFromElement(block);
    const AABB = node.getAABB();
    // position insertion element at the appropriate edge
    this.insertionBlockEl.style.left = AABB.x + 'px';
    this.insertionBlockEl.style.top = AABB.y + 'px';
    this.insertionBlockEl.style.width = AABB.w + 'px';
    this.insertionBlockEl.style.height = AABB.h + 'px';

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
  hideBlockInsertionPoint() {
    if (this.insertionBlockEl) {
      this.el.removeChild(this.insertionBlockEl);
      this.insertionBlockEl = null;
    }
    this.insertion = null;
  }
  hideEdgeInsertionPoint() {
    if (this.insertionEdgeEl) {
      this.el.removeChild(this.insertionEdgeEl);
      this.insertionEdgeEl = null;
    }
    this.insertion = null;
  }
}
