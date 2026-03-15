import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const router = useRouter();

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">
          <h1>Switchyard</h1>
          <span>Mechanical Keyboard Tracker</span>
        </Link>
        <nav className="nav-links">
          <Link href="/" className={`nav-link${router.pathname === '/' ? ' active' : ''}`}>Home</Link>
          <Link href="/learn" className={`nav-link nav-highlight${router.pathname.startsWith('/learn') || router.pathname.startsWith('/blog') ? ' active' : ''}`}>Learn</Link>
        </nav>
      </div>
    </header>
  );
}
