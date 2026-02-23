import React from 'react';
import Layout from '../../components/Layout';
import './GuidePages.css';

const topPicks = [
  {
    badge: 'Best Overall',
    badgeClass: '',
    name: 'Keychron V1',
    price: '$84',
    specs: '75% Layout • Hot-Swap • Gateron G Pro Switches • South-Facing RGB',
    why: 'Best balance of features, build quality, and price. Hot-swap means you can change switches later. The knob is genuinely useful for volume control.',
    link: 'https://keychron.com/products/keychron-v1'
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
    link: 'https://keychron.com/products/keychron-k8'
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
  { name: 'Akko 3061B', price: '$79', layout: '60%', hotSwap: 'No', wireless: 'Yes', bestFor: 'Aesthetics' },
  { name: 'Keychron C1', price: '$69', layout: 'TKL', hotSwap: 'No', wireless: 'No', bestFor: 'Wired office' }
];

export default function BestBudgetGuide() {
  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Recommendations</span>
          <h1>Best Mechanical Keyboards Under $100</h1>
          <p className="guide-intro">
            Quality mechanical keyboards that won't break the bank. Tested for typing feel, build quality, and value.
          </p>
        </header>

        <div className="guide-body">
          <section className="quick-picks-section">
            <h2>🏆 Our Top Picks</h2>
            
            {topPicks.map((pick) => (
              <div key={pick.name} className="recommendation-card">
                <div>
                  <span className={`rec-badge ${pick.badgeClass}`}>{pick.badge}</span>
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
            <h2>📊 Complete Comparison</h2>
            <div className="comparison-table-wrapper">
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
                  {comparisonTable.map((row) => (
                    <tr key={row.name}>
                      <td><strong>{row.name}</strong></td>
                      <td>{row.price}</td>
                      <td>{row.layout}</td>
                      <td>{row.hotSwap === 'Yes' ? '✅ Yes' : row.hotSwap === 'No' ? '❌ No' : '✅ Some'}</td>
                      <td>{row.wireless === 'Yes' ? '✅ Yes' : '❌ No'}</td>
                      <td>{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>🎯 How We Chose These</h2>
            <p>We looked for keyboards that meet these criteria:</p>
            <ul className="styled-list">
              <li><strong>Actually mechanical:</strong> No "mechanical-feel" membrane keyboards</li>
              <li><strong>Reliable quality:</strong> Consistent builds, no widespread QC issues</li>
              <li><strong>Available switches:</strong> Multiple switch options or easy to modify</li>
              <li><strong>Community tested:</strong> Hundreds of real user reviews</li>
              <li><strong>Widely available:</strong> Actually in stock, not unicorn rare</li>
            </ul>
          </section>

          <section>
            <h2>🤔 Which One Should You Get?</h2>
            
            <div className="use-case-grid">
              <div className="use-case-card">
                <h4>First mechanical keyboard?</h4>
                <p>→ Keychron V1 or K8. Can try different switches later thanks to hot-swap.</p>
              </div>
              <div className="use-case-card">
                <h4>Strictly gaming?</h4>
                <p>→ RK61 or any 60% for mouse space. Consider speed switches.</p>
              </div>
              <div className="use-case-card">
                <h4>Office/work environment?</h4>
                <p>→ Keychron K8 (TKL) for the familiar layout with wireless.</p>
              </div>
              <div className="use-case-card">
                <h4>Want to customize later?</h4>
                <p>→ GMMK Compact hot-swap barebones. Add switches/keycaps as you learn.</p>
              </div>
              <div className="use-case-card">
                <h4>Tightest budget?</h4>
                <p>→ Redragon K552 at ~$45. It's not fancy but it's real mechanical.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>⚡ What You Sacrifice Under $100</h2>
            <p>Realistic expectations:</p>
            <ul className="styled-list">
              <li>Build quality won't match $200+ customs (plastic cases, not aluminum)</li>
              <li>Stock stabilizers often need lubrication or modding</li>
              <li>Keycaps are usually ABS (will get shiny over time)</li>
              <li>No advanced features like gasket mounting or flex cuts</li>
              <li>Limited color/design options</li>
            </ul>
            <p style={{ marginTop: '1rem' }}>That said: <strong>These keyboards are 80% as good as $200+ boards for typing feel.</strong> The switches are the same.</p>
          </section>

          <section>
            <h2>🔧 Easy Upgrades</h2>
            <p>Want to improve any of these later?</p>
            <ul className="styled-list">
              <li><strong>Lube the switches:</strong> Biggest impact to sound/feel. Krytox 205g0.</li>
              <li><strong>Swap keycaps:</strong> PBT sets from Amazon/ePBT for $30-60.</li>
              <li><strong>Mod stabs:</strong> Dielectric grease on spacebar, band-aid mod.</li>
              <li><strong>Add foam:</strong> Case foam reduces hollow sound.</li>
            </ul>
          </section>

          <section className="cta-section">
            <h2>Ready to see all keyboards?</h2>
            <p>Compare prices across vendors, filter by layout, and find your perfect board.</p>
            <a href="/" className="cta-button">Browse Full Dashboard →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
