
import React, { useState } from 'react';
import { login, register, getMe, setToken } from './api.js';

export default function LoginPage({ onAuthSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseApiError = (payload, currentMode, statusCode) => {
    const detail = payload?.detail;

    if (currentMode === 'login') {
      if ([400, 401, 422].includes(statusCode)) {
        return 'Invalid Credentials';
      }
    }

    if (Array.isArray(detail)) {
      const passwordTooShort = detail.some((item) => {
        const location = Array.isArray(item?.loc) ? item.loc.join('.') : '';
        const type = String(item?.type || '');
        const message = String(item?.msg || '').toLowerCase();

        return (
          location.includes('password')
          && (
            type.includes('too_short')
            || type.includes('min_length')
            || message.includes('at least')
            || message.includes('too short')
          )
        );
      });

      if (currentMode === 'register' && passwordTooShort) {
        return 'password is too short';
      }

      const firstMessage = detail.find((item) => typeof item?.msg === 'string')?.msg;
      if (firstMessage) {
        return firstMessage;
      }
    }

    if (typeof detail === 'string') {
      return detail;
    }

    return 'Authentication failed';
  };

  const readJsonSafe = async (response) => {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        return null;
      }
      return await response.json();
    } catch {
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = mode === 'login'
        ? await login(email, password)
        : await register(email, password);

      const payload = await readJsonSafe(response);

      if (!response.ok) {
        if (!payload) {
          throw new Error('Authentication failed. Check VITE_API_URL and backend service URL.');
        }
        throw new Error(parseApiError(payload, mode, response.status));
      }

      if (!payload?.access_token) {
        throw new Error('Login response was not valid JSON with an access token.');
      }

      const authPayload = payload;
      setToken(authPayload.access_token);

      const meResponse = await getMe();
      if (!meResponse.ok) {
        throw new Error('Could not load user profile');
      }

      const me = await meResponse.json();
      onAuthSuccess(authPayload.access_token, me);
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-wrap">
        <div className="login-logo">GoConcert</div>
        <div className="login-tagline">Find Your Concert Crew</div>
        <div className="field">
          <label>Email</label>
          <input type="text" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <div className="section-sub" style={{ marginBottom: 12 }}>{error}</div>}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading || !email || !password}
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
        <div className="login-footer">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <a onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </a>
        </div>
      </div>
    </div>
  );
}
