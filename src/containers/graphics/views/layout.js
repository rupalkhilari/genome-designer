import Box2D from '../geometry/box2d';
import Vector2D from '../geometry/vector2d';
import Line2D from '../geometry/line2d';
import Node2D from '../scenegraph2d/node2d';
import Role2D from '../scenegraph2d/role2d';
import LineNode2D from '../scenegraph2d/line2d';
import kT from './layoutconstants';
import objectValues from '../../../utils/object/values';
import invariant from 'invariant';

// just for internal tracking of what type of block a node represents.
const blockType = 'block';
const roleType = 'role';

/**
 * layout and scene graph manager for the construct viewer
 */
export default class Layout {

  constructor(constructViewer, sceneGraph, options) {
    // we need a construct viewer, a scene graph, a construct and options
    this.constructViewer = constructViewer;
    this.sceneGraph = sceneGraph;
    // extend this with options
    Object.assign(this, {
      layoutAlgorithm: kT.layoutWrap,
      baseColor: 'white',
      showHeader: true,
      insetX: 0,
      insetY: 0,
      initialRowXLimit: -Infinity,
      rootLayout: true,
    }, options);

    // prep data structures for layout`
    this.rows = [];
    this.nodes2parts = {};
    this.parts2nodes = {};
    this.partTypes = {};
    this.partUsage = {};
    this.nestedLayouts = {};
    this.connectors = {};

    // this reference is incremented for each update. Blocks, lines are given
    // the latest reference whenever they are updated. Any elements without
    // the latest reference at the end of an update are no longer needed and
    // will be removed.
    this.updateReference = 0;
  }

  /**
   * size the scene graph to just accomodate all the nodes that are present.
   * This is only performed for the root layout ( nested constructs should not
   * perform this operation, as per the rootLayout property )
   * @return {[type]} [description]
   */
  autoSizeSceneGraph() {
    if (this.rootLayout) {
      // start with a box at 0,0, to ensure we capture the top left of the view
      // and ensure we at least use the available
      const aabb = this.getBlocksAABB();
      this.sceneGraph.width = Math.max(aabb.right, kT.minWidth);
      this.sceneGraph.height = Math.max(aabb.bottom, kT.minHeight) + kT.bottomPad;
      this.sceneGraph.updateSize();
    }
  }
  /**
   * return the AABB for our block nodes only, including any nested layouts
   */
  getBlocksAABB() {
    // always include top left and available width to anchor the bounds
    let aabb = new Box2D(0, 0, this.sceneGraph.availableWidth, 0);
    // we should only autosize the nodes representing parts
    objectValues(this.parts2nodes).forEach(node => {
      aabb = aabb.union(node.getAABB());
    });
    // add any nested constructs
    objectValues(this.nestedLayouts).forEach(layout => {
      aabb = layout.getBlocksAABB().union(aabb);
    });
    return aabb;
  }

  /**
   * setup the bi drectional mapping between nodes / elements
   * @param  {[type]} part    [description]
   * @param  {[type]} node [description]
   * @return {[type]}      [description]
   */
  map(part, node) {
    this.nodes2parts[node.uuid] = part;
    this.parts2nodes[part] = node;
    this.partTypes[part] = this.isSBOL(part) ? roleType : blockType;
  }
  /**
   * flag the part as currently in use i.e. should be rendered.
   * Parts that are found to be no longer be in use are removed after rendering
   * along with associated nodes
   */
  usePart(part) {
    this.partUsage[part] = this.updateReference;
  }

  /**
   * drop any parts that don't match the current update reference
   * Also drop nodes associated with the part.
   */
  dropParts() {
    const keys = Object.keys(this.partUsage);
    keys.forEach(part => {
      if (this.partUsage[part] < this.updateReference) {
        const node = this.parts2nodes[part];
        if (node) {
          delete this.nodes2parts[node.uuid];
          delete this.parts2nodes[part];
          delete this.partTypes[part];
          delete this.partUsage[part];
          node.parent.removeChild(node);
        }
      }
    });
  }

