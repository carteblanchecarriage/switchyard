import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const profiles = [
  {
    name: 'Cherry',
    height: 'Low',
    sculpted: 'Yes',
    sound: 'Thocky',
    popular: 'GMK, EnjoyPBT',
    desc: 'Low profile, curved tops. Standard for custom keyboards.',
    feel: 'Rapid bottom-out. Fingers rest in scoops.',
    bestFor: 'Typing, gaming, most people',
    cons: 'Expensive (GMK). Long wait times.',
    image: '∿'
  },
  {
    name: 'OEM',
    height: 'Medium',
    sculpted: 'Yes',
    sound: 'Clacky',
    popular: 'Stock keycaps',
    desc: 'Default on most keyboards. Cylindrical tops.',
    feel: 'Taller than Cherry. More travel feel.',
    bestFor: 'First mechanical keyboard',
    cons: 'Basic feel. Usually ABS plastic.',
    image: '∩'
  },
  {
    name: 'SA',
    height: 'Tall',
    sculpted: 'Yes',
    sound: 'Thocky/Deep',
    popular: 'Signature Plastics',
    desc: 'Spherical tops, retro look, tall profile.',
    feel: 'Fingers cupped in deep dish. Very satisfying.',
    bestFor: 'Retro aesthetic, deep thock',
    cons: 'Tall = wrist strain for some. Long adjust period.',
    image: '◠'
  },
  {
    name: 'KAT',
    height: 'Medium-Tall',
    sculpted: 'Yes',
    sound: 'Thocky',
    popular: 'KAT, KAM',
    desc: 'Spherical like SA, but shorter. Large contact surface.',
    feel: 'Finger sits flatter than SA but still cupped.',
    bestFor: 'SA look without the height',
    cons: 'Limited availability. Can feel mushy.',
    image: '◡'
  },
  {
    name: 'DSA',
    height: 'Low',
    sculpted: 'No',
    sound: 'Clacky',
    popular: 'Signature Plastics',
    desc: 'Uniform height. Flat, spherical tops.',
    feel: 'Same every row. No home row reference.',
    bestFor: 'Ortholinear, split keyboards',
    cons: 'Harder to find home row. Less popular now.',
    image: '○'
  },
  {
    name: 'XDA',
    height: 'Low',
    sculpted: 'No',
    sound: 'Clacky/High',
    popular: 'Cheap AliExpress sets',
    desc: 'Uniform, flat tops. Very wide contact surface.',
    feel: 'Finger glides. Large surface area.',
    bestFor: 'Budget builds, uniform look',
    cons: 'Cheap quality often. Can feel flat/boring.',
    image: '□'
  },
  {
    name: 'MT3',
    height: 'Tall',
    sculpted: 'Yes',
    sound: 'Thocky/Deep',
    popular: 'Drop, Matt3o',
    desc: 'Extreme sculpting. Inspired by IBM beamspring.',
    feel: 'Deepest dish. Fingers locked in.',
    bestFor: 'Those who want maximum sculpting',
    cons: 'Very polarizing. Tall. Limited sets.',
    image: '◉'
  },
  {
    name: 'Choc',
    height: 'Very Low',
    sculpted: 'Slight',
    sound: 'High/Clacky',
    popular: 'Kailh Choc',
    desc: 'For Kailh low-profile switches only.',
    feel: 'Laptop-like. Fast typing.',
    bestFor: 'Low-profile builds, portable',
    cons: 'Only works with Choc switches.',
    image: '⌄'
  }
];

const materials = [
  { name: 'ABS', desc: 'Smooth, shiny over time, thins out', sound: 'Higher pitch', feel: 'Smooth, can get slippery', cost: '$$' },
  { name: 'PBT', desc: 'Textured, durable, resists shine', sound: 'Deeper, matte', feel: 'Grippy, sand-like', cost: '$$$' },
  { name: 'POM', desc: 'Self-lubricating, very smooth', sound: 'Deep', feel: 'Glassy smooth', cost: '$$$$' }
];

const makers = [
  { name: 'GMK', location: 'Germany', price: '$$$', wait: '6-12 months', quality: 'Premium', notes: 'Doubleshot ABS. The standard for colorways.' },
  { name: 'Signature Plastics', location: 'USA', price: '$$$', wait: '2-4 months', quality: 'Good', notes: 'SA, DSA, DCS profiles. Made to order.' },
  { name: 'EnjoyPBT', location: 'China', price: '$$', wait: 'In stock', quality: 'Very Good', notes: 'Cherry profile PBT. Great value.' },
  { name: 'Akko', location: 'China', price: '$', wait: 'In stock', quality: 'Good', notes: 'Budget friendly. ASA profile exclusive.' },
  { name: 'Drop', location: 'USA', price: '$$$', wait: 'In stock', quality: 'Very Good', notes: 'MT3 profile. Good QC.' },
  { name: 'ePBT', location: 'China', price: '$$', wait: '2-6 months', quality: 'Good', notes: 'EnjoyPBT group buy arm. Cherry profile.' }
];

