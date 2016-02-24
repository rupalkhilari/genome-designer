import React, { Component, PropTypes } from 'react';
import 'isomorphic-fetch';

export default class SignInForm extends Component {

  static propTypes = {

  };

  render() {
    return (
      <div className="container">
        <div className="authentication-form">
          <div className="title">Sign In</div>
          <input className="input" placeholder="Email Address"/>
          <input className="input" placeholder="Password"/>
          <div className="error">Email address or password are not valid</div>
          <div className="checkbox">
            <input type="checkbox"/>
            <span>Keep me signed in</span>
          </div>
          <button type="submit">Sign In</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    );
  }
}
