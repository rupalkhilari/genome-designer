import React from 'react';
import LoginForm from './signin.js';
import RegisterForm from './register.js';

import '../../../src/styles/Authentication.css';

export default function LoginPage(props) {
  return (
    <div style={{margin: "10rem auto"}}>
      <LoginForm/>
      <RegisterForm/>
    </div>
  );
}
