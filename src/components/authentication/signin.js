import React from 'react';

export default function LoginForm(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <form className="authenticate-form">
        <h1>Sign In</h1>
        <div className="row">
          <label>Email</label>
          <input type="text"/>
        </div>
        <div className="row">
          <label>Password</label>
          <input type="password"/>
        </div>
        <div className="right">
          <button className="button button-primary" type="submit">Sign In</button>
        </div>
      </form>
    </div>
  );
}