  /**
   * return the element from the data represented by the given node uuid.
   * This searches this construct and any nested construct to find the part
   */
  elementFromNode(node) {
    let part = this.nodes2parts[node.uuid];
    if (!part) {
      const nestedKeys = Object.keys(this.nestedLayouts);
      for (let i = 0; i < nestedKeys.length && !part; i += 1) {
        part = this.nestedLayouts[nestedKeys[i]].elementFromNode(node);
      }
    }
    return part;
  }
  /**
   * reverse mapping from anything with an 'uuid' property to a node
   * Looks into nested constructs as well.
   */
  nodeFromElement(element) {
    let node = this.parts2nodes[element];
    if (!node) {
      const nestedKeys = Object.keys(this.nestedLayouts);
      for (let i = 0; i < nestedKeys.length && !node; i += 1) {
        node = this.nestedLayouts[nestedKeys[i]].nodeFromElement(element);
      }
    }
    return node;
  }
  /**
   * return an array of {block, node} objects for this layout
   * and all nested layouts.
   */
  allNodesAndBlocks() {
    let list = Object.keys(this.parts2nodes).map(block => {
      return {block, node: this.parts2nodes[block]};
    });
    Object.keys(this.nestedLayouts).forEach(key => {
      list = list.concat(this.nestedLayouts[key].allNodesAndBlocks());
    });
    return list;
  }

  /**
   * create a node, if not already created for the given piece.
   * Add to our hash for tracking
   * @param  {[type]} part          [description]
   * @param  {[type]} appearance [description]
   * @return {[type]}            [description]
   */
  partFactory(part, appearance) {
    let node = this.nodeFromElement(part);
    if (!node) {
      const props = Object.assign({}, {
        dataAttribute: {name: 'nodetype', value: 'block'},
        sg: this.sceneGraph,
      }, appearance);
      props.roleName = this.isSBOL(part) ? this.blocks[part].rules.role : null;
      node = new Role2D(props);
      this.sceneGraph.root.appendChild(node);
      this.map(part, node);
    }
    // hide/or child expand/collapse glyph
    node.set({
      hasChildren: this.hasChildren(part),
    });
    // mark part as in use
    this.usePart(part);
  }
  /**
   * return one of the meta data properties for a part.
   */
  partMeta(part, meta) {
    return this.blocks[part].metadata[meta];
  }

  /**
   * used specified color, or filler color for filler block or light gray
   */
  fillColor(part) {
    const block = this.blocks[part];
    if (block.isFiller()) return '#4B505E';
    return block.metadata.color || 'lightgray';
  }
  /**
   * filler blocks get a special color
   */
  fontColor(part) {
    const block = this.blocks[part];
    if (block.isFiller()) return '#6B6F7C';
    return '#1d222d';
  }

  /**
   * return the property within the rule part of the blocks data
   */
  partRule(part, name) {
    return this.blocks[part].rules[name];
  }

  /**
   * return true if the block appears to be an SBOL symbol
   */
  isSBOL(part) {
    return !!this.blocks[part].rules.role;
  }

  /**
   * return true if the given block has children
   */
  hasChildren(blockId) {
    const block = this.blocks[blockId];
    invariant(block, 'expect to be able to find the block');
    return block.components && block.components.length;
  }

  /**
   * return the first child of the given block or null if it has no children
   */
  firstChild(blockId) {
    const block = this.blocks[blockId];
    invariant(block, 'expect to be able to find the block');
    return block.components && block.components.length ? block.components[0] : null;
  }

  /**
   * return the two nodes that we need to graphically connect to show a connection.
   * The given block is the source block
   */
  connectionInfo(sourceBlockId) {
    const destinationBlockId = this.firstChild(sourceBlockId);
    invariant(destinationBlockId, 'expected a child if this method is called');
    return {
      sourceBlock: this.blocks[sourceBlockId],
      destinationBlock: this.blocks[destinationBlockId],
      sourceNode: this.nodeFromElement(sourceBlockId),
      destinationNode: this.nodeFromElement(destinationBlockId),
    };
  }

