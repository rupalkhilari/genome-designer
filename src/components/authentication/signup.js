import React, { Component, PropTypes } from 'react';
import 'isomorphic-fetch';

export default class RegisterForm extends Component {

  static propTypes = {

  };

  // onSubmit(evt) {
  //   evt.preventDefault();
  //   const email = this.refs.email.value;
  //   const password = this.refs.password.value;
  //   if (email && password) {
  //     fetch('http://localhost:3000/api/auth/register', {
  //       method: 'POST',
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({email, password}),
  //     })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((json) => {
  //       this.props.output(JSON.stringify(json, null, 2));
  //     })
  //     .catch((reason) => {
  //       this.props.output(`Exception: ${reason.toString()}`);
  //     });
  //   }
  // }

  render() {
    return (
      <div className="container">
        <div className="authentication-form">
          <div className="title">Sign Up</div>

          <input className="input" placeholder="First Name"/>
          <input className="input" placeholder="Last Name"/>
          <div className="error">Please enter a first and last name</div>
          <div className="error">Please enter an email address</div>
          <input className="input" placeholder="Email Address"/>
          <input className="input" placeholder="Confirm Email Address"/>
          <div className="error">The email addresses do not match</div>
          <div className="error">Please enter a password</div>
           <input className="input" placeholder="Password"/>
          <input className="input" placeholder="Confirm Password"/>
          <div className="error">Passwords do not match</div>
          <div className="checkbox">
            <input type="checkbox"/>
            <span>Please agree to our terms of service</span>
          </div>
          <div className="error">You must agree to the terms of service</div>
          <button type="submit">Sign Up</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    );
  }
}
