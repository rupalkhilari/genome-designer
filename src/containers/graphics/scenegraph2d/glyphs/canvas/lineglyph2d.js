import Glyph2D from '../glyph2d';

import kT from '../../../views/layoutconstants';
import symbols from '../../../../../inventory/sbol';


export default class LineGlyph2D extends Glyph2D {

  /**
   * simple canvas line
   */
  constructor(node) {
    super(node);
    super(node);
    this.el = document.createElement('canvas');
    this.el.className = 'canvas-glyph';
    this.node.el.appendChild(this.el);
    this.ctx = this.el.getContext('2d');
  }

  /**
   * render latest changes
   */
  update() {
    // update size
    debugger;
    // TODO, get line end points into local space and it should work
    this.el.width = this.node.width;
    this.el.height = this.node.height;
    // draw horizontal line
    this.ctx.strokeStyle = this.node.stroke;
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(this.node.width, 0);
    this.ctx.stroke();
  }
}
