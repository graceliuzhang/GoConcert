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

        <div className="profile-header">
          <div className="profile-avi-lg">🎵</div>
          <div>
            <div className="profile-name">{email.split('@')[0]}</div>
            <div className="profile-handle">{email}</div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>Account Info</h3>
            <div className="field">
              <label>Display Name</label>
              <input defaultValue={email.split('@')[0]} />
            </div>
            <div className="field">
              <label>Email</label>
              <input defaultValue={email} />
            </div>
            <div className="field">
              <label>User ID</label>
              <input defaultValue={currentUser?.id || ''} />
            </div>
            <button className="btn btn-primary btn-sm">Save Changes</button>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>Security</h3>
            <div className="field">
              <label>Current Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="field">
              <label>New Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" placeholder="••••••••" />
            </div>
            <button className="btn btn-ghost btn-sm">Change Password</button>
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