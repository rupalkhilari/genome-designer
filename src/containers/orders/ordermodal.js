import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  uiShowOrderForm,
  uiSetGrunt,
} from '../../actions/ui';
import ModalWindow from '../../components/modal/modalwindow';

import '../../../src/styles/form.css';
import '../../../src/styles/ordermodal.css';

class OrderModal extends Component {

  static propTypes = {
    uiShowOrderForm: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    uiSetGrunt: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
    };
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.uiShowOrderForm(false);
  }

  render() {
    // no render when not open
    if (!this.props.open) {
      return null;
    }

    return (<ModalWindow
      open={this.props.open}
      title="Order DNA"
      closeOnClickOutside
      closeModal={(buttonText) => {
        this.props.uiShowOrderForm(false);
      }}
      payload={
          <form className="gd-form order-form" onSubmit={this.onSubmit.bind(this)}>
            <div className="title">Order DNA</div>
            <div style={{width: '75%', textAlign: 'center'}}>
              <button type="submit">Order</button>
              <button
                type="button"
                onClick={() => {
                  this.props.uiShowOrderForm(false);
                }}>Cancel
              </button>
            </div>
          </form>}

    />);
  }
}

function mapStateToProps(state) {
  return {
    open: state.ui.modals.showOrderForm,
  };
}

export default connect(mapStateToProps, {
  uiShowOrderForm,
  uiSetGrunt,
})(OrderModal);
