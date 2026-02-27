import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './Learn.css';

const guideCategories = [
  {
    title: 'Getting Started',
    icon: '🎓',
    guides: [
      { path: '/learn/beginners-guide', title: 'Beginner\'s Guide', desc: 'New to mechanical keyboards? Start here with the basics.', difficulty: 'Easy' },
      { path: '/learn/layout-sizes', title: 'Layout Sizes Explained', desc: '40%, 60%, 65%, 75%, TKL, Full-size - visual comparison.', difficulty: 'Easy' },
      { path: '/learn/glossary', title: 'Keyboard Glossary', desc: 'Master the terminology. Every term you need to know.', difficulty: 'Easy' },
      { path: '/learn/faq', title: 'FAQ', desc: 'Quick answers to common questions.', difficulty: 'Easy' },
    ]
  },
  {
    title: 'Latest from the Blog',
    icon: '📰',
    guides: [
      { path: '/blog/gasket-mount-keyboards-explained', title: 'Gasket Mount Keyboards', desc: 'Why enthusiasts are obsessed with the "thocky" typing feel.', difficulty: 'Medium' },
      { path: '/blog/wireless-mechanical-keyboards-2026', title: 'Wireless Keyboards 2026', desc: 'Is Bluetooth finally good enough? Latency testing results.', difficulty: 'Easy' },
      { path: '/blog/hot-swap-vs-soldered-keyboards', title: 'Hot-Swap vs Soldered', desc: 'Which should you choose? The pros, cons, and real talk.', difficulty: 'Easy' },
      { path: '/blog/cherry-mx2a-vs-original', title: 'Cherry MX2A vs Original', desc: 'Is the new Cherry actually better? Side-by-side analysis.', difficulty: 'Medium' },
      { path: '/blog/are-keychron-keyboards-worth-it', title: 'Are Keychron Worth It?', desc: 'Brutally honest review: which models to buy and skip.', difficulty: 'Easy' },
      { path: '/blog/what-are-group-buys', title: 'What Are Group Buys?', desc: 'Understanding the GB ecosystem and how to participate.', difficulty: 'Medium' },
      { path: '/blog/hall-effect-keyboards-2026', title: 'Hall Effect Keyboards', desc: 'Is rapid trigger cheating? The complete gaming breakdown.', difficulty: 'Medium' },
    ]
  },
  {
    title: 'Deep Dives',
    icon: '🔍',
    guides: [
      { path: '/learn/switch-guide', title: 'Switch Guide', desc: 'Linear, tactile, clicky — find your perfect switch.', difficulty: 'Medium' },
      { path: '/learn/keycap-profiles', title: 'Keycap Profiles', desc: 'Cherry, SA, OEM, DSA — how shape changes everything.', difficulty: 'Medium' },
      { path: '/learn/artisan-guide', title: 'Artisan Keycaps', desc: 'The world of custom, collectible keycaps.', difficulty: 'Medium' },
      { path: '/learn/group-buys', title: 'What Are Group Buys?', desc: 'Understanding the GB ecosystem and how to participate.', difficulty: 'Medium' },
    ]
  },
  {
    title: 'Recommendations',
    icon: '⭐',
    guides: [
      { path: '/learn/best-budget', title: 'Best Budget Keyboards', desc: 'Quality mechanical keyboards under $100.', difficulty: 'Easy' },
      { path: '/learn/best-gaming', title: 'Best Gaming Keyboards', desc: 'Low latency, fast switches, competitive edge.', difficulty: 'Easy' },
      { path: '/learn/best-60-percent', title: 'Best 60% Keyboards', desc: 'Compact layouts that don\'t compromise.', difficulty: 'Medium' },
      { path: '/learn/best-75-percent', title: 'Best 75% Keyboards', desc: 'The enthusiast sweet spot: arrows + F-row.', difficulty: 'Medium' },
      { path: '/learn/best-programming', title: 'Best for Programming', desc: 'Comfort and efficiency for long coding sessions.', difficulty: 'Easy' },
    ]
  },
];

export default function Learn() {
  useScrollToTop();
  
  usePageSEO({
    title: "Learn Mechanical Keyboards | Guides & Resources | Switchyard",
    description: "Master mechanical keyboards with our guides: beginner's guide, switch types, layout sizes, keycap profiles, artisan keycaps, group buys, and buying recommendations.",
    keywords: "mechanical keyboard guide, keyboard tutorial, learn mechanical keyboards, switch guide, keycap profiles, layout sizes, group buy guide"
  });

  return (
    <Layout>
      <div className="learn-page">
        <header className="learn-hero">
          <h1>Learn Mechanical Keyboards</h1>
          <p className="learn-subtitle">
            Guides, explainers, and deep dives for every level.
          </p>
        </header>

        <div className="learn-content">
          {guideCategories.map((category) => (
            <section key={category.title} className="guide-category">
              <h2>
                <span className="category-icon">{category.icon}</span>
                {category.title}
              </h2>
              <div className="guide-grid">
                {category.guides.map((guide) => {
                  return (
                    <a
                      key={guide.path}
                      href={guide.path}
                      className="guide-card"
                      onClick={(e) => {
                        e.preventDefault();
                        window.history.pushState({}, '', guide.path);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                      }}
                    >
                      <div className="guide-header">
                        <span className={`difficulty-badge difficulty-${guide.difficulty.toLowerCase()}`}>
                          {guide.difficulty}
                        </span>
                      </div>
                      <h3>{guide.title}</h3>
                      <p>{guide.desc}</p>
                      <span className="guide-link">Read guide →</span>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
