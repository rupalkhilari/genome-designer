import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';
import Transform2D from '../geometry/transform2d';
import Node2D from './node2d.js';

export default class Node2DText extends Component {

  /**
   * base class
   */
  constructor (props) {
    super(props);
  }

  render() {

    const style = {
      width: this.props.w + 'px',
      color: this.props.color || 'black',
      fontWeight: this.props.fontWeight || 'normal',
      fontSize: this.props.fontSize || '13px',
    }

    return (
      <div style={style} className="nodetext">{this.props.text}</div>
    );
  }
}
