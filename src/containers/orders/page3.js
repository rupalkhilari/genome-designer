import React, { Component, PropTypes } from 'react';
import Row from './row';

export default class Page3 extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (
      <div className="order-page page3">
        <Row text="Label:">
          <div>Order Label etc on this page.</div>
        </Row>
        <br/>
      </div>
    )
  }
}
