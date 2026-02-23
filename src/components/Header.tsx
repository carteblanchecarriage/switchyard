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
          <a href="/switch-guide">Switch Guide</a>
          <a href="/beginners-guide">Beginner's Guide</a>
          <a href="/glossary">Glossary</a>
        </nav>
      </div>
    </header>
  );
}
