import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SEOHead from '../../components/SEOHead';
import BlogProductCard from '../../components/BlogProductCard';
import { useScrollToTop } from '../../hooks/useScrollToTop';

const DOMAIN = 'https://switchyard.club';

interface ShopPick {
  productName: string;
  vendor?: string;
  description?: string;
  ctaText?: string;
}

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
  shopPicks?: ShopPick[];
  catalogLink?: string;
  catalogLinkText?: string;
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
  shopPicks,
  catalogLink = "/",
  catalogLinkText = "Browse all keyboards →",
  children
}: BlogPostLayoutProps) {
  useScrollToTop();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: ogImage,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Organization',
      name: 'Switchyard',
      url: DOMAIN,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Switchyard',
      url: DOMAIN,
      logo: {
        '@type': 'ImageObject',
        url: `${DOMAIN}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': DOMAIN,
    },
  };

  return (
    <Layout>
      <SEOHead
        title={`${title} | Switchyard Blog`}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType="article"
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

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

          {/* Shop These Picks */}
          {shopPicks && shopPicks.length > 0 && (
            <div className="shop-picks-section">
              <div className="shop-picks-header">
                <h2>Shop These Picks</h2>
                <p>Keyboards mentioned or relevant to this article, sourced from our live catalog.</p>
              </div>
              <div className="shop-picks-grid">
                {shopPicks.map((pick, i) => (
                  <BlogProductCard
                    key={i}
                    productName={pick.productName}
                    vendor={pick.vendor}
                    description={pick.description}
                    ctaText={pick.ctaText || "Check Price →"}
                  />
                ))}
              </div>
              <div className="shop-picks-footer">
                <Link href={catalogLink} className="shop-picks-browse-link">
                  {catalogLinkText}
                </Link>
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
}
