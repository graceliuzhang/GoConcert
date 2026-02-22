// GroupsPage.jsx
import React, { useEffect, useState } from 'react';
import Nav from './Nav.jsx';
import { authRequest } from './api.js';

export default function GroupsPage({ goTo }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroups = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authRequest('/api/groups/my-groups');
      if (!response.ok) {
        throw new Error('Could not load your groups');
      }

      const payload = await response.json();
      setGroups(payload.groups || []);
    } catch {
      setError('Unable to load your groups right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleLeaveGroup = async (groupId) => {
    if (!confirm('Are you sure you want to leave this group?')) return;

    try {
      const response = await authRequest(`/api/groups/${groupId}/leave`, 'POST');
      if (!response.ok) {
        throw new Error();
      }
      setGroups((prev) => prev.filter((item) => item.id !== groupId));
    } catch {
      setError('Could not leave group.');
    }
  };

  return (
    <div className="page">
      <Nav currentPage="groups" goTo={goTo} />
      <div className="container">
        <div className="section-title">Your Groups</div>
        <div className="section-sub">Groups you've created or joined</div>

        {loading && <div className="section-sub">Loading your groups…</div>}
        {error && <div className="section-sub">{error}</div>}

        {!loading && !groups.length && !error && (
          <div className="card">
            <div style={{ color: 'var(--muted)' }}>
              You haven't joined any groups yet. Browse events and join a group!
            </div>
          </div>
        )}

        <div className="event-list-view">
          {groups.map((group) => {
            return (
              <div key={group.id} className="event-row">
                <div className="event-row-emoji">👥</div>
                <div className="event-row-info">
                  <div className="event-row-title">
                    {group.name}
                    {group.is_creator && (
                      <span style={{ 
                        marginLeft: 8, 
                        fontSize: '.75rem', 
                        color: 'var(--accent)',
                        fontWeight: 'normal'
                      }}>
                        (Creator)
                      </span>
                    )}
                  </div>
                  <div className="event-row-meta">
                    {group.event_title || 'Event'} · {group.current_members}/{group.max_members} members
                    {group.description && ` · ${group.description}`}
                  </div>
                </div>
                <div className="event-row-right">
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#f87171', borderColor: '#7f2f2f' }}
                    onClick={() => handleLeaveGroup(group.id)}
                  >
                    Leave
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
