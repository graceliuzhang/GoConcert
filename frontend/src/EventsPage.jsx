// EventsPage.jsx
import React, { useState } from 'react';
import Nav from './Nav.jsx';
import { EVENTS } from './data.js';

export default function EventsPage({ goTo, onSelectEvent }) {
  const [search, setSearch] = useState('');

  const filtered = EVENTS.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <Nav currentPage="events" goTo={goTo} />
      <div className="container">
        <div className="section-title">Events</div>
        <div className="section-sub">Find concerts and connect with fans going to the same show</div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍  Search artist or tour name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select>
            <option>Within 25 mi</option>
            <option>Within 50 mi</option>
            <option>Within 100 mi</option>
            <option>Any distance</option>
          </select>
        </div>

        <div className="event-list-view">
          {filtered.map((ev, i) => (
            <div
              key={i}
              className="event-row"
              onClick={() => onSelectEvent(ev)}
            >
              <div className="event-row-emoji" style={ev.emojiStyle}>
                {ev.emoji}
              </div>
              <div className="event-row-info">
                <div className="event-row-title">{ev.title}</div>
                <div className="event-row-meta">{ev.venue} · {ev.meta}</div>
              </div>
              <div className="event-row-right">
                <span className="pill" style={{ fontSize: '.75rem' }}>
                  {ev.groups} groups
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}