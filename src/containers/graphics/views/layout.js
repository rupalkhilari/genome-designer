import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import Node2D from '../scenegraph2d/node2d';
import K from './layoutconstants';

/**
 * layout and scene graph manager for the construct viewer
 */
export default class Layout {

  constructor(constructViewer, sceneGraph, construct, options) {
    // we need a construct viewer, a scene graph, a construct and options
    this.constructViewer = constructViewer;
    this.sceneGraph = sceneGraph;
    this.construct = construct;
    // set default options
    Object.assign(this, {
      width: 800,
    });
    // prep data structures for layout
    this.rows = [];
    this.nodes2elements = {};
    this.elements2nodes = {};
    this.layoutName = K.layoutWrap;
  }
  /**
   * setup the bi drectional mapping between nodes / elements
   * @param  {[type]} p    [description]
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  map(p, node) {
    this.nodes2elements[node.uuid] = p;
    this.elements2nodes[p] = node;
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
   * @param  {[type]} p          [description]
   * @param  {[type]} appearance [description]
   * @return {[type]}            [description]
   */
  elementFactory(p, appearance) {
    if (!this.nodeFromElement(p)) {
      const node = new Node2D(Object.assign({sg: this.sceneGraph}, appearance));
      this.sceneGraph.root.appendChild(node);
      this.map(p, node);
    }
  }
  /**
   * create title as necessary
   * @param  {[type]} p [description]
   * @return {[type]}   [description]
   */
  titleFactory(p) {
    if (!this.nodeFromElement(p)) {
      const node= new Node2D(Object.assign({sg: this.sceneGraph}, K.titleAppearance));
      this.sceneGraph.root.appendChild(node);
      this.map(p, node);
    }
  }
  /**
   * create the vertical bar as necessary
   * @return {[type]} [description]
   */
  verticalFactory() {
    if (!this.vertical) {
      this.vertical = new Node2D(Object.assign({sg: this.sceneGraph}, K.verticalAppearance));
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
      row = new Node2D(Object.assign({sg: this.sceneGraph}, K.rowAppearance));
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
  update() {

    switch (this.layoutName) {

      case K.layoutWrap:
      this.layoutWrap();
      break;

      case K.layoutFull:
      this.layoutFull();
      break;

      case K.layoutWrapCondensed:
      this.layoutWrapCondensed();
      break;

      case K.layoutFullCondensed:
      this.layoutFullCondensed();
      break;
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
      xlimit: this.width + K.insetX,
      condensed: false,
    });
  }
  layoutWrapCondensed() {
    this.layout({
      xlimit: this.width + K.insetX,
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
      return new Vector2D(K.condensedText, K.blockH);
    }
    // measure actual text plus some padding
    return node.measureText(str).add(new Vector2D(K.textPad, 0));
  }

  /**
   * layout, configured with various options:
   * xlimit: maximum x extent
   * @return {[type]} [description]
   */
  layout(layoutOptions) {

    // shortcut
    const d = this.construct;
    // top left of our area to render in
    const x = K.insetX;
    const y = K.insetY;
    // maximum x position
    const mx = layoutOptions.xlimit;
    // reset row factory
    this.resetRows();
    // create title as neccessary and position
    this.titleFactory(d);
    // update title to current position and text
    this.nodeFromElement(d).set({
      bounds: new Box2D(x, y, K.titleW, K.blockH),
      text: d.id,
    });
    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete
    let xp = x + K.rowBarW;
    let yp = y + K.blockH + K.rowBarH;

    // used to determine when we need a new row
    let row = null;

    // update / make all the parts
    d.components.forEach(p => {
      // create a row bar as neccessary
      if (!row) {
        row = this.rowFactory(new Box2D(x, yp - K.rowBarH, 0, K.rowBarH));
      }
      // resize row bar to current row width
      const rw = xp - x;
      row.set({translateX: x + rw / 2, width: rw});

      // create element on demand, this should vary by block type, which I don't currently have
      // this.elementFactory(p, p.type === 'part' ? K.partAppearance : K.connectorAppearance);
      this.elementFactory(p, K.partAppearance);

      // measure element text or used condensed spacing
      const td = this.measureText(this.nodeFromElement(p), p, layoutOptions.condensed);

      // if position would exceed x limit then wrap
      if (xp + td.x > mx) {
        xp = x + K.rowBarW;
        yp += K.rowH;
        row = this.rowFactory(new Box2D(x, yp - K.rowBarH, this.width, K.rowBarH));
      }

      // update part
      this.nodeFromElement(p).set({
        bounds: new Box2D(xp, yp, td.x, K.blockH),
        text: p,
        fill: 'whitesmoke',
      });

      // set next part position
      xp += td.x;

    });

    // ensure final row has the final row width
    const rw = xp - x;
    row.set({translateX: x + rw / 2, width: rw});

    // cleanup any dangling rows
    this.disposeRows();

    // create/show vertical bar
    this.verticalFactory();

    // position and size vertical bar
    const vh = (this.rows.length - 1) * K.rowH + K.blockH;
    this.vertical.set({
      bounds: new Box2D(x, y + K.blockH + K.rowBarH, K.rowBarW, vh),
    });
  }
}
