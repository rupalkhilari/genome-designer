import React from 'react';
import LoginForm from './signin.js';
import RegisterForm from './register.js';
import ResetPasswordForm from './resetpassword.js';
import UpdateCredentialsForm from './updatecredentials.js';
import ForgotPasswordForm from './forgot.js';

import '../../../src/styles/Authentication.css'; //

export default function SignInPage(props) {
  return (
    <div style={{margin: "10rem auto"}}>
      <LoginForm/>
      <RegisterForm/>
      <ResetPasswordForm/>
      <UpdateCredentialsForm/>
      <ForgotPasswordForm/>
    </div>
  );
}
