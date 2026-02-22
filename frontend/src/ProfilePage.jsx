// ProfilePage.jsx
import React from 'react';
import Nav from './Nav.jsx';

export default function ProfilePage({ goTo, currentUser, onSignOut }) {
  const email = currentUser?.email || 'unknown@user.com';

  return (
    <div className="page">
      <Nav currentPage="profile" goTo={goTo} />
      <div className="container">
        <div className="section-title">Profile</div>
        <div className="section-sub" style={{ marginBottom: 32 }}>Manage your account</div>

        <div className="profile-grid" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="card" style={{ maxWidth: 900, width: '100%' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>Account Info</h3>
            <div className="field">
              <label>Display Name</label>
              <div>{email.split('@')[0]}</div>
            </div>
            <div className="field">
              <label>Email</label>
              <div>{email}</div>
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea placeholder="Tell us about yourself..." style={{ minHeight: 100, fontFamily: "'DM Sans', sans-serif", padding: 8, border: '1px solid var(--border)', borderRadius: 8, backgroundColor: 'var(--input-bg)' }} />
            </div>
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: '#f87171', borderColor: '#7f2f2f' }}
                onClick={onSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}