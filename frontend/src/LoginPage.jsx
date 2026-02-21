import React from 'react';

export default function LoginPage({ goTo }) {
  return (
    <div className="page login-page">
      <div className="login-wrap">
        <div className="login-logo">GoConcert</div>
        <div className="login-tagline">Find Your Concert Crew</div>
        <div className="field">
          <label>Username</label>
          <input type="text" placeholder="Enter Username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Enter Password" />
        </div>
        <button className="btn btn-primary" onClick={() => goTo('home')}>
          Sign In
        </button>
        <div className="login-footer">
          Don&apos;t have an account?{' '}
          <a onClick={() => goTo('home')}>Sign up free</a>
        </div>
      </div>
    </div>
  );
}