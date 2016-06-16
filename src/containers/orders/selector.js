import React, { Component, PropTypes } from 'react';

import '../../../src/styles/ordermodal.css';

export default class Selector extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.any,
    disabled: PropTypes.bool.isRequired,
  };

  render() {
    const options = this.props.options.map(option => {
      return (
        <option value={option.value}
                key={option.label}>
          {option.label}
        </option>
      );
    });

    return (
      <select onChange={evt => {this.props.onChange(evt.target.value)}}
              defaultValue={this.props.value}
              disabled={this.props.disabled}>
        {this.props.disabled ? null : options}
      </select>
    );
  }
}
