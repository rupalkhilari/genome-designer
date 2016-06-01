import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ConstructPreview from './constructpreview'

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class Page2 extends Component {

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
      <div className="order-page page2">
      <ConstructPreview order={this.props.order} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  };
}

export default connect(mapStateToProps, {
})(Page2);
