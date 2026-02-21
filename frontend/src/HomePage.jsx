// HomePage.jsx
import React from 'react';
import Nav from './Nav.jsx';

export default function HomePage({ goTo }) {
  return (
    <div className="page">
      <Nav currentPage="home" goTo={goTo} />
      <div className="hero">
        <div className="hero-eyebrow">🎶 Live Music Community</div>
        <div className="hero-title">
          Find Your<br />Concert Crew
        </div>
        <div className="hero-sub">
          Connect with fans going to the same shows. Find your people before the first beat drops.
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => goTo('events')}>
            Browse Events →
          </button>
        </div>
      </div>
    </div>
  );
}