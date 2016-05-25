import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/ordermodal.css';

class Row extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    widget: PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
    };
  }

  render() {
    return (
      <div className="row">
        <div className="row-left">{this.props.text}</div>
        <div className="row-right">{this.props.widget}</div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Row);
