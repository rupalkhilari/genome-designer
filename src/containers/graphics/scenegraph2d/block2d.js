import Vector2D from '../geometry/vector2d';
import Node2D from './node2d';
import kT from '../views/layoutconstants.js';

/**
 * basic rectangular node
 */
export default class Block2D extends Node2D {

  constructor(props) {
    super(Object.assign({}, props, {
      glyph: 'rectangle',
    }));
  }
  /**
   * mostly for debugging
   * @return {String}
   */
  toString() {
    return `Block = glyph:${this.glyph || 'NONE'} text:${this.text || ''}`;
  }

  /**
   * get the preferred width / height of this block as condensed or fully expanded
   * @return {[type]} [description]
   */
  getPreferredSize(str, condensed) {
    if (condensed) {
      return new Vector2D(kT.condensedText, kT.blockH);
    }
    // measure actual text plus some padding
    return this.measureText(str).add(new Vector2D(kT.textPad * 2, 0));
  }

  /**
   * overwrite rendering just so we can identify the block for testing.
   */
  update() {
    // base class
    const el = Node2D.prototype.update.call(this);
    // add our uuid as data-testblock for easier testing
    el.setAttribute('data-testblock', this.uuid);
    // return as per base class
    return el;
  }
}