  /**
   * return the part ID or if metadata is available use the name property if available.
   * If the part is an SBOL symbol then use the symbol name preferentially
   */
  partName(part) {
    return this.blocks[part].getName();
  }
  /**
   * create the banner / bar for the construct ( contains the triangle )
   * @return {[type]} [description]
   */
  bannerFactory() {
    if (this.showHeader && !this.banner) {
      this.banner = new Node2D({
        sg: this.sceneGraph,
        glyph: 'construct-banner',
        bounds: new Box2D(this.insetX, this.insetY, this.sceneGraph.availableWidth - this.insetX, kT.bannerHeight),
      });
      this.sceneGraph.root.appendChild(this.banner);
    }
    if (this.banner) {
      this.banner.set({
        fill: this.baseColor,
        stroke: this.baseColor,
      });
    }
  }
  /**
   * create title as necessary
   * @param  {[type]} part [description]
   * @return {[type]}   [description]
   */
  titleFactory() {
    if (this.showHeader) {
      if (!this.titleNode) {
        // node that carries the text
        this.titleNode = new Node2D(Object.assign({
          dataAttribute: {name: 'nodetype', value: 'construct-title'},
          sg: this.sceneGraph,
        }, kT.titleAppearance));
        // add the context menu dots
        this.titleNodeDots = new Node2D({
          sg: this.sceneGraph,
          glyph: 'dots',
        });
        this.titleNode.appendChild(this.titleNodeDots);
        this.sceneGraph.root.appendChild(this.titleNode);
      }

      // update title to current position and text and width
      const text = this.construct.getName();
      const width = this.titleNode.measureText(text).x + kT.textPad + kT.contextDotsW;

      this.titleNode.set({
        text: text,
        color: this.baseColor,
        bounds: new Box2D(this.insetX, this.insetY + kT.bannerHeight, width, kT.titleH),
      });

      // set dots to the right of the text
      this.titleNodeDots.set({
        bounds: new Box2D(width - kT.contextDotsW, (kT.titleH - kT.contextDotsH) / 2, kT.contextDotsW, kT.contextDotsH),
        visible: this.titleNode.hover,
        dotColor: this.baseColor,
      });
    }
  }
  /**
   * create the vertical bar as necessary and update its color
   */
  verticalFactory() {
    if (!this.vertical) {
      this.vertical = new Node2D(Object.assign({
        sg: this.sceneGraph,
      }, kT.verticalAppearance));
      this.sceneGraph.root.appendChild(this.vertical);
    }
    this.vertical.set({
      fill: this.baseColor,
    });
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
      row = new Node2D(Object.assign({
        sg: this.sceneGraph,
      }, kT.rowAppearance));
      this.sceneGraph.root.appendChild(row);
    }
    // set bounds and update to current color
    row.set({
      bounds: bounds,
      fill: this.baseColor,
    });

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
   * a map of the extant layout objects, so we can dispose unused ones after layout
   */
  resetNestedConstructs() {
    this.newNestedLayouts = {};
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
   * dispose any nested constructs no longer referenced.
   */
  disposeNestedLayouts() {
    Object.keys(this.nestedLayouts).forEach(key => {
      this.nestedLayouts[key].dispose();
    });
    this.nestedLayouts = this.newNestedLayouts;
  }
  /**
   * store layout information on our cloned copy of the data, constructing
   * display elements as required
   * @return {[type]} [description]
   */
  update(construct, layoutAlgorithm, blocks, currentBlocks, currentConstructId) {
    this.construct = construct;
    this.currentConstructId = currentConstructId;
    this.layoutAlgorithm = layoutAlgorithm;
    this.blocks = blocks;
    this.currentBlocks = currentBlocks;
    this.baseColor = this.construct.metadata.color;

    // regardless of layout algorithm we return the height
    // used to render the construct / nested construct

    let heightUsed = 0;

    switch (this.layoutAlgorithm) {
    case kT.layoutWrap:
      heightUsed = this.layoutWrap();
      break;

    case kT.layoutFull:
      heightUsed = this.layoutFull();
      break;

    case kT.layoutFit:
      heightUsed = this.layoutFit();
      break;

    default: throw new Error('Not a valid layout algorithm');
    }
    // update connections etc after layout
    this.postLayout();

    // auto size scene after layout
    this.autoSizeSceneGraph();

    return heightUsed;
  }

  /**
   * one of several different layout algorithms
   * @return {[type]} [description]
   */
  layoutWrap() {
    return this.layout({
      xlimit: this.sceneGraph.availableWidth - this.insetX - kT.rightPad,
      condensed: false,
    });
  }
  layoutFull() {
    return this.layout({
      xlimit: Number.MAX_VALUE,
      condensed: false,
    });
  }
  layoutFit() {
    return this.layout({
      xlimit: this.sceneGraph.availableWidth - this.insetX,
      condensed: true,
    });
  }
  /**
   */
  measureText(node, str, condensed) {
    return node.getPreferredSize(str, condensed);
  }
  /**
   * return the point where layout of actual blocks begins
   * @return {[type]} [description]
   */
  getInitialLayoutPoint() {
    return new Vector2D(this.insetX + kT.rowBarW, this.insetY + (this.showHeader ? kT.bannerHeight + kT.titleH + kT.rowBarH : kT.rowBarH));
  }
  /**
   * layout, configured with various options:
   * xlimit: maximum x extent
   * @return {[type]} [description]
   */
  layout(layoutOptions) {
    // set the new reference key
    this.updateReference += 1;
    // shortcut
    const ct = this.construct;
    // construct the banner if required
    this.bannerFactory();
    // create and update title
    this.titleFactory();
    // maximum x position
    const mx = layoutOptions.xlimit;
    // reset row factory
    this.resetRows();
    // reset nested constructs
    this.resetNestedConstructs();
    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete
    const initialPoint = this.getInitialLayoutPoint();
    const startX = initialPoint.x;
    let xp = startX;
    const startY = initialPoint.y;
    let yp = startY;

    // used to determine when we need a new row
    let row = null;

    // additional vertical space consumed on every row for nested constructs
    let nestedVertical = 0;

    // width of first row is effected by parent block, so we have to track
    // which row we are on.
    let rowIndex = 0;

    // update / make all the parts
    ct.components.forEach(part => {
      // create a row bar as neccessary
      if (!row) {
        row = this.rowFactory(new Box2D(this.insetX, yp - kT.rowBarH, 0, kT.rowBarH));
      }
      // resize row bar to current row width
      const rowStart = this.insetX;
      const rowEnd = row === 0 ? Math.max(xp, this.initialRowXLimit) : xp;
      const rowWidth = rowEnd - rowStart;
      row.set({translateX: rowStart + rowWidth / 2, width: rowWidth});

      // create the node representing the part
      this.partFactory(part, kT.partAppearance);

      // get the node representing this part and the actual block from the part id.
      const node = this.nodeFromElement(part);
      const block = this.blocks[part];
      const name = this.partName(part);

      // set role part name if any
      node.set({
        roleName: this.isSBOL(part) ? block.rules.role : null,
      });

      // measure element text or used condensed spacing
      const td = this.measureText(node, name, layoutOptions.condensed);

      // if position would exceed x limit then wrap
      if (xp + td.x > mx) {
        xp = startX;
        yp += kT.rowH + nestedVertical;
        nestedVertical = 0;
        row = this.rowFactory(new Box2D(xp, yp - kT.rowBarH, 0, kT.rowBarH));
        rowIndex += 1;
      }

      // update part, including its text and color
      node.set({
        bounds: new Box2D(xp, yp, td.x, kT.blockH),
        text: name,
        fill: this.fillColor(part),
        color: this.fontColor(part),
      });

      // render children ( nested constructs )
      if (this.hasChildren(part) && node.showChildren) {
        // establish the position
        const nestedX = this.insetX + kT.nestedInsetX;
        const nestedY = yp + nestedVertical + kT.blockH + kT.nestedInsetY;
        // get or create the layout object for this nested construct
        let nestedLayout = this.nestedLayouts[part];
        if (!nestedLayout) {
          nestedLayout = this.nestedLayouts[part] = new Layout(this.constructViewer, this.sceneGraph, {
            layoutAlgorithm: this.layoutAlgorithm,
            showHeader: false,
            insetX: nestedX,
            insetY: nestedY,
            rootLayout: false,
          });
        }

        // update base color of nested construct skeleton
        nestedLayout.baseColor = block.metadata.color || this.baseColor;

        // update minimum x extend of first rowH
        nestedLayout.initialRowXLimit = this.getConnectionRowLimit(part);

        // ensure layout has the latest position ( parent may have moved )
        nestedLayout.insetX = nestedX;
        nestedLayout.insetY = nestedY;

        // layout with same options as ourselves
        nestedVertical += nestedLayout.update(
          this.blocks[part],
          this.layoutAlgorithm,
          this.blocks,
          this.currentBlocks,
          this.currentConstructId) + kT.nestedInsetY;

        // remove from old collection so the layout won't get disposed
        // and add to the new set of layouts
        this.newNestedLayouts[part] = nestedLayout;
        delete this.nestedLayouts[part];
      }
      // set next part position
      xp += td.x;
    });

    // ensure final row has the final row width
    if (row) {
      const rowStart = this.insetX;
      const rowEnd = rowIndex === 0 ? Math.max(xp, this.initialRowXLimit) : xp;
      const rowWidth = rowEnd - rowStart;
      row.set({translateX: rowStart + rowWidth / 2, width: rowWidth});
    }

    // cleanup any dangling rows
    this.disposeRows();

    // cleanup and dangling nested constructs
    this.disposeNestedLayouts();

    // drop unused parts and nodes
    this.dropParts();

    // create/show vertical bar
    this.verticalFactory();

    // position and size vertical bar
    const heightUsed = yp - startY + kT.blockH;
    this.vertical.set({
      bounds: new Box2D(this.insetX, startY, kT.rowBarW, heightUsed),
    });
    // filter the selections so that we eliminate those block we don't contain
    let selectedNodes = [];
    if (this.currentBlocks) {
      const containedBlockIds = this.currentBlocks.filter(blockId => {
        return !!this.nodeFromElement(blockId);
      });
      // get nodes for selected blocks
      selectedNodes = containedBlockIds.map(blockId => {
        return this.nodeFromElement(blockId);
      });
    }
    // apply selections to scene graph
    this.sceneGraph.ui.setSelections(selectedNodes);

    // return the height consumed by the layout
    return heightUsed + nestedVertical + kT.rowBarH;
  }

  /**
   * update connections after the layout
   */
  postLayout() {
    // update / make all the parts
    this.construct.components.forEach(part => {
      // render children ( nested constructs )
      if (this.hasChildren(part) && this.nodeFromElement(part).showChildren) {
        // update / create connection
        this.updateConnection(part);
      }
    });
    // dispose dangling connections
    this.disposeConnections();
  }

  // the connector drops from the center of the source part, so the initial
  // row limit for the child is the right edge of this point
  getConnectionRowLimit(sourcePart) {
    const cnodes = this.connectionInfo(sourcePart);
    const sourceRectangle = cnodes.sourceNode.getAABB();
    return sourceRectangle.center.x + kT.rowBarW / 2;
  }
  /**
   * update / create the connection between the part which must be the
   * parent of a nested construct.
   */
  updateConnection(part) {
    const cnodes = this.connectionInfo(part);
    // the source and destination node id's are used to as the cache key for the connectors
    const key = `${cnodes.sourceBlock.id}-${cnodes.destinationBlock.id}`;
    // get or create connection line
    let connector = this.connectors[key];
    if (!connector) {
      const line = new LineNode2D({
        line: new Line2D(new Vector2D(), new Vector2D()),
        strokeWidth: kT.rowBarW,
        sg: this.sceneGraph,
        parent: this.sceneGraph.root,
        dataAttribute: {name: 'connection', value: cnodes.sourceBlock.id},
      });
      connector = {line};
      this.connectors[key] = connector;
    }
    // update connector position
    const sourceRectangle = cnodes.sourceNode.getAABB();
    const destinationRectangle = cnodes.destinationNode.getAABB();
    connector.line.set({
      stroke: this.partMeta(cnodes.sourceBlock.id, 'color'),
      line: new Line2D(sourceRectangle.center, new Vector2D(sourceRectangle.center.x, destinationRectangle.y)),
    });
    // ensure the connectors are always behind the blocks
    connector.line.sendToBack();

    // update its reference
    connector.updateReference = this.updateReference;
  }

  /**
   * remove any connections that are no longer in use
   */
  disposeConnections() {
    Object.keys(this.connectors).forEach(key => {
      const connector = this.connectors[key];
      if (connector.updateReference !== this.updateReference) {
        this.removeNode(connector.line);
        delete this.connectors[key];
      }
    });
  }

  /**
   * remove any nodes we have created from the scenegraph. Recursively remove
   * the nodes of nested constructs as well
   */
  dispose() {
    invariant(!this.disposed, 'Layout already disposed');
    this.disposed = true;
    this.removeNode(this.banner);
    this.removeNode(this.titleNode);
    this.removeNode(this.vertical);
    this.rows.forEach( node => {
      this.removeNode(node);
    });
    Object.keys(this.parts2nodes).forEach(part => {
      this.removeNode(this.parts2nodes[part]);
    });
    Object.keys(this.connectors).forEach(key => {
      this.removeNode(this.connectors[key].line);
    });
    this.disposeNestedLayouts();
  }

  /**
   * remove a node
   */
  removeNode(node) {
    if (node && node.parent) {
      node.parent.removeChild(node);
    }
  }
}
