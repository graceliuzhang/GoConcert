// CreateGroupModal.jsx
import React, { useState } from 'react';
import { authRequest } from './api.js';

export default function CreateGroupModal({ isOpen, onClose, onConfirm, event }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert('Please enter a group name');
      return;
    }
    
    if (!event) {
      alert('No event selected');
      return;
    }

    setSubmitting(true);
    try {
      const response = await authRequest('/api/groups/', 'POST', {
        event_id: event.ticketmaster_id,
        name: name.trim(),
        description: description.trim() || null,
        max_members: parseInt(maxMembers),
        event_title: event.title,
        event_venue: event.venue,
        event_meta: event.meta
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to create group');
      }

      // Reset form
      setName('');
      setDescription('');
      setMaxMembers(4);
      
      onConfirm();
    } catch (err) {
      alert(err.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">Create a Group</div>
        {event && (
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-darker)', borderRadius: 8 }}>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>Event:</div>
            <div style={{ fontWeight: 500 }}>{event.title}</div>
            <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{event.venue}</div>
          </div>
        )}
        <div className="field">
          <label>Group Name</label>
          <input 
            placeholder="e.g. Front Row Squad" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Total Number of People</label>
          <input 
            type="number" 
            placeholder="4" 
            min="2" 
            max="50"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Description (Optional)</label>
          <textarea 
            placeholder="Tell people about your group…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}