import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const timeline = [
  {
    step: '1',
    title: 'Interest Check (IC)',
    desc: 'Designers gauge community interest in a potential product. They share renders, specifications, and pricing estimates. Feedback shapes the final design. Usually lasts 1-4 weeks.',
    duration: '1-4 weeks'
  },
  {
    step: '2',
    title: 'Group Buy Opening',
    desc: 'The buy goes live on a vendor website. You select options (layout, color, accessories) and pay upfront. Popular group buys can sell out in minutes. Typically runs 1-2 weeks.',
    duration: '1-2 weeks'
  },
  {
    step: '3',
    title: 'Production',
    desc: 'After the buy closes, the vendor places orders with manufacturers (CNC machine shops, keycap factories, etc.). This is the longest phase—typically 3-12 months depending on complexity.',
    duration: '3-12 months'
  },
  {
    step: '4',
    title: 'Quality Control & Shipping',
    desc: 'Finished products arrive at the vendor, are inspected, and then shipped to customers. Expect 2-4 weeks after production completion.',
    duration: '2-4 weeks'
  }
];

const gbTypes = [
  { item: 'Keyboard Kits', examples: 'Aluminum cases, PCBs, plates, and all internals',
    price: '$200-500+', timeline: '4-12 months', risk: 'Medium' },
  { item: 'Keycap Sets', examples: 'GMK, ePBT, KAT, and other premium keycaps',
    price: '$80-180', timeline: '6-18 months', risk: 'Low' },
  { item: 'Artisan Keycaps', examples: 'Handcrafted resin sculpts from small makers',
    price: '$30-150', timeline: '2-6 months', risk: 'Low-Medium' },
  { item: 'Accessories', examples: 'Wrist rests, cables, deskmats',
    price: '$20-80', timeline: '2-4 months', risk: 'Low' },
  { item: 'Switches', examples: 'Custom colorways and limited collaborations',
    price: '$0.50-1.20/ea', timeline: '3-6 months', risk: 'Low' }
];

const platforms = [
  { name: 'Drop.com', specialization: 'Mass-market customs', timeline: '6-8 months' },
  { name: 'KBDfans', specialization: 'Entry to mid-range kits', timeline: '4-6 months' },
  { name: 'GMK', specialization: 'Premium keycap sets', timeline: '12-18 months' },
  { name: 'CannonKeys', specialization: 'High-end keyboards', timeline: '8-12 months' },
  { name: 'Artisan Makers', specialization: 'Custom sculptures', timeline: '2-6 months' }
];

export default function GroupBuysGuide() {
  useScrollToTop();
  usePageSEO({
    title: 'Mechanical Keyboard Group Buy Guide 2026 | How It Works | Switchyard',
    description: 'Everything about keyboard group buys: how they work, timelines, risks, and tips. GMK keycaps, custom kits, artisan pre-orders explained.',
    keywords: 'mechanical keyboard group buy, GB guide, GMK group buy, keyboard pre-order, group buy timeline, group buy risks'
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Deep Dive</span>
          <h1>What Are Group Buys?</h1>
          <p className="guide-intro">
            The complete guide to mechanical keyboard group buys. How they work, what to expect, and tips for a successful purchase.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>What is a Group Buy?</h2>
            
            <p>A <strong>group buy</strong> (often abbreviated as "GB") is essentially a pre-order for a product that doesn't exist yet. Instead of buying a keyboard that's already manufactured and sitting in a warehouse, you're helping to fund its production.</p>
            
            <div className="tip-box">
              <h4>💡 Key Concept</h4>
              <p>Group buys are crowdfunding campaigns for keyboard products. You pay upfront, the designer/vendor collects orders from hundreds or thousands of people, then manufactures the products in bulk. This reduces costs and enables unique designs that couldn't exist as mass-market products.</p>
            </div>
          </section>

          <section>
            <h2>The Group Buy Lifecycle</h2>
            
            <p>A typical group buy goes through several stages. Here's what to expect:</p>
            
            <div className="timeline-container">
              {timeline.map((item) => (
                <div key={item.step} className="timeline-item-enhanced">
                  <div className="timeline-number">{item.step}</div>
                  <div className="timeline-content">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <span className="timeline-badge">{item.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>What Products Use Group Buys?</h2>
            
            <p>Almost everything in the custom keyboard world uses group buy fulfillment:</p>
            
            <div className="gb-table-wrapper">
              <table className="gb-type-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Examples</th>
                    <th>Price Range</th>
                    <th>Timeline</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {gbTypes.map((type) => (
                    <tr key={type.item}>
                      <td><strong>{type.item}</strong></td>
                      <td>{type.examples}</td>
                      <td>{type.price}</td>
                      <td>{type.timeline}</td>
                      <td><span className={`risk-badge risk-${type.risk.toLowerCase().replace('-', '')}`}>{type.risk}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Popular Group Buy Platforms</h2>
            
            <div className="platform-grid">
              {platforms.map((platform) => (
                <div key={platform.name} className="platform-card">
                  <h3>{platform.name}</h3>
                  <p><strong>Specialization:</strong> {platform.specialization}</p>
                  <span className="platform-timeline">⏱️ {platform.timeline}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>⚠️ Risks to Understand</h2>
            
            <div className="warning-box">
              <ul className="styled-list">
                <li><strong>Production Delays:</strong> Timeline estimates are often missed. Add 3-6 months buffer to any estimate.</li>
                <li><strong>Vendor/GB Runner Risk:</strong> Rare but possible: vendor goes under or abandons project. Usually some recourse but no guarantees.</li>
                <li><strong>Quality Issues:</strong> Defects happen. Most vendors will replace, but requires shipping items back.</li>
                <li><strong>Long Wait Times:</strong> Your money is tied up for months. Don't buy GB items with money you might need.</li>
                <li><strong>No Cancellations:</strong> Once joined, you're committed. No refunds unless GB fails to meet minimum order.</li>
              </ul>
            </div>          </section>

          <section>
            <h2>✅ Group Buy Success Tips</h2>
            
            <div className="tips-list enhanced">
              <div className="tip-item">
                <span className="tip-number">1</span>
                <div>
                  <h4>Research the vendor</h4>
                  <p>Check their history. First-time GB runners are riskier than established vendors.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">2</span>
                <div>
                  <h4>Join Discord/communities</h4>
                  <p>Most vendors have Discords where they post updates before anywhere else.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">3</span>
                <div>
                  <h4>Be ready on opening day</h4>
                  <p>Popular GBs sell out. Have payment info ready. Know what options you want.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">4</span>
                <div>
                  <h4>Buy extras if available</h4>
                  <p>PCBs and plates are often available. If your PCB dies years later, extras are gold.</p>
                </div>
              </div>
              <div className="tip-item">
                <span className="tip-number">5</span>
                <div>
                  <h4>Don't stress delays</h4>
                  <p>Almost every GB is delayed. It's the nature of the business. Be patient.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <h2>Ready to explore group buys?</h2>            
            <p>Browse our live dashboard for current group buys and in-stock alternatives.</p>            
            <a href="/" className="cta-button">Browse All Products →</a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
