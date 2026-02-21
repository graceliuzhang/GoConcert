// GroupsPage.jsx
import React, { useState } from 'react';
import Nav from './Nav.jsx';
import { GROUPS } from './data.js';

function GroupDetail({ group, goToUserProfile }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>{group.emoji} {group.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: '.88rem' }}>
            {group.event} · {group.venue} · {group.date}
          </div>
        </div>
      </div>

      <p style={{ color: 'var(--muted)', fontSize: '.9rem', marginBottom: 24, lineHeight: 1.6 }}>
        {group.desc}
      </p>

      <h4 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 16 }}>
        Members ({group.members.length})
      </h4>

      {group.members.map((m, i) => (
        <div
          className="member-row"
          key={i}
          style={{ cursor: 'pointer' }}
          onClick={goToUserProfile}
        >
          <div className="member-avi" style={{ fontSize: '1.1rem' }}>{m.avi}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: '.9rem' }}>{m.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: '.78rem' }}>{m.handle}</div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: '.75rem' }}>View</button>
        </div>
      ))}

      <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: '#f87171', borderColor: '#7f2f2f' }}
        >
          Leave Group
        </button>
      </div>
    </div>
  );
}

export default function GroupsPage({ goTo, onOpenCreateGroup }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <div className="page">
      <Nav currentPage="groups" goTo={goTo} />
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="section-title">Your Groups</div>
            <div className="section-sub" style={{ margin: 0 }}>Manage your concert crews</div>
          </div>
        </div>

        <div className="groups-layout">
          {/* Sidebar */}
          <div className="card" style={{ padding: 12, alignSelf: 'start' }}>
            {GROUPS.map((g, i) => (
              <div
                key={i}
                className={`group-list-item${selectedIdx === i ? ' selected' : ''}`}
                onClick={() => setSelectedIdx(i)}
              >
                <div className="group-avatar" style={g.avatarStyle}>{g.emoji}</div>
                <div>
                  <div className="group-info-name">{g.name}</div>
                  <div className="group-info-sub">{g.date} · {g.venue}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <GroupDetail
            group={GROUPS[selectedIdx]}
            goToUserProfile={() => goTo('user-profile')}
          />
        </div>
      </div>
    </div>
  );
}