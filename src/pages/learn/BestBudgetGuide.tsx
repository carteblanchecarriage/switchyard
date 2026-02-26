import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const topPicks = [
  {
    badge: 'Best Overall',
    badgeClass: '',
    name: 'Keychron V1',
    price: '$84',
    specs: '75% Layout • Hot-Swap • Gateron G Pro Switches • South-Facing RGB',
    why: 'Best balance of features, build quality, and price. Hot-swap means you can change switches later. The knob is genuinely useful for volume control.',
    link: 'https://keychron.com/products/keychron-v1?ref=switchyard'
  },
  {
    badge: 'Best for Gaming',
    badgeClass: 'alt',
    name: 'Royal Kludge RK61',
    price: '$59',
    specs: '60% Layout • Bluetooth + Wired • RGB • Multiple Switch Options',
    why: 'Feature-packed at this price is unheard of. Bluetooth makes it great for laptop setups. The 60% layout frees up desk space for mouse movement.',
    link: 'https://www.amazon.com/s?k=royal+kludge+rk61'
  },
  {
    badge: 'Best for Typing',
    badgeClass: 'alt',
    name: 'Keychron K8',
    price: '$75-89',
    specs: 'TKL Layout • Hot-Swap (some models) • Wireless + Wired • Mac/Windows',
    why: 'The TKL layout keeps function keys and arrows while saving space. Wireless works reliably. Great for office environments.',
    link: 'https://keychron.com/products/keychron-k8?ref=switchyard'
  },
  {
    badge: 'Best Entry-Level',
    badgeClass: 'bronze',
    name: 'Glorious GMMK Compact',
    price: '$65 (barebones)',
    specs: '60% • Hot-Swap • Modular Design • Add Your Own Switches',
    why: 'The cheapest way to build a custom keyboard. Buy the barebones kit, add switches and keycaps. Learn the hobby without spending $200+.',
    link: 'https://www.amazon.com/s?k=glorious+gmmk+compact'
  }
];

const comparisonTable = [
  { name: 'Keychron V1', price: '$84', layout: '75%', hotSwap: 'Yes', wireless: 'No', bestFor: 'All-rounder' },
  { name: 'RK RK61', price: '$59', layout: '60%', hotSwap: 'No', wireless: 'Yes', bestFor: 'Gaming' },
  { name: 'Keychron K8', price: '$75-89', layout: 'TKL', hotSwap: 'Some', wireless: 'Yes', bestFor: 'Office/Work' },
  { name: 'GMMK Compact', price: '$65', layout: '60%', hotSwap: 'Yes', wireless: 'No', bestFor: 'Customization' },
  { name: 'Redragon K552', price: '$45', layout: 'TKL', hotSwap: 'No', wireless: 'No', bestFor: 'Cheapest decent' },
  { name: 'Epomaker TH80', price: '$89', layout: '75%', hotSwap: 'Yes', wireless: 'Yes', bestFor: 'Feature-rich' },
];

const buyingTips = [
  { title: 'Look for Hot-Swap', desc: 'Hot-swap sockets let you change switches without soldering. This extends the life of your board and lets you experiment.' },
  { title: 'South-Facing LEDs', desc: 'Ensures compatibility with Cherry profile keycaps. North-facing can cause interference with Cherry caps.' },
  { title: 'Wireless Adds Cost', desc: 'Good wireless (2.4GHz) adds $20-40 to the price. Bluetooth is cheaper but has latency. Skip wireless if you do not need it.' },
  { title: 'Check Switch Options', desc: 'Budget boards usually offer Gateron, Outemu, or Red switches. All are fine for starting. You can upgrade later on hot-swap boards.' },
];

const redFlags = [
  { flag: 'Non-Standard Layouts', desc: 'Some cheap boards have weird bottom rows that make replacing keycaps impossible. Check photos before buying.' },
  { flag: 'Proprietary Software', desc: 'If the keyboard requires sketchy Windows-only software to work, skip it. Good boards are plug-and-play.' },
  { flag: 'No Reviews', desc: 'If you cannot find a YouTube review, be cautious. The mech keyboard community reviews everything worth buying.' },
  { flag: 'Ridiculous Claims', desc: '"50 million keystroke lifespan" is marketing fluff. Budget switches die faster. Budget for replacements.' },
];

export default function BestBudgetGuide() {
  useScrollToTop();
  usePageSEO({
    title: "Best Budget Mechanical Keyboards Under $100 | Switchyard",
    description: "Top affordable mechanical keyboards under $100. Compare Keychron V1, Royal Kludge RK61, and more. Expert picks for gaming, typing, and first-time buyers.",
    keywords: "budget mechanical keyboard, best cheap mechanical keyboard, under $100, Keychron V1, RK61, gaming keyboard budget, affordable mechanical keyboard"
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section budget-hero">
          <span className="guide-tag">Under $100</span>
          <h1>Best Budget Mechanical Keyboards</h1>
          <p className="guide-intro">
            Quality mechanical keyboards do not have to cost a fortune. These picks deliver the essential features 
            without breaking the bank. Expect some compromises, but not on what matters: good switches, 
            decent build quality, and reliable performance.
          </p>
        </header>

        <div className="guide-body">

          <section className="quick-picks">
            <h2>Our Top Picks</h2>
            <div className="picks-grid">
              {topPicks.map((pick, idx) => (
                <div key={idx} className={`pick-card ${pick.badgeClass}`}>
                  <span className="pick-badge">{pick.badge}</span>
                  <h3>{pick.name}</h3>
                  <span className="pick-price">{pick.price}</span>
                  <p className="pick-specs">{pick.specs}</p>
                  <p className="pick-why">{pick.why}</p>
                  <a href={pick.link} className="pick-link" target="_blank" rel="noopener noreferrer">Check Price →</a>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Quick Comparison</h2>
            <div className="table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Keyboard</th>
                    <th>Price</th>
                    <th>Layout</th>
                    <th>Hot-Swap</th>
                    <th>Wireless</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, idx) => (
                    <tr key={idx}>
                      <td><strong>{row.name}</strong></td>
                      <td>{row.price}</td>
                      <td>{row.layout}</td>
                      <td>{row.hotSwap}</td>
                      <td>{row.wireless}</td>
                      <td>{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>What to Look For</h2>
            <p className="section-intro">
              At this price point, prioritize function over form. Here is what actually matters:
            </p>
            <div className="tips-list">
              {buyingTips.map((tip, idx) => (
                <div key={idx} className="tip-item">
                  <h4>{tip.title}</h4>
                  <p>{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="warning-section">
            <h2>⚠️ Red Flags</h2>
            <p className="section-intro">
              Avoid these common budget board traps:
            </p>
            <div className="warnings-list">
              {redFlags.map((item, idx) => (
                <div key={idx} className="warning-item">
                  <h4>{item.flag}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="cta-section">
            <h2>Ready to Buy?</h2>
            <p>These picks are consistently in stock on Amazon and vendor sites. Prices fluctuate, so check back if something is out of stock.</p>
            <p><strong>Pro tip:</strong> Watch for sales around Black Friday and Prime Day. These boards often drop 15-25%.</p>
          </section>

        </div>
      </article>
    </Layout>
  );
}
