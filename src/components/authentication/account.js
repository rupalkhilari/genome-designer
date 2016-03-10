import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm, uiSetGrunt } from '../../actions/ui';
import { userSetUser } from '../../actions/user';
import invariant from 'invariant';

/**
 * default visibility and text for error labels
 * @type {Object}
 */
const errors = {
  currentPasswordError: {
    visible: false,
    text: 'none',
  },
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

class AccountForm extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
    uiSetGrunt: PropTypes.func.isRequired,
    userSetUser: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
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
    // get the API end point
    const endPoint = `${window.location.origin}/auth/update-all`;

    // most fields are optional except the current password
    const payload = {password: this.currentPassword};
    if (this.firstName) {
      payload.firstName = this.firstName;
    }
    if (this.lastName) {
      payload.lastName = this.lastName;
    }
    if (this.emailAddress) {
      payload.email = this.emailAddress;
    }
    if (this.password) {
      payload.newPassword = this.password;
    }

    fetch(endPoint, {
      credentials: 'include', // allow cookies
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      if (json.message) {
        this.showServerErrors(json);
        return;
      }
      const email = json.email || this.props.user.email;
      const firstName = json.firstName || this.props.user.firstName;
      const lastName = json.lastName || this.props.user.lastName;

      // set the user
      this.props.userSetUser({
        userid: json.uuid,
        email: email,
        firstName: firstName,
        lastName: lastName,
      });
      // show grunt
      this.props.uiSetGrunt(`Account updated to ${firstName} ${lastName} ( ${email} )`);

      // close the form
      this.props.uiShowAuthenticationForm('none');
    })
    .catch((reason) => {
      this.showServerErrors({
        message: 'Unexpected error, please check your connection',
      });
    });
  }

  /**
   * most fields are optional except current password. If password or email are supplied
   * the confirmation field must match.
   */
  clientValidation() {
    // reset all error messages
    const newState = Object.assign({}, errors);

    // parse individual problems and report
    if (!this.currentPassword) {
      newState.currentPasswordError = { visible: true, text: 'Please enter your current password'};
    }

    if (this.emailAddress && this.emailAddress !== this.emailConfirm) {
      newState.email2Error = { visible: true, text: 'Email addresses do not match'};
    }

    if (this.password && this.password !== this.passwordConfirm) {
      newState.password2Error = { visible: true, text: 'Passwords do not match'};
    }

    // display appropriate errors
    this.setState(newState);
    // return true if there was an error
    return Object.keys(newState).find((key) => {
      return newState[key].visible;
    });
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
    if (json.message === 'Authentication Failure') {
      this.setState({
        currentPasswordError: {
          visible: true,
          text: 'Incorrect password',
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
  get currentPassword() {
    return this.refs.currentPassword.value.trim();
  }
  get password() {
    return this.refs.password.value.trim();
  }
  get passwordConfirm() {
    return this.refs.passwordConfirm.value.trim();
  }

  render() {
    return (
      <form id="account-form" className="authentication-form" onSubmit={this.onSubmit.bind(this)}>
        <div className="title">Update Account</div>

        <input ref="currentPassword" type="password" className="input" placeholder="Current Password"/>
        <div className={`error ${this.state.currentPasswordError.visible ? 'visible' : ''}`}>{`${this.state.currentPasswordError.text}`}</div>

        <input ref="firstName" className="input" placeholder="First Name" defaultValue={this.props.user.firstName}/>
        <input ref="lastName" className="input" placeholder="Last Name" defaultValue={this.props.user.lastName}/>
        <div className={`error ${this.state.nameError.visible ? 'visible' : ''}`}>{`${this.state.nameError.text}`}</div>

        <div className={`error ${this.state.email1Error.visible ? 'visible' : ''}`}>{`${this.state.email1Error.text}`}</div>
        <input ref="emailAddress" className="input" placeholder="Email Address" defaultValue={this.props.user.email}/>
        <input ref="emailConfirm" className="input" placeholder="Confirm Email Address" defaultValue={this.props.user.email}/>
        <div className={`error ${this.state.email2Error.visible ? 'visible' : ''}`}>{`${this.state.email2Error.text}`}</div>

        <div className={`error ${this.state.password1Error.visible ? 'visible' : ''}`}>{`${this.state.password1Error.text}`}</div>
        <input ref="password" type="password" className="input" placeholder="Password"/>
        <input ref="passwordConfirm" type="password" className="input" placeholder="Confirm Password"/>
        <div className={`error ${this.state.password2Error.visible ? 'visible' : ''}`}>{`${this.state.password2Error.text}`}</div>

        <button type="submit">Update Account</button>
        <button type="button" onClick={() => {
          this.props.uiShowAuthenticationForm('none');
        }}>Cancel</button>
      </form>
    );
  }
}
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps, {
  uiShowAuthenticationForm,
  uiSetGrunt,
  userSetUser,
})(AccountForm);
