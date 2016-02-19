import Vector2D from '../geometry/vector2d';
import Box2D from '../geometry/box2d';
import Line2D from '../geometry/line2d';
import Node2D from './node2d';
import kT from '../views/layoutconstants.js';

/**
 * a simple canvas based line class
 */
export default class Line extends Node2D {

  constructor(props) {
    super(Object.assign({
      glyph: 'line',
      line: new Line2D(),
    }, props));
  }

  update() {
    // base class
    const el = Node2D.prototype.update.call(this);

    // width is length of line, height is thickness
    this.width = this.line.len();
    this.height = Math.max(1, this.strokeWidth);

    // mid point of line is our translation
    this.transform.translate = this.line.pointOnLine(0.5);

    // rotation is angle between end points
    this.transform.rotate = this.line.start.angleBetween(this.line.end);

    return el;
  }
}
