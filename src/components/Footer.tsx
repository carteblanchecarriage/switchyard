import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-sections">
        <div className="footer-section">
          <h3>Discover</h3>
          <ul>
            <li><Link href="/">All Products</Link></li>
            <li><Link href="/?category=keyboard">Keyboards</Link></li>
            <li><Link href="/?category=switches">Switches</Link></li>
            <li><Link href="/?category=keycaps">Keycaps</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Learn</h3>
          <ul>
            <li><Link href="/learn">All Guides</Link></li>
            <li><Link href="/learn/switch-guide">Switch Guide</Link></li>
            <li><Link href="/learn/beginners-guide">Beginner's Guide</Link></li>
            <li><Link href="/learn/glossary">Glossary</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li><a href="mailto:info@switchyard.club">Email</a></li>
            <li><a href="https://twitter.com/switchyard" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Switchyard. All rights reserved. Some links are affiliate links — we may earn a commission at no extra cost to you.</p>
      </div>
    </footer>
  );
}
