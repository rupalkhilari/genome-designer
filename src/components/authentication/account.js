import React, { Component, PropTypes } from 'react';
import 'isomorphic-fetch';

export default class AccountForm extends Component {

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
          <div className="title">Update Account</div>

          <div className="error">Please enter your current password</div>
          <input className="input" type="password" placeholder="Your Current Password"/>
          <br/>
          <input className="input" placeholder="First Name"/>
          <input className="input" placeholder="Last Name"/>
          <div className="error">Please enter a first and last name</div>
          <div className="error">Please enter a valid email address</div>
          <input className="input" placeholder="Email Address"/>
          <input className="input" placeholder="Confirm Email Address"/>
          <div className="error">The email addresses do not match</div>
          <div className="error">Please enter a valid password</div>
           <input className="input" type="password" placeholder="Password"/>
          <input className="input" type="password" placeholder="Confirm Password"/>
          <div className="error">Passwords do not match</div>
          <button type="submit">Update</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    );
  }
}
