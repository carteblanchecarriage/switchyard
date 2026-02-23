import React from 'react';
import './Header.css';

export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <a href="/" className="logo">
          <h1>Switchyard</h1>
          <span>Mechanical Keyboard Tracker</span>
        </a>
        <nav className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/learn" className="nav-link nav-highlight">Learn</a>
          <a href="/learn/switch-guide" className="nav-link">Switches</a>
          <a href="/learn/glossary" className="nav-link">Glossary</a>
        </nav>
      </div>
    </header>
  );
}
