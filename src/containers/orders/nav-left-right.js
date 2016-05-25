import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class Page1 extends Component {

  static propTypes = {
    left: PropTypes.bool.isRequired,
    text: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
    };
  }


  render() {

    if (!this.props.visible) {
      return <div className="nav-left-right disabled"/>
    }

    return (
      <div className="nav-left-right" onClick={this.props.onClick}>
        {this.props.left ? <div className="chevron">‹</div> : null}
        <div className="text">{this.props.text}</div>
        {!this.props.left ? <div className="chevron right">›</div> : null}
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
