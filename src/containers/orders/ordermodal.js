import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  uiShowOrderForm,
  uiSetGrunt,
} from '../../actions/ui';
import ModalWindow from '../../components/modal/modalwindow';
import Page1 from './page1';
import Page2 from './page2';
import Page3 from './page3';
import NavLeftRight from './nav-left-right';

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
      page: 1,
    };
  }

  onSubmit(evt) {
    evt.preventDefault();
    this.props.uiShowOrderForm(false);
  }

  nav(inc) {
    let page = this.state.page + inc;
    if (page < 1) page = 3;
    if (page > 3) page = 1;
    this.setState({page});
  }

  componentWillReceiveProps(nextProps) {
    // page 1 on opening
    if (!this.props.open && nextProps.open) {
      this.setState({
        page: 1,
      });
    }
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
            <div>
              <Page1 open={this.state.page === 1}/>
              <Page2 open={this.state.page === 2}/>
              <Page3 open={this.state.page === 3}/>
            </div>
            <div className="actions">
              <NavLeftRight onClick={this.nav.bind(this, -1)} left={true} text="Nav Left" visible={this.state.page > 1}/>
              <div className="buttons">
                <button type="submit">Order</button>
                <button
                  type="button"
                  onClick={() => {
                    this.props.uiShowOrderForm(false);
                  }}>Cancel
                </button>
              </div>
              <NavLeftRight onClick={this.nav.bind(this, 1)} left={false} text="Nav Right" visible={this.state.page < 3}/>
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
