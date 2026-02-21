// CreateGroupModal.jsx
import React from 'react';

export default function CreateGroupModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-title">Create a Group</div>
        <div className="field">
          <label>Group Name</label>
          <input placeholder="e.g. Tame Impala Front Row Squad" />
        </div>
        <div className="field">
          <label>Event / Tour Name</label>
          <input placeholder="Search for an event…" />
        </div>
        <div className="field">
          <label>Total Number of People</label>
          <input type="number" placeholder="4" min="2" max="50" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea placeholder="Tell people about your group…" />
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={onConfirm}>Create Group</button>
        </div>
      </div>
    </div>
  );
}