import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm } from '../../actions/ui';
import { userSetUser } from '../../actions/user';
import 'isomorphic-fetch';
import invariant from 'invariant';

/**
 * default visibility and text for error labels
 * @type {Object}
 */
const errors = {

  password1Error:  {
    visible: false,
    text: 'none',
  },
  password2Error:  {
    visible: false,
    text: 'none',
  },
};

class RegisterForm extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = Object.assign({}, errors);
  }

  get password() {
    return this.refs.password.value.trim();
  }
  get passwordConfirm() {
    return this.refs.passwordConfirm.value.trim();
  }

  /**
   * display server errors in the most logical way
   */
  showServerErrors(json) {
    invariant(json && json.message, 'We expected an error message');


    // any unrecognized errors are displayed below the tos
    this.setState({
      password1Error: {
        visible: true,
        text: json.message,
      }
    });
  }
  /**
   * basic validation occurs on client i.e. matching email addresses, Passwords
   * and all required fields present
   */
  clientValidation() {
    // reset all error messages
    const newState = Object.assign({}, errors)
    // parse individual problems and report

    if (!this.password) {
      newState.password1Error = { visible: true, text: 'Please enter a password'};
    }
    if (!this.passwordConfirm || this.password !== this.passwordConfirm) {
      newState.password2Error = { visible: true, text: 'Passwords do not match'};
    }

    // display appropriate errors
    this.setState(newState);
    // return true if there was an error
    return Object.keys(newState).find((key) => {
      return newState[key].visible;
    });
  };
  // on form submission, first perform client side validation then submit
  // to the server if that goes well.
  onSubmit(evt) {
    // submission occurs via REST not form submission
    evt.preventDefault();
    // client side validation first
    if (this.clientValidation()) {
      return;
    }
    // get the API end point
    const endPoint = `${window.location.origin}/auth/reset-password`;

    fetch(endPoint, {
      credentials: 'include', // allow cookies
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'will need email from the URL',
        forgotPasswordHash: 'will need the real hash from the URL',
        newPassword: this.password,
      }),
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.message) {
        this.showServerErrors(json);
        return;
      }
      // success so open the login form
      this.props.uiShowAuthenticationForm('signin')
    })
    .catch((reason) => {
      this.showServerErrors({
        message: 'Unexpected error, please check your connection'
      });
      console.error(`Exception: ${reason.toString()}`);
    });

  }

  render() {
    return (
      <div className="container">
        <form className="authentication-form" onSubmit={this.onSubmit.bind(this)}>
          <div className="title">Reset Password</div>

          <div className={`error ${this.state.password1Error.visible ? 'visible' : ''}`}>{`${this.state.password1Error.text}`}</div>
           <input ref="password" type="password" className="input" placeholder="Password"/>
          <input ref="passwordConfirm" type="password" className="input" placeholder="Confirm Password"/>
          <div className={`error ${this.state.password2Error.visible ? 'visible' : ''}`}>{`${this.state.password2Error.text}`}</div>

          <button type="submit">Reset Password</button>
          <button type="button" onClick={() => {
              this.props.uiShowAuthenticationForm('none');
            }}>Cancel</button>
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
})(RegisterForm);
