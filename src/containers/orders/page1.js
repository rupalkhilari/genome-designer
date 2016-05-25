import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Row from './row';

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
      <div className="order-page page1">
        <Row text="Label:" widget={(<input/>)}/>
        <Row text="Contact Email" widget={(<input/>)}/>
        <Row text="Assembly Containers:" widget={(<div>Value of item 1</div>)}/>
        <Row text="Number of assemblies:" widget={(<div>Value of item 1</div>)}/>
        <Row text="Combinatorial method:" widget={(<div>Value of item 1</div>)}/>
        <Row text="After fabrication:" widget={(<input type="checkbox"/>)}/>
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
