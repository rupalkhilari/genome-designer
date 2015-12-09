import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import Node2D from '../scenegraph2d/node2d';
import kT from './layoutconstants';

/**
 * layout and scene graph manager for the construct viewer
 */
export default class Layout {

  constructor(constructViewer, sceneGraph, options) {
    // we need a construct viewer, a scene graph, a construct and options
    this.constructViewer = constructViewer;
    this.sceneGraph = sceneGraph;
    // set default options
    Object.assign(this, {
      width: 800,
    });
    // prep data structures for layout
    this.rows = [];
    this.nodes2elements = {};
    this.elements2nodes = {};
    this.layoutName = kT.layoutWrap;
  }
  /**
   * setup the bi drectional mapping between nodes / elements
   * @param  {[type]} part    [description]
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  map(part, node) {
    this.nodes2elements[node.uuid] = part;
    this.elements2nodes[part] = node;
  }
  /**
   * return the element from the data represented by the given node uuid
   * @param  {[type]} uuid [description]
   * @return {[type]}      [description]
   */
  elementFromNode(node) {
    return this.nodes2elements[node.uuid];
  }
  /**
   * reverse mapping from anything with an 'uuid' property to a node
   * @param  {[type]} element [description]
   * @return {[type]}         [description]
   */
  nodeFromElement(element) {
    return this.elements2nodes[element];
  }
  /**
   * create a node, if not already created for the given piece.
   * Add to our hash for tracking
   * @param  {[type]} part          [description]
   * @param  {[type]} appearance [description]
   * @return {[type]}            [description]
   */
  elementFactory(part, appearance) {
    if (!this.nodeFromElement(part)) {
      const node = new Node2D(Object.assign({sg: this.sceneGraph}, appearance));
      this.sceneGraph.root.appendChild(node);
      this.map(part, node);
    }
  }
  /**
   * create title as necessary
   * @param  {[type]} part [description]
   * @return {[type]}   [description]
   */
  titleFactory(part) {
    if (!this.nodeFromElement(part)) {
      const node = new Node2D(Object.assign({sg: this.sceneGraph}, kT.titleAppearance));
      this.sceneGraph.root.appendChild(node);
      this.map(part, node);
    }
  }
  /**
   * create the vertical bar as necessary
   * @return {[type]} [description]
   */
  verticalFactory() {
    if (!this.vertical) {
      this.vertical = new Node2D(Object.assign({sg: this.sceneGraph}, kT.verticalAppearance));
      this.sceneGraph.root.appendChild(this.vertical);
    }
  }
  /**
   * create or recycle a row on demand. resetRows
   * should be called whenever the update starts so this method
   * can track which rows are still in play or ready to be disposed.
   * When the update is complete, call disposeRows() to get rid
   * of any unused rows
   * @return {[type]} [description]
   */
  rowFactory(bounds) {
    // re-use existing if possible
    let row = null;
    if (this.rows.length) {
      row = this.rows.shift();
    } else {
      row = new Node2D(Object.assign({sg: this.sceneGraph}, kT.rowAppearance));
      this.sceneGraph.root.appendChild(row);
    }
    // set bounds
    row.set({bounds});

    // save into new rows so we know this row is in use
    this.newRows.push(row);
    return row;
  }
  /**
   * setup an array to track which rows are still being used
   */
  resetRows() {
    this.newRows = [];
  }
  /**
   * dispose and unused rows and move newRows to rows
   */
  disposeRows() {
    // cleanup unused rows
    while (this.rows.length) {
      this.sceneGraph.root.removeChild(this.rows.pop());
    }
    this.rows = this.newRows;
    this.newRows = null;
  }
  /**
   * store layout information on our cloned copy of the data, constructing
   * display elements as required
   * @return {[type]} [description]
   */
  update(construct) {
    this.construct = construct;

    switch (this.layoutName) {
    case kT.layoutWrap:
      this.layoutWrap();
      break;

    case kT.layoutFull:
      this.layoutFull();
      break;

    case kT.layoutWrapCondensed:
      this.layoutWrapCondensed();
      break;

    case kT.layoutFullCondensed:
      this.layoutFullCondensed();
      break;

    default: throw new Error('Not a valid layout algorithms');
    }
  }

