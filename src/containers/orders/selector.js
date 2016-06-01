import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/ordermodal.css';

class Selector extends Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <select
        onChange={evt => {
          this.props.onChange(evt.target.value);
        }}
        defaultValue={this.props.value}
      >
        {this.props.options.map(option => {
          return <option value={option.value}>{option.label}</option>
        })}
      </select>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Selector);
