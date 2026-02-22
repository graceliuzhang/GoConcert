// EventDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import Nav from './Nav.jsx';
import { authRequest } from './api.js';

export default function EventDetailPage({ goTo, event, onOpenCreateGroup, refreshKey }) {
  const [saveState, setSaveState] = useState('');
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const lastFetchTime = useRef(0);

  // Load groups whenever event changes OR refreshKey changes
  useEffect(() => {
    if (event?.ticketmaster_id) {
      loadGroups();
    }
  }, [event?.ticketmaster_id, refreshKey]);

  // Auto-refresh groups every 10 seconds when on this page
  useEffect(() => {
    if (!event?.ticketmaster_id) return;

    const interval = setInterval(() => {
      loadGroups(true);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [event?.ticketmaster_id]);

  const loadGroups = async (forceRefresh = false) => {
    // Prevent duplicate fetches within 1 second
    const now = Date.now();
    if (!forceRefresh && now - lastFetchTime.current < 1000) {
      return;
    }
    lastFetchTime.current = now;

    setLoading(true);
    try {
      // Add cache-busting parameter to force fresh data
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/groups/event/${event.ticketmaster_id}?_t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      if (response.ok) {
        const data = await response.json();
        console.log(`📊 Loaded ${data.groups?.length || 0} groups for event ${event.ticketmaster_id}`);
        setGroups(data.groups || []);
      }
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadGroups(true);
    setRefreshing(false);
  };

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
        latitude: event.latitude,
        longitude: event.longitude,
      });

      if (!response.ok) {
        throw new Error();
      }

      setSaveState('Saved to your account');
    } catch {
      setSaveState('Unable to save event');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await authRequest(`/api/groups/${groupId}/join`, 'POST');
      if (response.ok) {
        await loadGroups(); // Reload groups to update counts
        alert('Successfully joined group!');
      } else {
        const data = await response.json();
        alert(data.detail || 'Failed to join group');
      }
    } catch (err) {
      alert('Failed to join group');
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

        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={onOpenCreateGroup}>
            + Create Group
          </button>
          <button className="btn btn-ghost" onClick={handleSaveEvent}>
            Save Event
          </button>
          <button className="btn btn-ghost" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Groups'}
          </button>
          {saveState && <div className="section-sub" style={{ margin: 0 }}>{saveState}</div>}
        </div>

        <div>
          <h3 style={{ marginBottom: 16, fontFamily: "'Playfair Display', serif" }}>
            Groups at this Show
          </h3>
          {loading && <div className="section-sub">Loading groups...</div>}
          {!loading && groups.length === 0 && (
            <div className="card">
              <div style={{ color: 'var(--muted)' }}>
                No groups yet. Be the first to create one!
              </div>
            </div>
          )}
          {groups.map((g) => (
            <div className="group-row" key={g.id}>
              <div>
                <div style={{ fontWeight: 500 }}>{g.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: '.82rem' }}>
                  {g.current_members}/{g.max_members} members · {g.is_full ? 'Full' : 'Open'}
                  {g.description && ` · ${g.description}`}
                </div>
              </div>
              <button
                className="btn btn-ghost btn-sm"
                disabled={g.is_full}
                style={g.is_full ? { opacity: .4 } : {}}
                onClick={() => handleJoinGroup(g.id)}
              >
                {g.is_full ? 'Full' : 'Join'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}