  /**
   * set the current layout algorithm
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  layoutAlgorithm(name) {
    this.layoutName = name;
    this.update();
  }

  /**
   * one of several different layout algorithms
   * @return {[type]} [description]
   */
  layoutWrap() {
    this.layout({
      xlimit: this.width + kT.insetX,
      condensed: false,
    });
  }
  layoutWrapCondensed() {
    this.layout({
      xlimit: this.width + kT.insetX,
      condensed: true,
    });
  }
  layoutFull() {
    this.layout({
      xlimit: Number.MAX_VALUE,
      condensed: false,
    });
  }
  layoutFullCondensed() {
    this.layout({
      xlimit: Number.MAX_VALUE,
      condensed: true,
    });
  }

  /**
   * measure the given text or return its condensed size
   */
  measureText(node, str, condensed) {
    if (condensed) {
      return new Vector2D(kT.condensedText, kT.blockH);
    }
    // measure actual text plus some padding
    return node.measureText(str).add(new Vector2D(kT.textPad, 0));
  }

  /**
   * layout, configured with various options:
   * xlimit: maximum x extent
   * @return {[type]} [description]
   */
  layout(layoutOptions) {
    // shortcut
    const ct = this.construct;
    // top left of our area to render in
    const xs = kT.insetX;
    const ys = kT.insetY;
    // maximum x position
    const mx = layoutOptions.xlimit;
    // reset row factory
    this.resetRows();
    // create title as neccessary and position
    this.titleFactory(ct);
    // update title to current position and text
    this.nodeFromElement(ct).set({
      bounds: new Box2D(xs, ys, kT.titleW, kT.blockH),
      text: ct.id,
    });
    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete
    let xp = xs + kT.rowBarW;
    let yp = ys + kT.blockH + kT.rowBarH;

    // used to determine when we need a new row
    let row = null;

    // update / make all the parts
    ct.components.forEach(part => {
      // create a row bar as neccessary
      if (!row) {
        row = this.rowFactory(new Box2D(xs, yp - kT.rowBarH, 0, kT.rowBarH));
      }
      // resize row bar to current row width
      const rw = xp - xs;
      row.set({translateX: xs + rw / 2, width: rw});

      // create element on demand, this should vary by block type, which I don't currently have
      // this.elementFactory(p, p.type === 'part' ? kT.partAppearance : kT.connectorAppearance);
      this.elementFactory(part, kT.partAppearance);

      // measure element text or used condensed spacing
      const td = this.measureText(this.nodeFromElement(part), part, layoutOptions.condensed);

      // if position would exceed x limit then wrap
      if (xp + td.x > mx) {
        xp = xs + kT.rowBarW;
        yp += kT.rowH;
        row = this.rowFactory(new Box2D(xs, yp - kT.rowBarH, this.width, kT.rowBarH));
      }

      // update part
      this.nodeFromElement(part).set({
        bounds: new Box2D(xp, yp, td.x, kT.blockH),
        text: part,
      });

      // set next part position
      xp += td.x;
    });

    // ensure final row has the final row width
    const rw = xp - xs;
    row.set({translateX: xs + rw / 2, width: rw});

    // cleanup any dangling rows
    this.disposeRows();

    // create/show vertical bar
    this.verticalFactory();

    // position and size vertical bar
    const vh = (this.rows.length - 1) * kT.rowH + kT.blockH;
    this.vertical.set({
      bounds: new Box2D(xs, ys + kT.blockH + kT.rowBarH, kT.rowBarW, vh),
    });
  }
}
