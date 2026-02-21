// GroupsPage.jsx
import React, { useEffect, useState } from 'react';
import Nav from './Nav.jsx';
import { authRequest } from './api.js';

export default function GroupsPage({ goTo }) {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSavedEvents = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authRequest('/api/events/saved');
      if (!response.ok) {
        throw new Error('Could not load your saved events');
      }

      const payload = await response.json();
      setSavedEvents(payload.events || []);
    } catch {
      setError('Unable to load your saved events right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedEvents();
  }, []);

  const handleRemove = async (ticketmasterId) => {
    try {
      const response = await authRequest(`/api/events/saved/${ticketmasterId}`, 'DELETE');
      if (!response.ok) {
        throw new Error();
      }
      setSavedEvents((prev) => prev.filter((item) => item.ticketmaster_id !== ticketmasterId));
    } catch {
      setError('Could not remove saved event.');
    }
  };

  return (
    <div className="page">
      <Nav currentPage="groups" goTo={goTo} />
      <div className="container">
        <div className="section-title">Your Saved Events</div>
        <div className="section-sub">This list is specific to your account</div>

        {loading && <div className="section-sub">Loading your data…</div>}
        {error && <div className="section-sub">{error}</div>}

        {!loading && !savedEvents.length && !error && (
          <div className="card">
            <div style={{ color: 'var(--muted)' }}>You have no saved events yet. Open Events and save one.</div>
          </div>
        )}

        <div className="event-list-view">
          {savedEvents.map((entry, index) => {
            const ev = entry.event_data || {};
            const key = entry._id || `${entry.ticketmaster_id}-${index}`;
            return (
              <div key={key} className="event-row">
                <div className="event-row-emoji">🎫</div>
                <div className="event-row-info">
                  <div className="event-row-title">{ev.title || 'Untitled Event'}</div>
                  <div className="event-row-meta">{ev.venue || 'Venue TBA'} · {ev.meta || ''}</div>
                </div>
                <div className="event-row-right">
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#f87171', borderColor: '#7f2f2f' }}
                    onClick={() => handleRemove(entry.ticketmaster_id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
