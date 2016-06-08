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
          <div>{this.props.order.metadata.name}</div>
        </Row>
        <Row text="Job ID:">
          <div>{this.props.order.isSubmitted()}</div>
        </Row>
        <Row text="Date Submitted:">
          <div>{new Date(this.props.order.status.timeSent).toUTCString()}</div>
        </Row>
        <Row text="Method:">
          <div>{this.props.order.parameters.onePot ? 'All in a single container' : 'Each in an individual container'}</div>
        </Row>
        <Row text="After Fabrication:">
          <div>{this.props.order.parameters.sequenceAssemblies ? 'Sequence' : 'Do Not Sequence'}</div>
        </Row>
        <br/>
      </div>
    )
  }
}