export default function KeycapProfilesGuide() {
  useScrollToTop();
  usePageSEO({
    title: 'Keycap Profiles Guide | Cherry SA OEM DSA Explained | Switchyard',
    description: 'Complete keycap profile guide: Cherry, SA, OEM, DSA, XDA, MT3, KAT. Sculpted vs uniform, ABS vs PBT materials, and which profile to choose.',
    keywords: 'keycap profiles, Cherry profile, SA keycaps, OEM vs Cherry, DSA keycaps, XDA profile, MT3 keycaps, keycap guide'
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Deep Dive</span>
          <h1>Keycap Profiles Explained</h1>
          <p className="guide-intro">
            The shape of your keycaps changes everything: feel, sound, speed. Find your profile.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>Profile Comparison</h2>
            
            <div className="profile-grid">
              {profiles.map((p) => (
                <div key={p.name} className="profile-card">
                  <div className="profile-header">
                    <div className="profile-icon">{p.image}</div>
                    <h3>{p.name}</h3>
                    <span className="profile-badge">{p.height}</span>
                  </div>
                  
                  <p className="profile-desc">{p.desc}</p>
                  
                  <div className="profile-specs">
                    <div><strong>Sound:</strong> {p.sound}</div>
                    <div><strong>Sculpted:</strong> {p.sculpted}</div>
                    <div><strong>Popular:</strong> {p.popular}</div>
                  </div>
                  
                  <div className="profile-details">
                    <p><strong>Feel:</strong> {p.feel}</p>
                    <p><strong>Best for:</strong> {p.bestFor}</p>
                    <p className="profile-cons"><strong>Cons:</strong> {p.cons}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Sculpted vs Uniform</h2>
            
            <div className="comparison-cards">
              <div className="compare-card">
                <h3>Sculpted (Cherry, SA, OEM)</h3>
                <p>Each row has a different height and angle. Creates a "dish" that cups your fingers.</p>
                <ul>
                  <li>✓ Easier to find home row</li>
                  <li>✓ Less finger travel</li>
                  <li>✓ Better for touch typing</li>
                </ul>
              </div>
              
              <div className="compare-card">
                <h3>Uniform (DSA, XDA)</h3>
                <p>Every keycap is identical. Flat surface. No angle changes.</p>
                <ul>
                  <li>✓ Can move keys anywhere</li>
                  <li>✓ Simpler aesthetic</li>
                  <li>✓ Good for non-standard layouts</li>
                  <li>✗ Harder to find home position</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Materials: ABS vs PBT</h2>
            
            <div className="materials-table">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Description</th>
                    <th>Sound</th>
                    <th>Feel</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {materials.map((m) => (
                    <tr key={m.name}>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.desc}</td>
                      <td>{m.sound}</td>
                      <td>{m.feel}</td>
                      <td>{m.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="tip-box">
              <p><strong>Pro tip:</strong> PBT is generally preferred for durability and texture. ABS is fine but will shine and thin over years of use. If buying ABS, get doubleshot (legends won't wear off).</p>
            </div>
          </section>

          <section>
            <h2>Keycap Makers</h2>
            
            <div className="makers-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Maker</th>
                    <th>Price</th>
                    <th>Wait Time</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {makers.map((m) => (
                    <tr key={m.name}>
                      <td><strong>{m.name}</strong></td>
                      <td>{m.price}</td>
                      <td>{m.wait}</td>
                      <td>{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Profile Recommendations</h2>
            
            <div className="recommendation-list">
              <div className="rec-line">
                <span className="rec-label">Starter:</span>
                <span className="rec-value">EnjoyPBT (Cherry profile PBT) or any PBT set</span>
              </div>
              <div className="rec-line">
                <span className="rec-label">Gaming:</span>
                <span className="rec-value">Cherry profile, lower height = faster</span>
              </div>
              <div className="rec-line">
                <span className="rec-label">Aesthetic:</span>
                <span className="rec-value">SA for retro, MT3 for extreme sculpt</span>
              </div>
              <div className="rec-line">
                <span className="rec-label">Budget:</span>
                <span className="rec-value">Akko, KPRepublic XDA on AliExpress</span>
              </div>
              <div className="rec-line">
                <span className="rec-label">Premium:</span>
                <span className="rec-value">GMK for colorways, SP SA for tall sculpted</span>
              </div>
            </div>
          </section>

          <section>
            <h2>Common Questions</h2>
            
            <div className="faq-list">
              <details className="faq-item">
                <summary>Can I mix keycap profiles?</summary>
                <p>You can but it changes feel. Some people use SA for alphas + Cherry for mods. Try it, but usually one profile is best.</p>
              </details>
              
              <details className="faq-item">
                <summary>Will SA profiles fit my keyboard?</summary>
                <p>Yes, but check if your keyboard has north-facing switches. Tall profiles + north-facing = keycap hitting switch housing (bad).</p>
              </details>
              
              <details className="faq-item">
                <summary>How long do keycaps last?</summary>
                <p>PBT: 5-10+ years. ABS: 2-5 years before shine. Doubleshot legends: forever. Dye-sub: very long.</p>
              </details>
              
              <details className="faq-item">
                <summary>Is GMK worth the price?</summary>
                <p>For the colorways and doubleshot crispness, yes. But the wait (6-12 months) is painful. EnjoyPBT is 90% of the quality for 50% of the price.</p>
              </details>
            </div>
          </section>

          <section className="cta-section">
            <h2>Find your profile</h2>
            <p>Browse keyboards and see what profiles are in stock.</p>
            <a href="/" className="cta-button">Browse Keyboards →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
