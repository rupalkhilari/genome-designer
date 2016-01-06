import invariant from 'invariant';

/**
 * base class for all glyphs.
 */
export default class Glyph2D {

  /**
   * base class for all glyphs
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor(node) {
    invariant(node, 'Expected a parent node');
    this.node = node;
  }

  /**
   * you can't update the base class
   * @return {[type]} [description]
   */
  update() {
    invariant(false, 'Inheriting class must define the render method');
  }
}
