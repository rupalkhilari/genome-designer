import React, { Component, PropTypes } from 'react';

export default class Node2DText extends Component {
  static propTypes = {
    w: PropTypes.number.isRequired,
    text: PropTypes.string,
    color: PropTypes.string,
    fontWeight: PropTypes.string,
    fontSize: PropTypes.string,
  }
  /**
   * base class
   */
  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      width: this.props.w + 'px',
      color: this.props.color || 'black',
      fontWeight: this.props.fontWeight || 'normal',
      fontSize: this.props.fontSize || '13px',
    };

    return (
      <div style={style} className="nodetext">{this.props.text}</div>
    );
  }
}
