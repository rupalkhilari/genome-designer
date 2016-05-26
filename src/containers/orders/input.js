import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/ordermodal.css';

class Input extends Component {

  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    return (
      <input onChange={evt => {
        this.props.onChange(evt.target.value);
      }} defaultValue={this.props.value}/>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Input);
