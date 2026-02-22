// EventsPage.jsx
import React, { useEffect, useState } from 'react';
import Nav from './Nav.jsx';

export default function EventsPage({ goTo, onSelectEvent }) {
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({ size: '100' });
        const keyword = search.trim();
        if (keyword) {
          params.set('keyword', keyword);
        }

        const response = await fetch(`/api/events/?${params.toString()}`);
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Could not fetch events: ${response.status} ${text}`);
        }

        const payload = await response.json();
        console.debug('fetched events payload', payload);
        setEvents(payload.events || []);
      } catch (err) {
        console.error('Events fetch failed:', err);
        setError('Unable to load events right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <div className="page">
      <Nav currentPage="events" goTo={goTo} />
      <div className="container">
        <div className="section-title">Events</div>
        <div className="section-sub">Find concerts and connect with fans going to the same show</div>
        {!loading && !error && (
          <div className="section-sub" style={{ marginTop: -10 }}>
            Showing {events.length} events
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search artist or tour name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="event-list-view">
          {loading && <div className="section-sub">Loading events…</div>}
          {error && <div className="section-sub">{error}</div>}
          {!loading && !error && events.length === 0 && (
            <div className="section-sub">No events found.</div>
          )}
          {events.map((ev, i) => (
            <div
              key={ev.ticketmaster_id || i}
              className="event-row"
              onClick={() => onSelectEvent(ev)}
            >
              <div className="event-row-emoji" style={ev.emojiStyle || {}}>
                {ev.emoji || '🎵'}
              </div>
              <div className="event-row-info">
                <div className="event-row-title">{ev.title}</div>
                <div className="event-row-meta">{ev.venue} · {ev.meta}</div>
              </div>
              <div className="event-row-right">
                <span className="pill" style={{ fontSize: '.75rem' }}>
                  {ev.groups ?? 0} groups
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
