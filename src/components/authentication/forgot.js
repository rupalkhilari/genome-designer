import React from 'react';

export default function ForgotPasswordForm(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <form className="authenticate-form">
        <h1>Reset Password Request</h1>
        <div className="row">
          <label>Email Address</label>
          <input type="text"/>
        </div>
        <div className="right">
          <button className="button button-primary" type="submit">Send Request</button>
        </div>
      </form>
    </div>
  );
}
