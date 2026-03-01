import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './BlogPost.css';

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
  usePageSEO({
    title: `${title} | Switchyard Blog`,
    description,
    keywords,
    ogImage
  });

  useScrollToTop();

  return (
    <Layout>
      <div className="blog-post-container">
        <article className="blog-post">
          {/* Breadcrumbs */}
          <nav className="blog-breadcrumbs">
            <a href="/">Home</a> <span>/</span>
            <a href="/blog">Blog</a> <span>/</span>
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
                  <li><a href="/blog/hall-effect-keyboards-2026">Hall Effect Keyboards Explained</a></li>
                  <li><a href="/blog/are-keychron-keyboards-worth-it">Are Keychron Worth It?</a></li>
                  <li><a href="/blog/cherry-mx2a-vs-original">Cherry MX2A vs Original</a></li>
                </ul>
              </div>

              <div className="sidebar-cta">
                <h3>Find Your Perfect Keyboard</h3>
                <p>Browse 400+ mechanical keyboards with our smart filters.</p>
                <a href="/" className="sidebar-button">Browse Keyboards</a>
              </div>
            </aside>

            {/* Mobile: Related Articles at bottom */}
            <div className="mobile-related">
              <h3>Related Articles</h3>
              <ul>
                <li><a href="/blog/hall-effect-keyboards-2026">Hall Effect Keyboards Explained</a></li>
                <li><a href="/blog/are-keychron-keyboards-worth-it">Are Keychron Worth It?</a></li>
                <li><a href="/blog/cherry-mx2a-vs-original">Cherry MX2A vs Original</a></li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
}
