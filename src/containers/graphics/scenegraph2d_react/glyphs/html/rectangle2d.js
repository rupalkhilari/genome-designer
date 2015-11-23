import React, { PropTypes } from 'react';
import Glyph2D from '../glyph2d';

export default class Rectangle2D extends Glyph2D {

  static propTypes = {
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    fill: PropTypes.string.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }

  /**
   * Simple HTML based rectangle. The only complexity is that we carefully
   * adjust the size to accomodate the stroke ( which is rendered using a border property).
   * HTML borders are either inside or outside the elenent, for compatibility
   * with canvas/svg with make the border straddle the edges.
   * @param {Node2D} node - the node for which we render ourselves
   */
  constructor(node) {
    super(node);
  }

  /**
   * [render description]
   * @return {ReactHTML}
   */
  render() {
    const sw = this.props.strokeWidth || 0;
    const style = {
      left: -(sw / 2),
      top: -(sw / 2),
      width: (this.props.w + sw) + 'px',
      height: (this.props.h + sw) + 'px',
      backgroundColor: this.props.fill,
      border: sw ? `${sw}px solid ${this.props.stroke}` : 'none',
    };

    return (
      <div style={style} className="html-glyph"/>
    );
  }
}
