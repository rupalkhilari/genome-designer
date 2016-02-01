import React , { Component, PropTypes } from 'react';
import 'isomorphic-fetch';

export default class RegisterForm extends Component {

  static propTypes = {
  };

  onSubmit(evt) {
    evt.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    if (email && password) {
      fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
      })
      .then(() => {
        console.log(arguments);
      });
    }
    alert("Register!");
  }

  render() {
    return (
      <div style={{display: 'inline-block'}}>
        <form className="authenticate-form" onSubmit={this.onSubmit.bind(this)}>
          <h1>Register</h1>
          <div className="row">
            <label>Email</label>
            <input ref="email" type="text"/>
          </div>
          <div className="row">
            <label>Password</label>
            <input ref="password" type="password"/>
          </div>
          <div className="right">
            <button className="button button-primary" type="submit">Register</button>
          </div>
        </form>
      </div>
    );
  }
}
