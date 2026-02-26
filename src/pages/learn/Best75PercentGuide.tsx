import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const topPicks = [
  {
    badge: 'Best Overall',
    name: 'Keychron Q1 Pro',
    price: '$199',
    specs: '75% / Aluminum / QMK/VIA / Gasket / Hot-swap',
    why: 'The default answer for Q1 is justified: solid aluminum, gasket mount, wireless, fully programmable.',
    link: 'https://keychron.com/products/keychron-q1-pro?ref=switchyard'
  },
  {
    badge: 'Budget Pick',
    name: 'Royal Kludge RK84',
    price: '$65',
    specs: '75% / Bluetooth + 2.4GHz / Hot-swap / RGB',
    why: 'Tremendous value. Bluetooth and 2.4GHz included. Battery lasts weeks. Good starter board.',
    link: 'https://www.amazon.com/s?k=rk84+royal+kludge'
  },
  {
    badge: 'Mod-Ready',
    name: 'Feker IK75',
    price: '$85',
    specs: '75% / South-Facing / Gasket / Hot-swap / VIA',
    why: 'Cheapest gasket-mount 75%. South-facing LEDs for Cherry profile. Great base for modding.',
    link: 'https://www.aliexpress.com/wholesale?SearchText=feker+ik75'
  },
  {
    badge: 'Gaming Focus',
    name: 'NuPhy Halo75',
    price: '$130',
    specs: '75% / Low-Profile / 2.4GHz / RGB / Hot-swap',
    why: 'Low-profile switches for fast actuation. 2.4GHz dongle included. Esports-ready.',
    link: 'https://nuphy.com/products/halo75'
  },
  {
    badge: 'Premium',
    name: 'GMMK Pro',
    price: '$349',
    specs: '75% / Aluminum / Rotary Knob / Gasket / South-Facing',
    why: 'Premium build quality. Rotary knob is useful. RGB shines through well. Polished software.',
    link: 'https://www.amazon.com/s?k=gmmk+pro'
  }
];

const useCases = [
  {
    title: 'Gaming',
    desc: '75% gives you full F-row for macros while keeping mouse close.',
    picks: ['NuPhy Halo75', 'Keychron Q1 Pro']
  },
  {
    title: 'Programming',
    desc: 'F-keys for IDE shortcuts. Arrows for navigation. Compact but complete.',
    picks: ['Keychron Q1 Pro', 'Feker IK75']
  },
  {
    title: 'First Mech',
    desc: 'Affordable entry point. Hot-swap lets you try switches later.',
    picks: ['RK84', 'Feker IK75']
  }
];

export default function Best75PercentGuide() {
  useScrollToTop();
  usePageSEO({
    title: 'Best 75% Mechanical Keyboards 2026 | Switchyard',
    description: 'Top 75% keyboards: Keychron Q1 Pro, RK84, Feker IK75, NuPhy Halo75. The enthusiast sweet spot with F-row, arrows, and compact size.',
    keywords: '75% keyboard, best 75% mechanical keyboard, Keychron Q1 Pro, RK84, Feker IK75, compact keyboard 2026'
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Recommendations</span>
          <h1>Best 75% Keyboards</h1>
          <p className="guide-intro">
            The enthusiast sweet spot: F-row, arrows, nav cluster - all in a compact package.
          </p>
        </header>

        <div className="guide-body">
          <section className="tip-box">
            <strong>Why 75% rules:</strong> You keep arrow keys and F-row (essential for coding/gaming), but ditch the numpad for better mouse ergonomics. Most people never look back.
          </section>

          <section className="quick-picks-section">
            <h2>Top 75% Keyboards</h2>
            
            {topPicks.map((pick) => (
              <div key={pick.name} className="recommendation-card compact">
                <div>
                  <span className="rec-badge">{pick.badge}</span>
                </div>
                <div className="rec-content">
                  <h3>{pick.name}</h3>
                  <div className="rec-price">{pick.price}</div>
                  <div className="rec-specs">{pick.specs}</div>
                  <div className="rec-why">
                    <strong>Why we picked it:</strong> {pick.why}
                  </div>
                  <a href={pick.link} className="cta-button" target="_blank" rel="noopener noreferrer">
                    Check Price →
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2>Best For Specific Uses</h2>
            
            <div className="guide-grid">
              {useCases.map((use) => (
                <div key={use.title} className="use-case-card">
                  <h3>{use.title}</h3>
                  <p>{use.desc}</p>
                  <div className="picks-list">
                    <strong>Top picks:</strong> {use.picks.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>75% vs 65% vs TKL</h2>
            
            <div className="comparison-simple">
              <div className="compare-item">
                <h4>75%</h4>
                <p>Best of both worlds: F-row + arrows, no numpad.</p>
                <span className="verdict">Pick for: Productivity</span>
              </div>
              
              <div className="compare-item">
                <h4>65%</h4>
                <p>More compact. Arrows yes, F-row no. Fewer keys.</p>
                <span className="verdict">Pick for: Portability</span>
              </div>
              
              <div className="compare-item">
                <h4>TKL</h4>
                <p>Full arrow/nav cluster. Larger footprint than 75%.</p>
                <span className="verdict">Pick for: Trad. layout</span>
              </div>
            </div>
          </section>

          <section>
            <h2>What Makes a Great 75%?</h2>
            
            <ul className="styled-list">
              <li><strong>Gasket mount:</strong> Softer feel, better sound, slight flex</li>
              <li><strong>South-facing LEDs:</strong> Cherry profile keycaps don't hit switch housings</li>
              <li><strong>VIA/QMK support:</strong> Program F-keys for your specific apps</li>
              <li><strong>Rotary knob:</strong> Volume control or scroll - surprisingly useful</li>
              <li><strong>Wireless:</strong> Clean desk, easy switching between devices</li>
            </ul>
          </section>

          <section>
            <h2>Common Questions</h2>
            
            <div className="faq-list">
              <details className="faq-item">
                <summary>Can I use any keycaps on 75%?</summary>
                <p>Mostly yes, but check the right-side column. Some 75% have non-standard 1.75u Right Shift that requires specific kits.</p>
              </details>
              
              <details className="faq-item">
                <summary>Is 75% good for gaming?</summary>
                <p>Absolutely. F-row gives you macro keys. Compact size keeps mouse close for low-DPI players. Many pros use 75% or smaller.</p>
              </details>
              
              <details className="faq-item">
                <summary>Should I get knob or no knob?</summary>
                <p>Knobs are genuinely useful: volume, scroll, zoom in Figma/CAD. But not essential. You can change your mind later since most boards with knobs also let you remove/replace them.</p>
              </details>
            </div>
          </section>

          <section className="cta-section">
            <h2>Find your 75%</h2>
            <p>Browse all 75% keyboards in our dashboard.</p>
            <a href="/" className="cta-button">Browse 75% Keyboards →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
