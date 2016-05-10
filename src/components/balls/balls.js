import React, { Component, PropTypes } from 'react';
import '../../../src/styles/balls.css';

export default class Balls extends Component {

  static propTypes = {
    running: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
  };

  render() {
    if (!this.props.running) {
      return null;
    }
    return (
      <div className="loading-horizontal">
        <div className="loading-ball" style={{backgroundColor: this.props.color}}/>
        <div className="loading-ball" style={{backgroundColor: this.props.color}}/>
        <div className="loading-ball" style={{backgroundColor: this.props.color}}/>
        <div className="loading-ball" style={{backgroundColor: this.props.color}}/>
        <div className="loading-ball" style={{backgroundColor: this.props.color}}/>
      </div>
    );
  }
}
