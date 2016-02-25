import React, { Component, PropTypes } from 'react';
import 'isomorphic-fetch';

export default class ResetForm extends Component {

  static propTypes = {

  };

  render() {
    return (
      <div className="container">
        <div className="authentication-form">
          <div className="title">Reset Password</div>
          <input className="input" placeholder="Email Address"/>
          <input className="input" placeholder="Confirm Email Address"/>
          <div className="error">The email addresses do not match</div>
          <button type="submit">Reset</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    );
  }
}
