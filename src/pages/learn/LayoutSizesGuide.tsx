import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const layoutData = [
  {
    size: '40%',
    keys: '40-44',
    width: '~285mm',
    pros: ['Ultra portable', 'Maximum mouse space', 'Minimalist aesthetic'],
    cons: ['Steep learning curve', 'Multiple Fn layers', 'Not for beginners'],
    bestFor: 'Writers, minimalists, split keyboard users',
    examples: 'Vortex Core, Niu Mini, Planck'
  },
  {
    size: '60%',
    keys: '61',
    width: '~295mm',
    pros: ['Portable', 'Standard PCB format', 'Most keycap compatibility'],
    cons: ['No arrow keys', 'No F-row', 'Fn-layer dependent'],
    bestFor: 'Gamers, typists, first compact board',
    examples: 'Ducky One 2 Mini, Anne Pro 2, GK61'
  },
  {
    size: '65%',
    keys: '66-68',
    width: '~315mm',
    pros: ['Dedicated arrows', 'Compact but functional', 'Great balance'],
    cons: ['Fewer keycap options', 'Delete/PgUp placement varies'],
    bestFor: 'Most users - the sweet spot',
    examples: 'Keychron K6, NK65, Tofu65'
  },
  {
    size: '75%',
    keys: '82-84',
    width: '~330mm',
    pros: ['F-row included', 'Arrows + nav cluster', 'Compact yet complete'],
    cons: ['Less portable', 'Right-side modifiers squeezed'],
    bestFor: 'Programmers, productivity, gaming',
    examples: 'Keychron Q1, GMMK Pro, Akko 3084'
  },
  {
    size: 'TKL',
    keys: '87-88',
    width: '~360mm',
    pros: ['Full navigation', 'No numpad (mouse space)', 'Standard layout'],
    cons: ['Bulky', 'Missing numpad for data entry'],
    bestFor: 'Esports, programmers, desk workers',
    examples: 'Leopold FC750R, Drop CTRL, HyperX Alloy FPS'
  },
  {
    size: 'Full Size',
    keys: '104-108',
    width: '~450mm',
    pros: ['Complete layout', 'Numpad included', 'No learning curve'],
    cons: ['Takes up desk space', 'Mouse far from typing position', 'Heavy'],
    bestFor: 'Data entry, accountants, traditionalists',
    examples: 'Leopold FC900R, Ducky Shine, Keychron K10'
  }
];

const keycapSizes = [
  { name: 'Standard', width: '1u', percent: '100%' },
  { name: 'Modifier', width: '1.25u', percent: '125%' },
  { name: 'Tab', width: '1.5u', percent: '150%' },
  { name: 'Caps Lock', width: '1.75u', percent: '175%' },
  { name: 'Shift (Left)', width: '2.25u', percent: '225%' },
  { name: 'Shift (Right)', width: '2.75u', percent: '275%' },
  { name: 'Enter', width: '2.25u', percent: '225%' },
  { name: 'Spacebar', width: '6.25u', percent: '625%' },
  { name: 'Numpad 0', width: '2u', percent: '200%' },
  { name: 'Numpad +', width: '2u', percent: '200%' }
];

export default function LayoutSizesGuide() {
  useScrollToTop();
  usePageSEO({
    title: 'Keyboard Layout Sizes Explained | 40% to Full-Size | Switchyard',
    description: 'Visual guide to keyboard sizes: 40%, 60%, 65%, 75%, TKL, full-size. Compare widths, pros/cons, and find your perfect layout.',
    keywords: 'keyboard layout sizes, 60% vs 65% vs 75%, keyboard size comparison, TKL keyboard, full size keyboard layout'
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Deep Dive</span>
          <h1>Keyboard Layout Sizes Explained</h1>
          <p className="guide-intro">
            From 40% to full-size: find your perfect fit. Every layout visualized and compared.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>Quick Size Comparison</h2>
            
            <div className="layout-comparison-table">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Layout</th>
                    <th>Keys</th>
                    <th>Width</th>
                    <th>Best For</th>
                  </tr>
                </thead>
                <tbody>
                  {layoutData.map((layout) => (
                    <tr key={layout.size}>
                      <td><strong>{layout.size}</strong></td>
                      <td>{layout.keys}</td>
                      <td>{layout.width}</td>
                      <td>{layout.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Size Deep Dives</h2>
            
            <div className="size-cards">
              {layoutData.map((layout) => (
                <div key={layout.size} className="size-card">
                  <div className="size-card-header">
                    <h3>{layout.size}</h3>
                    <span className="size-keys">{layout.keys} keys</span>
                  </div>
                  
                  <div className="size-visual" style={{ width: layout.width.replace('~', '').replace('mm', 'px') }}>
                    <div className="size-bar"></div>
                    <span className="size-label">{layout.width}</span>
                  </div>
                  
                  <div className="size-details">
                    <div className="pros-cons">
                      <div className="pros">
                        <h4>Pros:</h4>
                        <ul>
                          {layout.pros.map((pro) => (
                            <li key={pro}><span className="checkmark">+</span> {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="cons">
                        <h4>Cons:</h4>
                        <ul>
                          {layout.cons.map((con) => (
                            <li key={con}><span className="xmark">-</span> {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="examples">
                      <strong>Examples:</strong> {layout.examples}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Keycap Sizes Explained</h2>
            
            <p className="section-intro">
              Keycaps are measured in "units" (u). A single alphanumeric key is 1u.
            </p>
            
            <div className="keycap-sizes">
              {keycapSizes.map((k) => (
                <div key={k.name} className="keycap-size-item">
                  <div className="keycap-visual-wrapper">
                    <div 
                      className="keycap-visual" 
                      style={{ width: k.percent }}
                    >
                      <span className="keycap-text">{k.name}</span>
                    </div>
                  </div>
                  <span className="keycap-width">{k.width}</span>
                  <span className="keycap-percent">{k.percent}</span>
                </div>
              ))}
            </div>
            
            <div className="note-box">
              <p><strong>Note:</strong> Compact layouts often use shorter spacebars (2.75u Left Shift, 2.25u Right Shift) to fit arrow keys or nav cluster.</p>
            </div>
          </section>

          <section>
            <h2>Which Size is Right for You?</h2>
            
            <div className="fit-check">
              <div className="fit-good">
                <h3>Start with 65% or 75% if you:</h3>
                <ul>
                  <li>Want a compact board without learning curves</li>
                  <li>Use arrow keys daily (spreadsheets, coding)</li>
                  <li>Need F-keys occasionally</li>
                  <li>Want one keyboard for everything</li>
                </ul>
              </div>
              
              <div className="fit-bad">
                <h3>Consider 60% or smaller if you:</h3>
                <ul>
                  <li>Want maximum portability</li>
                  <li>Have limited desk space</li>
                  <li>Are willing to learn Fn layers</li>
                  <li>Want the minimalist aesthetic</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="tip-box">
            <h3>Pro Tip: Start Slow</h3>
            <p>Do not jump straight to 40% or smaller. Start with 65% or 75%, get comfortable with layers, then downsize if you want. Most people stick with 65-75% as the sweet spot.</p>
          </section>

          <section className="cta-section">
            <h2>Ready to choose?</h2>
            <p>Browse keyboards by size in our full dashboard.</p>
            <a href="/" className="cta-button">Browse All Sizes →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
