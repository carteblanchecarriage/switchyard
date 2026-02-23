import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="App">
      <Header />
      <main className="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
