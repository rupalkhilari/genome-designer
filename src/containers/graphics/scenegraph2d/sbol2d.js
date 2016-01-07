import uuid from 'node-uuid';
import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import Transform2D from '../geometry/transform2d';
import invariant from 'invariant';
import NodeText2D from './nodetext2d';
import ConstructBanner from './glyphs/canvas/constructbanner';
import Node2D from './node2d';
import kT from '../views/layoutconstants.js';

/**
 * basic rectangular node
 */
export default class SBOL2D extends Node2D {

  constructor(props) {
    super(Object.assign({}, props, {
      glyph: 'sbol',
      textAlign: 'left',
      textIndent: kT.textPad,
    }));
  }
  /**
   * mostly for debugging
   * @return {String}
   */
  toString() {
    return `SBOL = glyph:${this.glyph || 'NONE'} text:${this.text || ''}`;
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
    return this.measureText(str).add(new Vector2D(kT.textPad * 3 + kT.sbolIcon, 0));
  }
}
