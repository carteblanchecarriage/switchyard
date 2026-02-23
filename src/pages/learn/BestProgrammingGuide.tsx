import React from 'react';
import Layout from '../../components/Layout';
import './GuidePages.css';

const topPicks = [
  {
    badge: 'Best Overall',
    name: 'Keychron Q1 Pro',
    price: '$199',
    specs: '75% Layout / QMK/VIA / Gasket Mount / Aluminum / South-Facing',
    why: 'QMK means every key is programmable. The knob can be volume, scroll, or any key combo.',
    link: 'https://keychron.com/products/keychron-q1-pro'
  },
  {
    badge: '60% Legend',
    name: 'HHKB Professional Hybrid',
    price: '$337',
    specs: '60% Layout / Topre Switches / Dip Switches / Bluetooth / USB-C',
    why: 'Control key is where Caps Lock usually is. Dip switches change layouts without software.',
    link: 'https://www.amazon.com/s?k=hhkb+professional+hybrid'
  },
  {
    badge: 'Budget Pick',
    name: 'Keychron K3 Pro',
    price: '$94',
    specs: '75% Low-Profile / QMK/VIA / Hot-Swap / Wireless',
    why: 'Low-profile keys mean less finger travel. QMK at this price is rare.',
    link: 'https://keychron.com/products/keychron-k3-pro'
  },
  {
    badge: 'Split/Ergo',
    name: 'Moonlander Mark I',
    price: '$365',
    specs: 'Split Layout / Ortholinear / Programmable / Tenting',
    why: 'Your shoulders stay relaxed. Takes 2-3 weeks to learn, then everything feels wrong.',
    link: 'https://www.zsa.io/moonlander'
  },
  {
    badge: 'Mac Native',
    name: 'Keychron K8 Pro',
    price: '$109',
    specs: 'TKL Layout / QMK/VIA / Mac-First / Bluetooth / Hot-Swap',
    why: 'Designed for Macs. QMK on wireless. TKL keeps muscle memory intact.',
    link: 'https://keychron.com/products/keychron-k8-pro'
  }
];

const layoutComparison = [
  { layout: '60%', arrows: 'Fn + I/J/K/L', bestFor: 'Vim users, minimalists' },
  { layout: '65%', arrows: 'Dedicated, close to Enter', bestFor: 'Best balance for most devs' },
  { layout: '75%', arrows: 'Full-sized cluster', bestFor: 'Devs who need F-keys + arrows' },
  { layout: 'TKL', arrows: 'Full cluster + F-keys', bestFor: 'Those transitioning from full-size' },
  { layout: 'Split', arrows: 'Layers or dedicated', bestFor: 'Ergo-conscious, touch typists' }
];

export default function BestProgrammingGuide() {
  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Recommendations</span>
          <h1>Best Keyboards for Programming</h1>
          <p className="guide-intro">
            Efficient layouts and features that make code flow. Selected by developers.
          </p>
        </header>

        <div className="guide-body">
          <section className="tip-box">
            <strong>What programmers actually need:</strong> Compact layouts keep your mouse closer, programmable layers put shortcuts under your thumbs.
          </section>

          <section className="quick-picks-section">
            <h2>Top Picks for Developers</h2>
            
            {topPicks.map((pick) => (
              <div key={pick.name} className="recommendation-card">
                <div>
                  <span className="rec-badge">{pick.badge}</span>
                </div>
                <div className="rec-content">
                  <h3>{pick.name}</h3>
                  <div className="rec-price">{pick.price}</div>
                  <div className="rec-specs">{pick.specs}</div>
                  <div className="rec-why">
                    <strong>Why devs love it:</strong> {pick.why}
                  </div>
                  <a href={pick.link} className="cta-button" target="_blank" rel="noopener">
                    Check Price
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section>
            <h2>Why Layout Matters for Coding</h2>
            
            <p>Programmers hit certain keys thousands of times per day:</p>
            
            <div className="keystroke-stats">
              <div className="stat-item">
                <code>Ctrl/Cmd + C/V/X</code>
                <span>~500x/day</span>
              </div>
              <div className="stat-item">
                <code>Arrow keys for navigation</code>
                <span>~1000x/day</span>
              </div>
              <div className="stat-item">
                <code>Backspace/Delete</code>
                <span>~800x/day</span>
              </div>
            </div>
            
            <p className="problem-statement"><strong>The problem:</strong> Your pinky does too much work, arrow keys are miles away from home row.</p>
          </section>

          <section>
            <h2>Layout Comparison for Coding</h2>
            
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Layout</th>
                    <th>Arrow Key Position</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutComparison.map((row) => (
                    <tr key={row.layout}>
                      <td><strong>{row.layout}</strong></td>
                      <td><code>{row.arrows}</code></td>
                      <td>{row.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Switch Recommendations by Language</h2>
            
            <div className="language-switches">
              <div className="lang-card">
                <h4>Python/JavaScript</h4>
                <p>Lots of typing, lots of symbols.</p>
                <p><strong>Recommended:</strong> Tactile (Cherry MX Brown)</p>
                <p>The tactile bump helps with accuracy on long sessions.</p>
              </div>
              
              <div className="lang-card">
                <h4>Vim/Neovim Users</h4>
                <p>Modal editing, lots of Esc.</p>
                <p><strong>Recommended:</strong> Linear (Cherry MX Red) or HHKB Topre</p>
                <p>Smooth for rapid Escape/Mode switching.</p>
              </div>
              
              <div className="lang-card">
                <h4>IDE Power Users</h4>
                <p>Shortcuts, combos, macros.</p>
                <p><strong>Recommended:</strong> Linear + QMK</p>
                <p>Fast actuation for combos, programmable layers.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Key Features to Program</h2>
            
            <div className="programmable-features">
              <div className="feature-item">
                <h4>Layer Toggles</h4>
                <p>Hold Fn for arrows on WASD. Tap Caps for Escape.</p>
              </div>
              
              <div className="feature-item">
                <h4>Macro Shortcuts</h4>
                <p>One key for console.log() or git commit.</p>
              </div>
              
              <div className="feature-item">
                <h4>Knob Functions</h4>
                <p>Scroll, switch desktops, control volume.</p>
              </div>
              
              <div className="feature-item">
                <h4>Home Row Mods</h4>
                <p>Tap for letter, hold for modifier.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Split Keyboard Benefits</h2>
            
            <p>Why devs swear by split layouts:</p>
            
            <ul className="styled-list">
              <li><strong>Shoulders stay neutral:</strong> No hunching</li>
              <li><strong>Thumb clusters:</strong> Strong digits do the work</li>
              <li><strong>Layers everywhere:</strong> Fully customizable</li>
              <li><strong>Tenting:</strong> Better wrist position</li>
            </ul>
            
            <p className="warning-note">2-4 week learning curve. But many never go back.</p>
          </section>

          <section className="cta-section">
            <h2>Ready to code faster?</h2>
            <p>Find your perfect development keyboard.</p>
            <a href="/" className="cta-button">Browse All Keyboards →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
