import invariant from '../../../utils/environment/invariant';
import React, { Component, PropTypes } from 'react';

export default class UserInterface extends React.Component {

  render() {
    return (
      <div className="userInterface"
        onMouseDown={this.props.onMouseDown}
        onMouseMove={this.props.onMouseMove}
        onMouseUp={this.props.onMouseUp}
        />
    );
  }
}
