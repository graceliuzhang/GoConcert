// GroupsPage.jsx
import React, { useEffect, useState } from 'react';
import Nav from './Nav.jsx';
import { authRequest } from './api.js';

export default function GroupsPage({ goTo }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [membersByGroup, setMembersByGroup] = useState({});
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');

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

  const loadMembers = async (groupId) => {
    setMembersLoading(true);
    setMembersError('');

    try {
      const response = await authRequest(`/api/groups/${groupId}/members`);
      if (!response.ok) {
        throw new Error('Could not load group members');
      }
      const payload = await response.json();
      setMembersByGroup((prev) => ({
        ...prev,
        [groupId]: payload.members || [],
      }));
    } catch {
      setMembersError('Unable to load group members right now.');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleToggleMembers = async (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
      setMembersError('');
      return;
    }

    setExpandedGroupId(groupId);
    if (!membersByGroup[groupId]) {
      await loadMembers(groupId);
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
            const members = membersByGroup[group.id] || [];
            const isExpanded = expandedGroupId === group.id;
            return (
              <div key={group.id} className="event-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="event-row-emoji">👥</div>
                  <div className="event-row-info" style={{ flex: 1 }}>
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
                  <div className="event-row-right" style={{ display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleToggleMembers(group.id)}
                    >
                      {isExpanded ? 'Hide Members' : 'View Members'}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ color: '#f87171', borderColor: '#7f2f2f' }}
                      onClick={() => handleLeaveGroup(group.id)}
                    >
                      Leave
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 12, paddingLeft: 48 }}>
                    {membersLoading && <div className="section-sub">Loading members...</div>}
                    {membersError && <div className="section-sub">{membersError}</div>}
                    {!membersLoading && !membersError && members.length === 0 && (
                      <div className="section-sub">No members found.</div>
                    )}
                    {!membersLoading && !membersError && members.length > 0 && (
                      <div className="card" style={{ padding: 12 }}>
                        {members.map((member) => (
                          <div key={member.id} style={{ marginBottom: 8 }}>
                            <div style={{ fontWeight: 500 }}>
                              {member.email || 'Unknown user'}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
