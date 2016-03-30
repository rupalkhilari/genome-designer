import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import { uiShowAuthenticationForm, uiSetGrunt } from '../../actions/ui';
import invariant from 'invariant';
import { userLogin } from '../../actions/user';
import { getItem, setItem } from '../../middleware/localStorageCache';
/**
 * default visibility and text for error labels
 * @type {Object}
 */
const errors = {
  signinError: {
    visible: false,
    text: 'none',
  },
};

class SignInForm extends Component {

  static propTypes = {
    uiShowAuthenticationForm: PropTypes.func.isRequired,
    uiSetGrunt: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
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

    this.props.userLogin(this.emailAddress, this.password)
      .then(user => {
        // set grunt message with login information
        this.props.uiSetGrunt(`You are now signed in as ${user.firstName} ${user.lastName} ( ${user.email} )`);
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

  onRegister(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signup');
  }

  get emailAddress() {
    return this.refs.emailAddress.value.trim();
  }
  get password() {
    return this.refs.password.value.trim();
  }
  /**
   * display server errors in the most logical way
   */
  showServerErrors(json) {
    invariant(json && json.message, 'We expected an error message');

    // any unrecognized errors are displayed below the tos
    this.setState({
      signinError: {
        visible: true,
        text: json.message,
      },
    });
  }

  render() {
    return (
      <form
        id="auth-signin"
        className="authentication-form"
        onSubmit={this.onSubmit.bind(this)}>
        <div className="title">Sign In</div>
        <input
          ref="emailAddress"
          className="input"
          placeholder="Email Address"/>
        <input
          type="password"
          ref="password"
          className="input"
          placeholder="Password"/>
        <div
          className={`error ${this.state.signinError.visible ? 'visible' : ''}`}>{`${this.state.signinError.text}`}</div>
        <button type="submit">Sign In</button>
        <button
          type="button"
          onClick={() => {
            this.props.uiShowAuthenticationForm('none');
          }}>Cancel</button>
        <a
          href="/"
          onClick={this.onRegister.bind(this)}>New Users Register Here</a>
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
  userLogin,
  push,
})(SignInForm);
