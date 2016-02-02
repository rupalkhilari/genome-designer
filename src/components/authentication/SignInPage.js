import React , { Component, PropTypes } from 'react';
import LoginForm from './signin.js';
import RegisterForm from './register.js';
import ResetPasswordForm from './resetpassword.js';
import UpdateCredentialsForm from './updatecredentials.js';
import ForgotPasswordForm from './forgot.js';

import '../../../src/styles/Authentication.css'; //

export default class SignInPage extends Component {

  output(msg) {
    this.refs.output.innerHTML = msg;
  }

  render() {
    return (
      <div style={{margin: "10rem auto"}}>
        <LoginForm/>
        <RegisterForm output={this.output.bind(this)}/>
        <ResetPasswordForm/>
        <UpdateCredentialsForm/>
        <ForgotPasswordForm/>
        <textarea cols="50" rows="10" ref="output"/>
      </div>
    );
  }
}
