import cloneDeep from 'lodash.clonedeep';
import Vector2D from '../geometry/vector2d';
import Node2D from '../scenegraph2d/node2d';


// layout metrics
// height of blocks
const kBlockH = 24;
// width of blocks
const kBlockW = 70;
// width of title
const kTitleW = 200;
// total height of each row
const kRowH = 60;
// row header bar height
const kRowBarH = 3;
// vertical bar width
const kRowBarW = 3;
// padding around text on blocks
const kTextPad = 16;

const kTitleAppearance = {
  fill: 'black',
  color: 'white',
  glyph: 'rectangle',
  strokeWidth: 0,
};

const kRowAppearance = {
  h: kRowBarH,
  fill: 'black',
  glyph: 'rectangle',
  strokeWidth: 0,
};

const kVerticalAppearance = {
  w: kRowBarW,
  fill: 'black',
  glyph: 'rectangle',
  strokeWidth: 0,
};

// display attributes for 'part'
const kPartAppearance = {
  color: 'black',
  glyph: 'rectangle',
  fontWeight: 'bold',
  strokeWidth: 1,
  stroke: 'gray',
};

// display attributes for 'connector'
const kConnectorAppearance = {
  glyph: 'rectangle',
  strokeWidth: 1,
  stroke: 'gray',
  fill: 'whitesmoke',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'gray',
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
    const x = 50;
    const y = 100;
    // maximum x position
    const mx = this.options.width + x;

    // will become this.rows after we are done with the layout
    const newRows = [];

    // create title as neccessary and position
    if (!d.element) {
      d.element = new Node2D(kTitleAppearance);
      this.sceneGraph.root.appendChild(d.element);
    }

    // update title to current position and text
    const tp = this.boxXY(x, y, kTitleW, kBlockH);
    d.element.set({
      x: tp.x,
      y: tp.y,
      w: kTitleW,
      h: kBlockH,
      text: d.name,
    });

    // layout all the various components, constructing elements as required
    // and wrapping when a row is complete

    let xp = x + kRowBarW;
    let yp = y + kBlockH + kRowBarH;

    let row = null;

    d.parts.forEach(p => {
      // create a row bar as neccessary
      if (!row) {
        // re-use existing if possible
        if (this.rows.length) {
          row = this.rows.pop();
        } else {
          row = new Node2D(kRowAppearance);
          this.sceneGraph.root.appendChild(row);
        }

        // position and size
        const rp = this.boxXY(x, yp - kRowBarH, this.options.width, kRowBarH);
        row.set({
          x: rp.x,
          y: rp.y,
          h: kRowBarH,
          w: this.options.width,
        });

        // add to new rows ... which becomes this.rows
        newRows.push(row);
      }

      switch (p.type) {

      case 'part':

        // create element on demand
        if (!p.element) {
          p.element = new Node2D(kPartAppearance);
          this.sceneGraph.root.appendChild(p.element);
        }

        // measure out text
        const td = p.element.measureText(p.text);
        // add padding
        td.x += kTextPad;

        // if position would exceed x limit then wrap
        if (xp + td.x > mx) {
          xp = x + kRowBarW;
          yp += kRowH;
          row = null;
        }

        // update part
        const pp = this.boxXY(xp, yp, td.x, kBlockH);
        p.element.set({
          text: p.text,
          fill: p.color,
          x: pp.x,
          y: pp.y,
          w: td.x,
          h: kBlockH,
        });

        // set next part position
        xp += td.x;
        break;

      case 'connector':
        // create element on demand
        if (!p.element) {
          p.element = new Node2D(kConnectorAppearance);
          this.sceneGraph.root.appendChild(p.element);
        }

        // if position would exceed x limit then wrap
        if (xp + kBlockW > mx) {
          xp = x + kRowBarW;
          yp += kRowH;
          row = null;
        }

        // update part
        const cp = this.boxXY(xp, yp, kBlockW, kBlockH);
        p.element.set({
          text: p.text,
          x: cp.x,
          y: cp.y,
          w: kBlockW,
          h: kBlockH,
        });
        // set next part position
        xp += kBlockW;
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
      this.vertical = new Node2D(kVerticalAppearance);
      this.sceneGraph.root.appendChild(this.vertical);
    }

    // position and size vertical bar
    const vh = (this.rows.length - 1) * kRowH;
    const vp = this.boxXY(x, y + kBlockH, kRowBarW, vh);
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
  boxXY(x, y, w, h) {
    return new Vector2D(x + w / 2, y + h / 2);
  }

}
