import React, { Component, PropTypes } from 'react';

export default class SelectionBox extends Component {

  static propTypes = {
    bounds: PropTypes.object.isRequired,
  }

  render() {
    const style = {
      transform: `translate(${this.props.bounds.x}px, ${this.props.bounds.y}px)`,
      width: this.props.bounds.w + 'px',
      height: this.props.bounds.h + 'px',
    };
    // render DIV with transform, then our glyph, then our text, then our children
    return (
      <div style={style} className="selection-box transform-animated"/>
    );
  }
}
