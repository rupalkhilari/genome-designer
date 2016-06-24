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
  orderSetParameters,
  orderList,
} from '../../actions/orders';
import OrderParameters from '../../schemas/OrderParameters';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

const assemblyOptions = [
  'All in a single container',
  'Each in an individual container',
];

const methodOptions = [
  'Random Subset',
  'Maximum Unique Set',
];


export class Page1 extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    order: PropTypes.object.isRequired,
    orderSetName: PropTypes.func.isRequired,
    orderSetParameters: PropTypes.func.isRequired,
    orderList: PropTypes.func.isRequired,
    blocks: PropTypes.object.isRequired,
    numberConstructs: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    //todo - this should use a transaction + commit, not deboucne like this. See InputSimple
    this.labelChanged = debounce(value => this._labelChanged(value), 500, {leading: false, trailing: true});
  }

  assemblyContainerChanged = (newValue) => {
    const onePot = newValue === assemblyOptions[0];
    this.props.orderSetParameters(this.props.order.id, {
      permutations: this.props.numberConstructs,
      combinatorialMethod: 'Random Subset',
      onePot,
    }, true);
  };

  _labelChanged = (newLabel) => {
    this.props.orderSetName(this.props.order.id, newLabel);
  };

  /**
   * debounced for performance
   */
  numberOfAssembliesChanged = (total) => {
    this.props.orderSetParameters(this.props.order.id, {
      permutations: total,
    }, true);
  }

  methodChanged = (newMethod) => {
    this.props.orderSetParameters(this.props.order.id, {
      combinatorialMethod: newMethod,
    }, true);
  };

  sequenceAssemblies = (state) => {
    this.props.orderSetParameters(this.props.order.id, {
      sequenceAssemblies: state,
    }, true);
  };

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    const { order } = this.props;

    let method = <label>All Combinations</label>;
    if (!order.parameters.onePot) {
      method = (<Selector
                  value={order.parameters.combinatorialMethod}
                  options={methodOptions}
                  onChange={this.methodChanged}
                />)
    }
    return (
      <div className="order-page page1">
        <fieldset disabled={order.isSubmitted()}>
          <Row text="Label:">
            <Input
              onChange={this.labelChanged}
              value={this.props.order.metadata.name}
            />
          </Row>
          <Row text="Assembly Containers:">
            <Selector
              value={assemblyOptions[order.parameters.onePot ? 0 : 1]}
              options={assemblyOptions}
              onChange={(val) => this.assemblyContainerChanged(val)}
            />
          </Row>
          <Row text="Number of assemblies:">
            <Permutations
              total={this.props.numberConstructs}
              value={this.props.order.parameters.permutations}
              editable={!order.parameters.onePot}
              onBlur={(val) => {
                this.numberOfAssembliesChanged(val);
              }}
            />
          </Row>
          <Row text="Combinatorial method:">
            {method}
          </Row>
          <Row text="After fabrication:">
            <Checkbox
              onChange={this.sequenceAssemblies}
              label="Sequence Assemblies"
              value={order.parameters.sequenceAssemblies}
              disabled={order.parameters.onePot}
            />
          </Row>
          <br/>
        </fieldset>
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    blocks: state.blocks,
    numberConstructs: props.order.numberCombinations,
  };
}

export default connect(mapStateToProps, {
  orderSetName,
  orderSetParameters,
  orderList,
})(Page1);
