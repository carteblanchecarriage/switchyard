import React from 'react';
import Layout from '../../components/Layout';
import './GuidePages.css';

const keyboardLayout = [
  ['Esc', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
  ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'],
  ['Caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', "'", 'Enter'],
  ['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'],
  ['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Fn', 'Ctrl']
];

const topPicks = [
  {
    badge: 'Best Overall',
    name: 'Akko 3068B Plus',
    price: '$89',
    specs: '60% / Hot-Swap / Bluetooth 5.0 / ASA Profile / RGB',
    why: 'Best balance of features, build, and price. ASA profile keycaps are comfortable, Bluetooth is reliable.',
    link: 'https://www.amazon.com/s?k=akko+3068b+plus'
  },
  {
    badge: 'Gaming Pick',
    name: 'RK ROYAL KLUDGE RK61',
    price: '$59',
    specs: '60% / Bluetooth+Wired / Hot-Swap / RGB',
    why: 'Feature-packed at this price. Bluetooth + wired with low latency for gaming.',
    link: 'https://www.amazon.com/s?k=rk61+royal+kludge'
  },
  {
    badge: 'Entry Custom',
    name: 'Glorious GMMK Compact',
    price: '$65',
    specs: '60% / Universal Hot-Swap / Barebones',
    why: 'Cheapest way to build custom. Add switches and keycaps. Learn the hobby.',
    link: 'https://www.amazon.com/s?k=glorious+gmmk+compact'
  },
  {
    badge: 'Premium',
    name: 'Keychron Q4 Pro',
    price: '$129',
    specs: '60% / Aluminum / Wireless+QMK / Hot-Swap',
    why: 'QMK on wireless 60% is rare. Aluminum case. Buy-it-for-life option.',
    link: 'https://keychron.com/products/keychron-q4-pro'
  },
  {
    badge: 'Enthusiast',
    name: 'Durgod HK Venus',
    price: '$79',
    specs: '60% / Cherry-Gateron / PBT Keycaps',
    why: 'Surprisingly good stabilizers. Clean design. Stock PBT included.',
    link: 'https://www.amazon.com/s?k=durgod+hk+venus'
  }
];

const goodFit = [
  'You use mouse-heavy applications (gaming, design)',
  'Limited desk space or travel frequently',
  "You're learning Vim or already use it",
  'You want a minimalist aesthetic',
  "You're willing to adjust to Fn-layer navigation"
];

const skipIf = [
  'You constantly use F-keys for work',
  'You need a dedicated numpad',
  'You rely heavily on arrow keys for spreadsheets',
  'You need navigation keys (Home, End, PgUp, PgDn) frequently'
];

export default function Best60PercentGuide() {
  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Recommendations</span>
          <h1>Best 60% Keyboards</h1>
          <p className="guide-intro">
            Compact, portable, and efficient. The 60% layout removes keys you rarely use.
          </p>
        </header>

        <div className="guide-body">
          <section className="layout-visual-section">
            <h2>What is 60% Layout?</h2>
            
            <div className="keyboard-visual">
              {keyboardLayout.map((row, i) => (
                <div key={i} className="key-row">
                  {row.map((key) => (
                    <span
                      key={`${i}-${key}`}
                      className={`key ${key.length > 1 ? 'wide' : ''} ${['Space', 'Shift', 'Enter', 'Backspace'].includes(key) ? 'ultra-wide' : ''}`}
                    >
                      {key}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            
            <p className="layout-note">
              <strong>What's missing?</strong> No function row (F1-F12), no arrow keys, no numpad, no nav cluster.
              <br/>
              Access these via Fn layer (e.g., Fn + I/J/K/L = arrow keys)
            </p>
          </section>

          <section className="quick-picks-section">
            <h2>Top 60% Keyboards</h2>
            
            {topPicks.map((pick) => (
              <div key={pick.name} className="recommendation-card compact">
                <div>
                  <span className="rec-badge alt">{pick.badge}</span>
                </div>
                <div className="rec-content">
                  <h3>{pick.name}</h3>
                  <div className="rec-price">{pick.price}</div>
                  <div className="rec-specs">{pick.specs}</div>
                  <div className="rec-why">
                    <strong>Why we picked it:</strong> {pick.why}
                  </div>
                  <a href={pick.link} className="cta-button" target="_blank" rel="noopener">
                    Check Price
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section className="warning-box">
            <h3>Before you buy a 60%:</h3>
            <p>Make sure you are comfortable with:</p>
            <ul>
              <li>No dedicated arrow keys (use Fn + WASD or IJKL)</li>
              <li>No function row (F1-F12 on number keys)</li>
              <li>Learning curve of 1-2 weeks for muscle memory</li>
            </ul>
            <p className="warning-note">If unsure, consider 65% or 75% instead. Same compactness, keeps arrows separate.</p>
          </section>

          <section>
            <h2>Is 60% Right For You?</h2>
            
            <div className="fit-check">
              <div className="fit-good">
                <h3>Good fit if:</h3>
                <ul>
                  {goodFit.map((item) => (
                    <li key={item}><span className="checkmark">✓</span> {item}</li>
                  ))}
                </ul>
              </div>
              
              <div className="fit-bad">
                <h3>Skip 60% if:</h3>
                <ul>
                  {skipIf.map((item) => (
                    <li key={item}><span className="xmark">✗</span> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Gaming on 60%</h2>
            
            <p><strong>Why competitive gamers love it:</strong></p>
            
            <ul className="styled-list">
              <li><strong>More mouse space:</strong> Critical for low-DPI players</li>
              <li><strong>Portable for LANs:</strong> Toss in a bag</li>
              <li><strong>Standard position:</strong> WASD cluster same place</li>
            </ul>
            
            <p className="note"><strong>Common 60% in esports:</strong> Ducky One 2 Mini, Huntsman Mini, custom builds.</p>
          </section>

          <section>
            <h2>Pro Tips for 60% Living</h2>
            
            <div className="tips-list">
              <div className="tip-item">
                <span className="tip-number">1</span>
                <p><strong>Learn the Fn layer day 1.</strong> Practice for an hour. By day 3 it's natural.</p>
              </div>
              <div className="tip-item">
                <span className="tip-number">2</span>
                <p><strong>Most boards have DIP switches.</strong> Swap Caps Lock with Fn.</p>
              </div>
              <div className="tip-item">
                <span className="tip-number">3</span>
                <p><strong>For FPS gaming:</strong> Use gaming mode, not power saving.</p>
              </div>
              <div className="tip-item">
                <span className="tip-number">4</span>
                <p><strong>For productivity:</strong> QMK support = programmable combos.</p>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Ready to go small?</h2>
            <p>Compare sizes and features across all keyboards.</p>
            <a href="/" className="cta-button">Browse 60% Keyboards →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
