import Glyph2D from '../glyph2d';

import kT from '../../../views/layoutconstants';
import symbols from '../../../../../inventory/sbol';

export default class SBOLGlyph2D extends Glyph2D {

  /**
   * represents a block with, possibly an SBOL symbol and a context menu
   * that is shown only on hover.
   */
  constructor(node) {
    super(node);
    // basic div block
    this.el = document.createElement('div');
    this.el.className = 'sbol-glyph';
    // possible sbol symbol
    this.img = document.createElement('img');
    this.img.className = 'sbol-icon';
    this.img.setAttribute('src', '/images/sbolSymbols/terminator.svg');
    this.el.appendChild(this.img);
    // possible child indicator
    this.triangle = document.createElement('div');
    this.triangle.className = 'nw-triangle';
    this.el.appendChild(this.triangle);
    // add our outer container to the node element
    this.node.el.appendChild(this.el);
  }

  /**
   * render latest changes //
   */
  update() {
    // basic rectangle
    const sw = this.node.strokeWidth;
    this.el.style.left = -(sw / 2) + 'px';
    this.el.style.top = -(sw / 2) + 'px';
    this.el.style.width = (this.node.width + sw) + 'px';
    this.el.style.height = (this.node.height + sw) + 'px';
    this.el.style.backgroundColor = this.node.fill;
    this.el.style.border = sw ? `${sw}px solid ${this.node.stroke}` : 'none';
    if (this.node.sbolName) {
      const symbol = symbols.find(symbol => symbol.id === this.node.sbolName);
      if (symbol) {
        // the icon img tag
        this.img.style.left = (this.node.width - kT.sbolIcon - 2 - kT.contextDotsW) + 'px';
        this.img.style.maxWidth = kT.sbolIcon + 'px';
        this.img.style.top = (this.node.height / 2 - kT.sbolIcon / 2) + 'px';

        const svgPath = symbol.images.thickDark;
        if (this.img.getAttribute('src') !== svgPath) {
          this.img.setAttribute('src', svgPath);
        }
        this.img.style.display = 'block';
      }
    } else {
      this.img.style.display = 'none';
    }
    this.triangle.style.display = this.node.hasChildren ? 'block' : 'none';
    this.triangle.style.borderTopColor = this.node.showChildren ? 'white' : '#292D40';
  }
}
