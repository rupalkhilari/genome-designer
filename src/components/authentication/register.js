import React from 'react';

export default function RegisterForm(props) {
  return (
    <div style={{display: 'inline-block'}}>
      <form className="authenticate-form">
        <h1>Register</h1>
        <div className="row">
          <label>Email</label>
          <input type="text"/>
        </div>
        <div className="row">
          <label>Password</label>
          <input type="password"/>
        </div>
        <div className="right">
          <button className="button button-primary" type="submit">Register</button>
        </div>
      </form>
    </div>
  );
}
