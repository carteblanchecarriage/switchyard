import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h3>Discover</h3>
          <ul>
            <li><a href="/">All Products</a></li>
            <li><a href="/?category=keyboard">Keyboards</a></li>
            <li><a href="/?category=switches">Switches</a></li>
            <li><a href="/?category=keycaps">Keycaps</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Learn</h3>
          <ul>
            <li><a href="/learn">All Guides</a></li>
            <li><a href="/switch-guide">Switch Guide</a></li>
            <li><a href="/beginners-guide">Beginner's Guide</a></li>
            <li><a href="/glossary">Glossary</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:contact@switchyard.club">Email</a></li>
            <li><a href="https://twitter.com/switchyard" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© 2026 Switchyard. All rights reserved.</p>
      </div>
    </footer>
  );
}
