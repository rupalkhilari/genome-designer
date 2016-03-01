import Glyph2D from '../glyph2d';

export default class LineGlyph2D extends Glyph2D {

  constructor(node) {
    super(node);
    this.el = document.createElement('div');
    this.el.style.position = 'absolute';
    this.el.style.display = 'inline-block';
    this.node.el.appendChild(this.el);
  }

  /**
   * render latest changes
   */
  update() {
    // update size and color
    this.el.style.width = this.node.width + 'px';
    this.el.style.height = this.node.height + 'px';
    this.el.style.backgroundColor = this.node.stroke;
  }
}
