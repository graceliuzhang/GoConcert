// Nav.jsx
import React from 'react';

const NAV_LINKS = [
  { label: 'Home', page: 'home' },
  { label: 'Events', page: 'events' },
  { label: 'Manage Groups', page: 'groups' },
];

export default function Nav({ currentPage, goTo }) {
  return (
    <nav>
      <div className="nav-logo">GoConcert</div>
      <div className="nav-links">
        {NAV_LINKS.map(({ label, page }) => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => goTo(page)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="nav-avatar" onClick={() => goTo('profile')}>👤</div>
    </nav>
  );
}