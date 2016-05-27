import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Row from './row';
import Selector from './selector';
import Input from './input';
import Checkbox from './checkbox';
import Link from './link';

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

  assemblyOptions() {
    return [0,1,2,3,5].map(n => {
      return {value: n, label: `Option ${n}`}
    });
  }

  assemblyContainerChanged = (newValue) => {
    console.log('Assembly Changed:', newValue);
  }

  labelChanged = (newLabel) => {
    console.log('Label Changed:', newLabel);
  }

  contactEmailChanged = (newEmail) => {
    console.log('Email Changed:', newEmail);
  }

  postFabricationChanged = (state) => {
    debugger;
    console.log('Post Fab:', state);
  }

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (
      <div className="order-page page1">
        <Row text="Label:" widget={(<Input onChange={this.labelChanged} value="My Order Label"/>)}/>
        <Row text="Contact Email" widget={(<Input onChange={this.contactEmailChanged} value="duncanmeech@gmail.com"/>)}/>
        <Row text="Assembly Containers:" widget={<Selector options={this.assemblyOptions()} onChange={this.assemblyContainerChanged}/>}/>
        <Row text="Number of assemblies:" widget={(<div>Some text with a <b>bold</b> word</div>)}/>
        <Row text="Combinatorial method:" widget={(<Link href="http://www.autodesk.com" text="Genome Foundry"/>)}/>
        <Row text="After fabrication:" widget={(<Checkbox onChange={this.postFabricationChanged} label="Sequence Assemblies" value={true}/>)}/>
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
