import cloneDeep from 'lodash.clonedeep';
import Vector2D from '../geometry/vector2d';
import Node2D from '../scenegraph2d/node2d';


// layout metrics
const kBLOCK_H = 24;
const kBLOCK_W = 70;
const kTITLE_W = 200;
const kROW_H = 60;
const kROW_BAR_H = 3;
const kROW_BAR_W = 3;
const kTEXT_PAD = 16;

const kTITLE_APPEARANCE = {
  fill: 'black',
  color: 'white',
  glyph: 'rectangle',
  strokeWidth: 0,
};

const kROW_APPEARANCE = {
  h: kROW_BAR_H,
  fill: 'black',
  glyph: 'rectangle',
  strokeWidth: 0,
};

const kVERTICAL_APPEARANCE = {
  w: kROW_BAR_W,
  fill: 'black',
  glyph: 'rectangle',
  strokeWidth: 0,
};

// display attributes for 'part'
const kPART_APPEARANCE = {
  color: 'black',
  glyph: 'rectangle',
  fontWeight: 'bold',
  strokeWidth: 1,
  stroke: 'gray',
};

// display attributes for 'connector'
const kCONNECTOR_APPEARANCE = {
  color: 'black',
  glyph: 'rectangle',
  strokeWidth: 1,
  stroke: 'gray',
  fill: 'whitesmoke',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'gray'
};

// layout class
export default class Layout {

  constructor(sceneGraph, dataSet, options) {
    this.sceneGraph = sceneGraph;
    this.dataSet = cloneDeep(dataSet);
    this.options = cloneDeep(options || {});
    this.rows = [];
  }

  /**
   * store layout information on our cloned copy of the data, constructing
   * display elements as required
   * @return {[type]} [description]
   */
  update() {

    // shortcut
    const d = this.dataSet;
    // top left of our area to render in
    const x = 20;
    const y = 20;
    // maximum x position
    const mx = this.options.width + x;

    // will become this.rows after we are done with the layout
    let newRows = [];

    // create title as neccessary and position
    if (!d.element) {
      d.element = new Node2D(kTITLE_APPEARANCE);
      this.sceneGraph.root.appendChild(d.element);
    }

    // update title to current position and text
    const tp = this.boxXY(x, y, kTITLE_W, kBLOCK_H);
    d.element.set({
      x: tp.x,
      y: tp.y,
      w: kTITLE_W,
      h: kBLOCK_H,
      text: d.name,
    });

    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete

    let xp = x + kROW_BAR_W;
    let yp = y + kBLOCK_H + kROW_BAR_H;

    let row = null;

    d.parts.forEach(p => {

      // create a row bar as neccessary
      if (!row) {
        // re-use existing if possible
        if (this.rows.length) {
          row = this.rows.pop();
        } else {
          row = new Node2D(kROW_APPEARANCE);
          this.sceneGraph.root.appendChild(row);
        }

        // position and size
        const rp = this.boxXY(x, yp - kROW_BAR_H, this.options.width, kROW_BAR_H);
        row.set({
          x: rp.x,
          y: rp.y,
          h: kROW_BAR_H,
          w: this.options.width,
        });

        // add to new rows ... which becomes this.rows
        newRows.push(row);
      }

      switch (p.type) {

        case 'part':

          // create element on demand
          if (!p.element) {
            p.element = new Node2D(kPART_APPEARANCE);
            this.sceneGraph.root.appendChild(p.element);
          }

          // measure out text
          const td = p.element.measureText(p.text);
          // add padding
          td.x += kTEXT_PAD;

          // if position would exceed x limit then wrap
          if (xp + td.x > mx) {
            xp = x + kROW_BAR_W;
            yp += kROW_H;
            row = null;
          }

          // update part
          const pp = this.boxXY(xp, yp, td.x, kBLOCK_H);
          p.element.set({
            text: p.text,
            fill: p.color,
            x: pp.x,
            y: pp.y,
            w: td.x,
            h: kBLOCK_H,
          });

          // set next part position
          xp += td.x;


        break;

        case 'connector':

          // create element on demand
          if (!p.element) {
            p.element = new Node2D(kCONNECTOR_APPEARANCE);
            this.sceneGraph.root.appendChild(p.element);
          }

          // if position would exceed x limit then wrap
          if (xp + kBLOCK_W > mx) {
            xp = x + kROW_BAR_W;
            yp += kROW_H;
            row = null;
          }

          // update part
          const cp = this.boxXY(xp, yp, kBLOCK_W, kBLOCK_H);
          p.element.set({
            text: p.text,
            x: cp.x,
            y: cp.y,
            w: kBLOCK_W,
            h: kBLOCK_H,
          });

          // set next part position
          xp += kBLOCK_W;


        break;

        default: throw new Error('bad part:' + p.type);
      }

    });

    // cleanup unused rows
    while (this.rows.length) {
      this.sceneGraph.root.removeChild(this.rows.pop());
    }
    this.rows = newRows;

    // show vertical bar
    if (!this.vertical) {
      this.vertical = new Node2D(kVERTICAL_APPEARANCE);
      this.sceneGraph.root.appendChild(this.vertical);
    }

    // position and size vertical bar
    const vh = (this.rows.length - 1) * kROW_H;
    var vp = this.boxXY(x, y + kBLOCK_H, kROW_BAR_W, vh);
    this.vertical.set({
      x: vp.x,
      y: vp.y,
      h: vh,
    });
  }

  /**
   * since elements are positioned via their center. This function
   * simple returns the x/y position for a block given the w/h of the block
   * @param  {number} x
   * @param  {number} y
   * @param  {number} w
   * @param  {number} h
   * @return {Vector2D}
   */
  boxXY(x,y,w,h) {
    return new Vector2D(x + w/2, y + h/2);
  }

}
