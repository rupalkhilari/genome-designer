import Glyph2D from '../glyph2d';
import kT from '../../../views/layoutconstants';


export default class SBOLGlyph2D extends Glyph2D {

  /**
   * Simple HTML based rectangle. The only complexity is that we carefully
   * adjust the size to accomodate the stroke ( which is rendered using a border property).
   * HTML borders are either inside or outside the elenent, for compatibility
   * with canvas/svg with make the border straddle the edges.
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor(node) {
    super(node);
    this.el = document.createElement('div');
    this.el.className = 'sbol-glyph';
    this.img = document.createElement('img');
    this.img.className = 'sbol-icon';
    this.img.setAttribute('src', '/images/sbolSymbols/terminator.svg');
    this.el.appendChild(this.img);
    this.node.el.appendChild(this.el);

    let svgPath = '/images/sbolSymbols/';
    
    switch (this.node.sbolName.toLowerCase()) {
      case 'cds': svgPath += 'cds.svg'; break;
      case 'insulator': svgPath += 'insulator.svg'; break;
      case 'operator': svgPath += 'operator.svg'; break;
      case 'origin of replication': svgPath += 'originReplication.svg'; break;
      case 'promoter': svgPath += 'promoter.svg'; break;
      case 'protease': svgPath += 'protease.svg'; break;
      case 'protein stability': svgPath += 'proteinstability.svg'; break;
      case 'rbs': svgPath += 'rbs.svg'; break;
      case 'ribonuclease': svgPath += 'ribonuclease.svg'; break;
      case 'rna stability': svgPath += 'rnaStability.svg'; break;
      case 'terminator': svgPath += 'terminator.svg'; break;
    }
    this.img.setAttribute('src', svgPath);

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
    // the icon img tag
    this.img.style.left = (this.node.width - kT.sbolIcon - 2) + 'px';
    this.img.style.maxWidth = kT.sbolIcon + 'px';
    this.img.style.top = (this.node.height / 2 - kT.sbolIcon / 2) + 'px';
  }
}
