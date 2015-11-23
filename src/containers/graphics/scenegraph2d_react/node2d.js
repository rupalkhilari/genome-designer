import React, { Component, PropTypes } from 'react';
import Transform2D from '../geometry/transform2d';
import Vector2D from '../geometry/vector2d';
import NodeText2D from './nodetext2d.js';
import Rectangle2D from './glyphs/html/rectangle2d';
import Ellipse2D from './glyphs/svg/ellipse2d';

export default class Node2D extends Component {

  static propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    r: PropTypes.number.isRequired,
    uuid: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    glyph: PropTypes.string,
    scale: PropTypes.number.isRequired,
    fill: PropTypes.string.isRequired,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.number,
  }

  constructor() {
    super();
  }

  render() {
    // cache transform based on x/y/w/h/s
    const key = `${this.props.x},${this.props.y},${this.props.w},${this.props.h},${this.props.scale}`;
    if (this.transformCachedKey !== key) {
      this.transformCachedKey = key;
      // compose our transform
      const T = new Transform2D();
      T.translate = new Vector2D(this.props.x, this.props.y);
      T.rotate = this.props.r;
      T.scale = new Vector2D(this.props.scale, this.props.scale);
      const m2d = T.getTransformationMatrix(this.props.w, this.props.h);
      this.transformCached = m2d.toCSSString();
    }

    // construct our glyph ( if we have one e.g. the root node doesn't have a glyph )
    let glyph;
    switch (this.props.glyph) {
    case 'rectangle':
      glyph = <Rectangle2D key={this.props.uuid} {...this.props}/>;
      break;
    case 'ellipse':
      glyph = <Ellipse2D key={this.props.uuid} {...this.props}/>;
      break;
    default:
      glyph = null;
      break;
    }
    // set width / height via style
    const style = {
      width: this.props.w + 'px',
      height: this.props.h + 'px',
      transform: this.transformCached,
    };
    // render DIV with transform, then our glyph, then our text, then our children
    return (
      <div style={style} className="node">
        {glyph}
        <NodeText2D {...this.props}/>
        {this.props.children}
      </div>
    );
  }
}

Node2D.defaultProps = {
  text: '',
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  scale: 1,
  r: 0,
};
