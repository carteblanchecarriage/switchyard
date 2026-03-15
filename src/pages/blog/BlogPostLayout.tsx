import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SEOHead from '../../components/SEOHead';
import { useScrollToTop } from '../../hooks/useScrollToTop';

interface BlogPostLayoutProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  date: string;
  readTime: string;
  category: string;
  heroImage?: string;
  heroAlt?: string;
  children: React.ReactNode;
}

export default function BlogPostLayout({
  title,
  description,
  keywords = "",
  ogImage = "https://switchyard.club/og-image.png",
  date,
  readTime,
  category,
  heroImage,
  heroAlt,
  children
}: BlogPostLayoutProps) {
  useScrollToTop();

  return (
    <Layout>
      <SEOHead
        title={`${title} | Switchyard Blog`}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType="article"
      />

      <div className="blog-post-container">
        <article className="blog-post">
          {/* Breadcrumbs */}
          <nav className="blog-breadcrumbs">
            <Link href="/">Home</Link> <span>/</span>
            <Link href="/learn">Blog</Link> <span>/</span>
            <span className="current">{title}</span>
          </nav>

          {/* Header */}
          <header className="blog-header">
            <div className="blog-meta">
              <span className="blog-category">{category}</span>
              <span className="blog-dot">•</span>
              <time dateTime={date}>{date}</time>
              <span className="blog-dot">•</span>
              <span>{readTime} read</span>
            </div>
            <h1 className="blog-title">{title}</h1>
            <p className="blog-description">{description}</p>
          </header>

          {/* Hero Image */}
          {heroImage && (
            <div className="blog-hero-image">
              <img
                src={heroImage}
                alt={heroAlt || title}
                loading="eager"
              />
            </div>
          )}

          {/* Content */}
          <div className="blog-content-wrapper">
            <div className="blog-content">
              {children}
            </div>

            {/* Sidebar */}
            <aside className="blog-sidebar">
              <div className="sidebar-section">
                <h3>Related Articles</h3>
                <ul className="related-articles">
                  <li><Link href="/blog/hall-effect-keyboards-2026">Hall Effect Keyboards Explained</Link></li>
                  <li><Link href="/blog/are-keychron-keyboards-worth-it">Are Keychron Worth It?</Link></li>
                  <li><Link href="/blog/cherry-mx2a-vs-original">Cherry MX2A vs Original</Link></li>
                </ul>
              </div>

              <div className="sidebar-cta">
                <h3>Find Your Perfect Keyboard</h3>
                <p>Browse 400+ mechanical keyboards with our smart filters.</p>
                <Link href="/" className="sidebar-button">Browse Keyboards</Link>
              </div>
            </aside>

            {/* Mobile: Related Articles at bottom */}
            <div className="mobile-related">
              <h3>Related Articles</h3>
              <ul>
                <li><Link href="/blog/hall-effect-keyboards-2026">Hall Effect Keyboards Explained</Link></li>
                <li><Link href="/blog/are-keychron-keyboards-worth-it">Are Keychron Worth It?</Link></li>
                <li><Link href="/blog/cherry-mx2a-vs-original">Cherry MX2A vs Original</Link></li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}
