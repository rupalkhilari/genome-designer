import invariant from '../../../../../utils/environment/invariant';
import React, {
  Component,
  PropTypes
} from 'react';
import Glyph2D from '../glyph2d';

export default class Rectangle2D extends Glyph2D {

  /**
   * base class for all glyphs
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor (node) {
    super(node);
  }

  render() {

    const sw = this.props.strokeWidth || 0;
    const style = {
      left: -(sw / 2),
      top: -(sw / 2),
      width: (this.props.w + sw) + 'px',
      height: (this.props.h + sw) + 'px',
      backgroundColor: this.props.fill,
      border: sw ? `${sw}px solid ${this.props.stroke}` : 'none',
    }

    return (
      <div style={style} className="html-glyph"/>
    )
  }
}
