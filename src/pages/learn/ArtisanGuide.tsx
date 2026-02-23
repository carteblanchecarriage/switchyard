import React, { useState } from 'react';
import Layout from '../../components/Layout';
import './GuidePages.css';

const makers = [
  { name: 'KeyForge', url: 'keyforge.com', desc: 'Known for the iconic Mulder and Ori sculpts. Multi-shot resin casting masters with incredible depth and detail.', sculpts: '2', price: '$65+', material: 'Resin', icon: '[F]' },
  { name: 'Jelly Key', url: 'jellykey.com', desc: 'The Zen Pond series defined the artisan scene. 3D resin scenes with koi fish swimming inside clear resin blocks.', sculpts: '5+', price: '$85+', material: 'Resin', icon: '[M]' },
  { name: 'Rama Works', url: 'rama.works', desc: 'CNC machined aluminum and brass artisans. Clean, minimalist designs with premium anodized finishes.', sculpts: '10+', price: '$45+', material: 'Metal', icon: '[G]' },
  { name: 'Alpha Keycaps', url: 'alphakeycaps.com', desc: 'Cute character sculpts like Salvador (dog) and Matapora. Hand-painted with incredible attention to facial expressions.', sculpts: '5+', price: '$85+', material: 'Resin', icon: '[D]' },
  { name: 'Dwarf Factory', url: 'dwarf-factory.com', desc: 'Fantasy and nature themed sculpts. The Kraken, Ducky, and Moon collections are community favorites.', sculpts: '8+', price: '$55+', material: 'Resin', icon: '[W]' },
  { name: 'Gothcaps', url: 'gothcaps.com', desc: 'Dark, demonic themes with UV-reactive elements. Perfect for gothic builds. Hellfire and Hex collections are standout.', sculpts: '4', price: '$75+', material: 'UV Resin', icon: '[B]' }
];

const tiers = [
  { level: 'Entry Level', price: '$30-60', items: ['Hot Keys Project - Superhero themes', 'Rama Works - Simple metal designs', 'Dwarf Factory - Standard colorways', 'Fraktal Kaps - Organic shapes'] },
  { level: 'Mid Tier', price: '$60-100', items: ['KeyForge - Mulder, Ori sculpts', 'Alpha Keycaps - Salvador, Matapora', 'Gothcaps - UV reactive dark themes', 'The Key Company - Premium collabs'] },
  { level: 'High End', price: '$100+', items: ['Jelly Key - Zen Pond III scenes', 'Oblotzky - GMK collab artisans', 'Brocaps - Brobot, BBv2 series', 'GAF - Grimey as Fu$k (rare grails)'] },
  { level: 'Grail Tier', price: '$500+', items: ['OG Clack Factory - Skulls', 'Vintage Brocaps - 1-off customs', 'GAF TypeBeasts - Rare drops', 'Maker 1-offs - Auction customs'] }
];

export default function ArtisanGuide() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Deep Dive</span>
          <h1>Artisan Keycaps</h1>
          <p className="guide-intro">
            Tiny sculptures for your keyboard. Handcrafted by skilled artisans using resin, metal, and passion.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>What are Artisan Keycaps?</h2>
            <p>
              Artisan keycaps are handmade, often one-of-a-kind keycaps created by individual makers or small studios. 
              Unlike mass-produced keycaps, each artisan piece is crafted with meticulous attention to detail, featuring 
              intricate sculpts, unique colorways, and premium materials.
            </p>

            <div className="feature-grid">
              <div className="feature-card">
                <h4>✨ Unique Design</h4>
                <p>No two artisan keycaps are exactly alike. Makers often create limited runs of just dozens or hundreds of pieces.</p>
              </div>
              <div className="feature-card">
                <h4>💎 Premium Materials</h4>
                <p>Cast in resin, machined from aluminum or brass, featuring embedded elements like glow-in-the-dark pigments.</p>
              </div>
              <div className="feature-card">
                <h4>👑 Collector's Items</h4>
                <p>Rares can command hundreds of dollars on the secondary market. True mechanical keyboard bling.</p>
              </div>
              <div className="feature-card">
                <h4>🔍 Attention to Detail</h4>
                <p>Every tiny element carefully sculpted, painted, and finished by hand. Microscopic works of art.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Top Artisan Makers</h2>
            <div className="makers-grid">
              {makers.map((maker) => (
                <div key={maker.name} className="maker-card">
                  <div className="maker-header">
                    <div className="maker-avatar">{maker.icon}</div>
                    <div className="maker-info">
                      <h3>{maker.name}</h3>
                      <span>{maker.url}</span>
                    </div>
                  </div>
                  <p>{maker.desc}</p>
                  <div className="maker-stats">
                    <div><strong>{maker.sculpts}</strong>Sculpts</div>
                    <div><strong>{maker.price}</strong>Entry Price</div>
                    <div><strong>{maker.material}</strong>Material</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Artisan Keycap Guide</h2>
            
            <div className="tier-tabs">
              {tiers.map((tier, i) => (
                <button
                  key={tier.level}
                  className={`tier-tab ${i === activeTab ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {tier.level}
                  <span className="tier-price">{tier.price}</span>
                </button>
              ))}
            </div>

            <div className="tier-content">
              <ul>
                {tiers[activeTab].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="cta-section">
            <h2>Find Artisan Keycaps</h2>            
            <p>Browse our collection of artisan keycaps from top makers.</p>
            
            <a href="/?filter=artisan" className="cta-button">             View Artisan Products →
            </a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
