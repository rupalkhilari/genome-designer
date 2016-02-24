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
          <div className="error">Email address is not registered.</div>
          <button type="submit">Submit Request</button>
          <button type="button">Cancel</button>
        </div>
      </div>
    );
  }
}
