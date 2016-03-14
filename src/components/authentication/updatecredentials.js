import React from 'react';

export default function UpdateCredentials(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <form className="authenticate-form">
        <h1>Update Account</h1>
        <div className="row">
          <label>Current Password</label>
          <input type="password"/>
        </div>
        <div className="row">
          <label>New Password</label>
          <input type="password"/>
        </div>
        <div className="row">
          <label>New Email</label>
          <input type="text"/>
        </div>
        <div className="right">
          <button className="button button-primary" type="submit">Update Account</button>
        </div>
      </form>
    </div>
  );
}
