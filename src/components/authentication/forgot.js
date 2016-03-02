import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm } from '../../actions/ui';
import 'isomorphic-fetch';
import invariant from 'invariant';

/**
 * default visibility and text for error labels
 * @type {Object}
 */
const errors = {
  emailError: {
    visible: false,
    text: ' ',
  },
};

class ForgotForm extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = Object.assign({}, errors);
  }

  get emailAddress() {
    return this.refs.emailAddress.value.trim();
  }

  // on form submission, first perform client side validation then submit
  // to the server if that goes well.
  onSubmit(evt) {
    // submission occurs via REST not form submission
    evt.preventDefault();
    // reset errors
    this.setState({
      emailError: false,
      text: ' ',
    });

    // get the API end point
    const endPoint = `${window.location.origin}/auth/forgot-password`;

    fetch(endPoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.emailAddress,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.message === "Invalid email") {
        this.setState({
          emailError: {
            visible: true,
            text: 'Unrecognized email address',
          }
        });
        return;
      }
      // close the form
      this.props.uiShowAuthenticationForm('none')
    })
    .catch((reason) => {
      alert('Unexpected error, please check your connection');
      console.error(`Exception: ${reason.toString()}`);
    });

  }

  render() {
    return (
      <div className="container">
        <form className="authentication-form" onSubmit={this.onSubmit.bind(this)}>
          <div className="title">Forgot Password</div>
          <input ref="emailAddress" className="input" placeholder="Registered Email Address"/>
          <div className={`error ${this.state.emailError.visible ? 'visible' : ''}`}>{`${this.state.emailError.text}`}</div>
          <button type="submit">Submit Request</button>
          <button type="button">Cancel</button>
        </form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
})(ForgotForm);
