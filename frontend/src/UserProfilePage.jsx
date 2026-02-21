// UserProfilePage.jsx
import React from 'react';
import Nav from './Nav.jsx';

export default function UserProfilePage({ goTo }) {
  return (
    <div className="page">
      <Nav currentPage="groups" goTo={goTo} />
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <div className="card user-profile-card" style={{ padding: 40 }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 24 }}
            onClick={() => goTo('groups')}
          >
            ← Back
          </button>
          <div className="user-profile-avi">🎸</div>
          <div className="user-profile-name">Alex Rivera</div>
          <div className="user-profile-handle">@alexr_music</div>
          <div className="user-profile-bio">
            Huge Tame Impala fan since 2012. Been to 7 shows. Always up for meeting new people before the set! 🎶
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <span className="pill">Psychedelic Rock</span>
            <span className="pill">Indie</span>
            <span className="pill">Electronic</span>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 24 }}>Message</button>
        </div>
      </div>
    </div>
  );
}