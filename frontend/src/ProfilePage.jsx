// ProfilePage.jsx
import React from 'react';
import Nav from './Nav.jsx';

export default function ProfilePage({ goTo }) {
  return (
    <div className="page">
      <Nav currentPage="profile" goTo={goTo} />
      <div className="container">
        <div className="section-title">Profile</div>
        <div className="section-sub" style={{ marginBottom: 32 }}>Manage your account</div>

        <div className="profile-header">
          <div className="profile-avi-lg">🎵</div>
          <div>
            <div className="profile-name">Jamie Chen</div>
            <div className="profile-handle">@jamiec · Member since 2024</div>
          </div>
        </div>

        <div className="profile-grid">
          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>Account Info</h3>
            <div className="field">
              <label>Display Name</label>
              <input defaultValue="Jamie Chen" />
            </div>
            <div className="field">
              <label>Username</label>
              <input defaultValue="@jamiec" />
            </div>
            <div className="field">
              <label>Bio</label>
              <textarea defaultValue="Indie music lover. Always looking for concert crew! 🎶" />
            </div>
            <button className="btn btn-primary btn-sm">Save Changes</button>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 20 }}>Security</h3>
            <div className="field">
              <label>Current Password</label>
              <input type="password" placeholder="Enter Current Password" />
            </div>
            <div className="field">
              <label>New Password</label>
              <input type="password" placeholder="Enter New Password" />
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <input type="password" placeholder="Confirm New Password" />
            </div>
            <button className="btn btn-ghost btn-sm">Change Password</button>
            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: '#f87171', borderColor: '#7f2f2f' }}
                onClick={() => goTo('login')}
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