import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Row from './row';
import Selector from './selector';
import Input from './input';
import Checkbox from './checkbox';
import Link from './link';
import Permutations from './permutations';
import debounce from 'lodash.debounce';
import {
  orderSetName,
  orderSetParameters
} from '../../actions/orders';
import OrderParameters from '../../schemas/OrderParameters';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class Page1 extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    orderSetName: PropTypes.func.isRequired,
    orderSetParameters: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
    };
    this.labelChanged = debounce(value => this._labelChanged(value), 500, {leading: false, trailing: true});
  }

  assemblyOptions() {
    return [
      {value: true, label: "All in a single container"},
      {value: false, label: "Each in an individual container"}
    ];
  }

  assemblyContainerChanged = (newValue) => {
    console.log('Assembly Changed:', newValue);
    this.props.orderSetParameters(this.props.order.id, {
      onePot: newValue === 'true',
    });
  }

  _labelChanged = (newLabel) => {
    this.props.orderSetName(this.props.order.id, newLabel);
  }

  numberOfAssembliesChanged = (newValue) => {
    const total = parseInt(newValue);
    this.props.orderSetParameters(this.props.order.id, {
      permutations: Number.isInteger(total) ? Math.min(this.props.constructs.length, Math.max(0, total)) : 1,
    });
  }

  methodOptions() {
    return ['Random Subset', 'Maximum Unique Set', 'All Combinations'].map(item => {
      return {value: item, label: item}
    });
  }

  methodChanged = (newMethod) => {
    this.props.orderSetParameters(this.props.order.id, {
      combinatorialMethod: newMethod,
    });
  }

  sequenceAssemblies = (state) => {
    this.props.orderSetParameters(this.props.order.id, {
      sequenceAssemblies: state,
    });
  }

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (
      <div className="order-page page1">
        <Row text="Label:"
          widget={(<Input
            onChange={this.labelChanged}
            value={this.props.order.metadata.name}/>)}/>
        <Row text="Assembly Containers:"
          widget={<Selector
            value={this.props.order.parameters.onePot}
            options={this.assemblyOptions()}
            onChange={this.assemblyContainerChanged}/>}/>
        <Row text="Number of assemblies:"
          widget={<Permutations
            total={this.props.constructs.length}
            value={this.props.order.parameters.permutations || 1}
            editable={!this.props.order.parameters.onePot}
            onChange={this.numberOfAssembliesChanged}/>}/>
        <Row text="Combinatorial method:"
          widget={<Selector
            value={this.props.order.parameters.combinatorialMethod}
            options={this.methodOptions()}
            onChange={this.methodChanged}/>}/>
        <Row text="After fabrication:"
          widget={<Checkbox
            onChange={this.sequenceAssemblies}
            label="Sequence Assemblies"
            value={this.props.order.parameters.sequenceAssemblies}/>}/>
        <br/>
      </div>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    project: state.projects[props.projectId],
    constructs: props.order.constructs.map(construct => construct.components
                    .map(component => component.componentId)
                    .map(componentId => state.blocks[componentId])),

  }
}

export default connect(mapStateToProps, {
  orderSetName,
  orderSetParameters,
})(Page1);
