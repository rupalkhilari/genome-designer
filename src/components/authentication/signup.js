import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm, uiSetGrunt } from '../../actions/ui';
import { push } from 'react-router-redux';
import { userRegister } from '../../actions/user';
import invariant from 'invariant';
import { getItem, setItem } from '../../middleware/localStorageCache';

/**
 * default visibility and text for error labels
 * @type {Object}
 */
const errors = {
  nameError: {
    visible: false,
    text: 'none',
  },
  email1Error: {
    visible: false,
    text: 'none',
  },
  email2Error: {
    visible: false,
    text: 'none',
  },
  password1Error: {
    visible: false,
    text: 'none',
  },
  password2Error: {
    visible: false,
    text: 'none',
  },
  tosError: {
    visible: false,
    text: 'none',
  },
};

class RegisterForm extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
    uiSetGrunt: PropTypes.func.isRequired,
    userRegister: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = Object.assign({}, errors);
  }

  // on form submission, first perform client side validation then submit
  // to the server if that goes well.
  onSubmit(evt) {
    // submission occurs via REST not form submission
    evt.preventDefault();
    // client side validation first
    if (this.clientValidation()) {
      return;
    }

    this.props.userRegister({
      email: this.emailAddress,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
    })
    .then((json) => {
      // close the form
      this.props.uiShowAuthenticationForm('none');
      this.props.push(`/project/${getItem('mostRecentProject') || 'test'}`);
    })
    .catch((reason) => {
      const defaultMessage = 'Unexpected error, please check your connection';
      const { message = defaultMessage } = reason;
      this.showServerErrors({
        message,
      });
    });
  }

  onSignIn(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signin');
  }

  // syntactic suger for fetcing values from inputs
  get firstName() {
    return this.refs.firstName.value.trim();
  }
  get lastName() {
    return this.refs.lastName.value.trim();
  }
  get emailAddress() {
    return this.refs.emailAddress.value.trim();
  }
  get emailConfirm() {
    return this.refs.emailConfirm.value.trim();
  }
  get password() {
    return this.refs.password.value.trim();
  }
  get passwordConfirm() {
    return this.refs.passwordConfirm.value.trim();
  }
  get tos() {
    return this.refs.tos.checked;
  }

  /**
   * display server errors in the most logical way
   */
  showServerErrors(json) {
    invariant(json && json.message, 'We expected an error message');
    if (json.path === 'email' && json.type === 'unique violation') {
      this.setState({
        email1Error: {
          visible: true,
          text: 'That email address is already registered',
        },
      });
      return;
    }
    if (json.message === 'password minimum length not met') {
      this.setState({
        password1Error: {
          visible: true,
          text: 'Passwords must be at least 6 characters',
        },
      });
      return;
    }
    if (json.message === 'email domain is missing suffix' || json.message === 'email address is not valid') {
      this.setState({
        email1Error: {
          visible: true,
          text: 'Email address is not valid',
        },
      });
      return;
    }

    // any unrecognized errors are displayed below the tos
    this.setState({
      tosError: {
        visible: true,
        text: json.message,
      },
    });
  }
  /**
   * basic validation occurs on client i.e. matching email addresses, Passwords
   * and all required fields present
   */
  clientValidation() {
    // reset all error messages
    const newState = Object.assign({}, errors);
    // parse individual problems and report
    if (!this.firstName || !this.lastName) {
      newState.nameError = { visible: true, text: 'Please enter a first and last name'};
    }
    if (!this.emailAddress) {
      newState.email1Error = { visible: true, text: 'Please enter an email address'};
    }
    if (!this.emailConfirm || this.emailAddress !== this.emailConfirm) {
      newState.email2Error = { visible: true, text: 'Email addresses do not match'};
    }
    if (!this.password) {
      newState.password1Error = { visible: true, text: 'Please enter a password'};
    }
    if (!this.passwordConfirm || this.password !== this.passwordConfirm) {
      newState.password2Error = { visible: true, text: 'Passwords do not match'};
    }
    if (!this.tos) {
      newState.tosError = { visible: true, text: 'Please agree to our terms of service'};
    }
    // display appropriate errors
    this.setState(newState);
    // return true if there was an error
    return Object.keys(newState).find((key) => {
      return newState[key].visible;
    });
  }

  render() {
    const tos = 'http://www.autodesk.com/company/legal-notices-trademarks/terms-of-service-autodesk360-web-services';
    const privacy = 'http://www.autodesk.com/company/legal-notices-trademarks/privacy-statement';

    return (
      <form id="auth-signup" className="gd-form authentication-form" onSubmit={this.onSubmit.bind(this)}>
        <div className="title">Sign Up</div>

        <input
          ref="firstName"
          className="input"
          placeholder="First Name"/>
        <input
          ref="lastName"
          className="input"
          placeholder="Last Name"/>
        <div className={`error ${this.state.nameError.visible ? 'visible' : ''}`}>{`${this.state.nameError.text}`}</div>
        <div className={`error ${this.state.email1Error.visible ? 'visible' : ''}`}>{`${this.state.email1Error.text}`}</div>
        <input
          ref="emailAddress"
          className="input"
          placeholder="Email Address"/>
        <input
          ref="emailConfirm"
          className="input"
          placeholder="Confirm Email Address"/>
        <div className={`error ${this.state.email2Error.visible ? 'visible' : ''}`}>{`${this.state.email2Error.text}`}</div>
        <div className={`error ${this.state.password1Error.visible ? 'visible' : ''}`}>{`${this.state.password1Error.text}`}</div>
         <input
           ref="password"
           maxLength={32}
           type="password"
           className="input"
           placeholder="Password"/>
        <input
          ref="passwordConfirm"
          maxLength={32}
          type="password"
          className="input"
          placeholder="Confirm Password"/>
        <div className={`error ${this.state.password2Error.visible ? 'visible' : ''}`}>{`${this.state.password2Error.text}`}</div>
        <div className="checkbox">
          <input
            ref="tos"
            type="checkbox"/>
          <span>Please agree to the
            <a
              target="_blank"
              href={tos}> Terms of Service</a>
            <br/>and
            <a
              target="_blank"
              href={privacy}> Autodesk Privacy Statement</a>
          </span>
        </div>
        <div className={`error ${this.state.tosError.visible ? 'visible' : ''}`}>{`${this.state.tosError.text}`}</div>
        <button type="submit">Sign Up</button>
        <button
          type="button"
          onClick={() => {
            this.props.uiShowAuthenticationForm('none');
          }}>Cancel</button>
        <a
          href="/"
          onClick={this.onSignIn.bind(this)}>Existing Users Sign In Here</a>
      </form>
    );
  }
}
function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
  uiSetGrunt,
  userRegister,
  push,
})(RegisterForm);
