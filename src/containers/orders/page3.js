import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Row from './row';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class Page3 extends Component {

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
      <div className="order-page page3">
        <Row text="Label:" widget={(<div>Test 1a - Order 1</div>)}/>
        <Row text="Contact Email:" widget={(<div>duncanmeech@gmail.com</div>)}/>
        <Row text="Job ID:" widget={(<div>72764</div>)}/>
        <Row text="Date Sumitted:" widget={(<div>June 1st 2016 10:15am GST</div>)}/>
        <Row text="Sample Size:" widget={(<div>1000 as subset of 9,327,843</div>)}/>
        <Row text="Fabrication Facility:" widget={(<div>McDonalds</div>)}/>
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
})(Page3);
