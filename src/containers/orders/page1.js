import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class Page1 extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  constructor() {
    super();
    this.state = {
    };
  }


  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (
      <div className="order-page">
        <p>Page 1</p>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Page1);
