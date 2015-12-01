import React, { Component, PropTypes } from 'react';

export default class UserInterface extends Component {

  static propTypes = {
    style: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    onMouseMove: PropTypes.func.isRequired,
    onMouseUp: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="userInterface" style={this.props.style}
        onMouseDown={this.props.onMouseDown}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}
        />
    );
  }
}
