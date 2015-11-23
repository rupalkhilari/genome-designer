import invariant from '../../../../utils/environment/invariant';
import { Component } from 'react';
/**
 * base class for all glyphs.
 */
export default class Glyph2D extends Component {

  /**
   * base class for all glyphs
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor(node) {
    invariant(node, 'Expected a parent node');
    super();
    this.nodes = node;
  }

  render() {
    invariant(false, 'Inheriting class must define the render method');
  }
}
