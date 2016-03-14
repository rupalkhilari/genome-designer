import React, { Component } from 'react';
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
    const container = {
      display: 'flex',
      marginTop: '3rem',
      alignItems: 'top',
      width: '90%',
      flexWrap: 'wrap',
      justifyContent: 'center',
      overflowY: 'scroll',
    };

    return (
      <div style={container}>
        <LoginForm/>
        <RegisterForm output={this.output.bind(this)}/>
        <ResetPasswordForm/>
        <UpdateCredentialsForm/>
        <ForgotPasswordForm/>
        <textarea cols="50" style={{height: '10rem'}} ref="output"/>
      </div>
    );
  }
}
