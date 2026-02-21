// EventDetailPage.jsx
import React from 'react';
import Nav from './Nav.jsx';

const STATIC_GROUPS = [
  { name: 'Front Row Squad', count: '4/6', status: 'Open', full: false },
  { name: 'Section GA Crew', count: '2/8', status: 'Open', full: false },
  { name: 'Pre-show Drinks Gang', count: '5/5', status: 'Full', full: true },
];

export default function EventDetailPage({ goTo, event, onOpenCreateGroup }) {
  if (!event) return null;

  return (
    <div className="page">
      <Nav currentPage="events" goTo={goTo} />
      <div className="container">
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 20 }}
          onClick={() => goTo('events')}
        >
          ← Back to Events
        </button>

        <div className="event-detail-header">
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{event.emoji}</div>
            <h1>{event.title}</h1>
            <div style={{ color: 'var(--muted)', marginTop: 6, fontSize: '.9rem' }}>
              {event.venue} · {event.meta}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenCreateGroup}>
            + Create Group
          </button>
        </div>

        <div>
          <h3 style={{ marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Groups at this Show
          </h3>
          {STATIC_GROUPS.map((g, i) => (
            <div className="group-row" key={i}>
              <div>
                <div style={{ fontWeight: 500 }}>{g.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '.82rem' }}>
                  {g.count} members · {g.status}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                disabled={g.full}
                style={g.full ? { opacity: .4 } : {}}
              >
                {g.full ? 'Full' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}