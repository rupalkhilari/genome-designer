import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { uiShowAuthenticationForm, uiSetGrunt } from '../../actions/ui';
import { userSetUser } from '../../actions/user';
import invariant from 'invariant';
import { login } from '../../middleware/api';

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
    userSetUser: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = Object.assign({}, errors);
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
      }
    });
  }

  // on form submission, first perform client side validation then submit
  // to the server if that goes well.
  onSubmit(evt) {
    // submission occurs via REST not form submission
    evt.preventDefault();

    login(this.emailAddress, this.password)
      .then((json) => {
        if (json.message) {
          this.showServerErrors(json);
          return;
        }
        // set the user
        this.props.userSetUser({
          userid: json.uuid,
          email: json.email,
          firstName: json.firstName,
          lastName: json.lastName,
        });
        // set grunt message with login information
        this.props.uiSetGrunt(`You are now signed in as ${json.firstName} ${json.lastName} ( ${json.email} )`);
        // close the form
        this.props.uiShowAuthenticationForm('none');
      })
      .catch((reason) => {
        this.showServerErrors({
          message: 'Unexpected error, please check your connection'
        });
        console.error(`Exception: ${reason.toString()}`);
      });

  }

  onRegister(evt) {
    evt.preventDefault();
    this.props.uiShowAuthenticationForm('signup');
  }

  render() {
    return (
      <form className="authentication-form" onSubmit={this.onSubmit.bind(this)}>
        <div className="title">Sign In</div>
        <input ref="emailAddress" className="input" placeholder="Email Address"/>
        <input type="password" ref="password" className="input" placeholder="Password"/>
        <div
          className={`error ${this.state.signinError.visible ? 'visible' : ''}`}>{`${this.state.signinError.text}`}</div>
        <button type="submit">Sign In</button>
        <button type="button" onClick={() => {
            this.props.uiShowAuthenticationForm('none');
          }}>Cancel
        </button>

        <a href="/" onClick={this.onRegister.bind(this)}>New Users Register Here</a>
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
  userSetUser,
})(SignInForm);
