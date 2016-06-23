import React, { Component, PropTypes } from 'react';

import '../../styles/updown.css';

export default class UpDown extends Component {

  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.bool.isRequired,
    enabled: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  up = () => {
    const value = Math.min(this.getValue() + 1, this.props.max);
    this.props.onChange(value);
  }
  down = () => {
    const value = Math.max(this.getValue() - 1, this.props.min);
    this.props.onChange(value);
  }

  /**
   * cursor up/down increment / decrement the value within the current range.
   * The default behavior or moving the caret to start/end of text is prevented.
   */
  onKeyDown = (evt) => {
    switch (evt.keyCode) {
      // up arrow
      case 38:
        this.up();
        evt.preventDefault();
        break;
      // down arrow
      case 40:
        this.down();
        evt.preventDefault();
        break;
    }
  }

  /**
   * get the current value of the input, if invalid return this.props.min
   */
  getValue() {
    let val = parseInt(this.refs.updown.value);
    return isNaN(val) || val < this.props.min || val > this.props.max ? this.props.min : val;
  }

  /**
   * when the input is changed fire the change handler
   * if the value has changed. The change is only called with
   * valid numbers between min <= value <= max
   */
  onInputChanged = (evt) => {
    const value = this.getValue();
    if (value !== this.props.value) {
      this.props.onChange(value);
    }
  };

  render() {
    return (
      <div className="updown-container">
        <input
          className="input-updown"
          value={this.props.value}
          ref="updown"
          maxLength={this.props.max.toString().length}
          onKeyDown={this.onKeyDown}
          onChange={this.onInputChanged}
        />
        <div className="updown-spinner">
          <div className="arrow-container">
            <div className="updown-arrows up" onClick={this.up}/>
            <div className="updown-arrows down" onClick={this.down}/>
          </div>
        </div>
      </div>
    )
  }
}
