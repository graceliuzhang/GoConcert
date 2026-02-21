// EventDetailPage.jsx
import React, { useState } from 'react';
import Nav from './Nav.jsx';
import { authRequest } from './api.js';

const STATIC_GROUPS = [
  { name: 'Front Row Squad', count: '4/6', status: 'Open', full: false },
  { name: 'Section GA Crew', count: '2/8', status: 'Open', full: false },
  { name: 'Pre-show Drinks Gang', count: '5/5', status: 'Full', full: true },
];

export default function EventDetailPage({ goTo, event, onOpenCreateGroup }) {
  const [saveState, setSaveState] = useState('');

  if (!event) return null;

  const handleSaveEvent = async () => {
    setSaveState('Saving...');
    try {
      const response = await authRequest('/api/events/save', 'POST', {
        ticketmaster_id: event.ticketmaster_id || event.id,
        title: event.title,
        venue: event.venue,
        meta: event.meta,
        url: event.url,
        image: event.image,
      });

      if (!response.ok) {
        throw new Error();
      }

      setSaveState('Saved to your account');
    } catch {
      setSaveState('Unable to save event');
    }
  };

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
          <button className="btn btn-ghost" onClick={handleSaveEvent}>Save Event</button>
          {saveState && <div className="section-sub" style={{ margin: 0 }}>{saveState}</div>}
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