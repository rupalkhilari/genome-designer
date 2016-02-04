import React from 'react';

export default function ResetPassword(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <form className="authenticate-form">
        <h1>Reset Password</h1>
        <div className="row">
          <label>New Password</label>
          <input type="password"/>
        </div>
        <div className="row">
          <label>Confirm Password</label>
          <input type="password"/>
        </div>
        <div className="right">
          <button className="button button-primary" type="submit">Update Password</button>
        </div>
      </form>
    </div>
  );
}
