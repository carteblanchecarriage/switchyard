import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
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

const platforms = [
  { name: 'r/mechmarket', type: 'Reddit', desc: 'The largest artisan marketplace. Auctions, raffles, and sales posted daily. High scam risk - use PayPal G&S.', tip: 'Check seller karma and trade history' },
  { name: 'Drop', type: 'Vendor', desc: 'Official collaborations with makers. Lower prices, longer wait times. Reliable shipping.', tip: 'Sign up for email alerts' },
  { name: 'Makers Instagram', type: 'Social', desc: 'Most artisans announce sales on Instagram first. Raffles, FCFS, or commissions.', tip: 'Turn on post notifications' },
  { name: 'Discord', type: 'Community', desc: 'Maker-specific Discords for exclusive sales and GB updates. Very active.', tip: 'Join official maker Discords' },
  { name: 'eBay', type: 'Secondary', desc: 'For hard-to-find caps. Prices often inflated. High scam risk.', tip: 'Only buy from established sellers' }
];

const collectingTips = [
  { title: 'Start Small', desc: 'Do not chase grails first. Buy a $50 artisan to understand the hype before spending hundreds.' },
  { title: 'Follow Makers', desc: 'Instagram is where sales happen. Turn on notifications for your favorite makers.' },
  { title: 'Set a Budget', desc: 'Artisan collecting is addictive. Set monthly limits or you will empty your wallet.' },
  { title: 'Storage Matters', desc: 'Store in protective cases or foam. Sunlight degrades resin over time.' },
  { title: 'Profile Matching', desc: 'Artisans are usually R1 (ESC) profile. Check compatibility with your keycap set.' }
];

const scamSigns = [
  { sign: 'Too Good to Be True', desc: 'A $500 cap for $50 is almost certainly fake or a scam.' },
  { sign: 'No Trade History', desc: 'New accounts selling rare artisans = red flag. Check r/mechmarket flair.' },
  { sign: 'Stock Photos Only', desc: 'Scammers use official product images. Ask for timestamped photos.' },
  { sign: 'Friends & Family', desc: 'Never pay F&F on PayPal. Always use Goods & Services for buyer protection.' },
  { sign: 'Rushed Sales', desc: '"Act now or I will sell to someone else" is pressure tactics. Walk away.' }
];

export default function ArtisanGuide() {
  const [activeTab, setActiveTab] = useState(0);

  usePageSEO({
    title: "Artisan Keycaps Guide | Custom & Collectible | Switchyard",
    description: "Everything about artisan keycaps: top makers like Jelly Key and KeyForge, price tiers, where to buy, avoiding scams, and how to start collecting. Tiny sculptures for your keyboard.",
    keywords: "artisan keycaps, custom keycaps, Jelly Key, KeyForge, Rama Works, artisan guide, collectible keycaps, mechanical keyboard art"
  });

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
            <h2>Price Tiers Guide</h2>
            
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

          <section>
            <h2>Where to Buy Artisan Keycaps</h2>
            
            <div className="platform-grid">
              {platforms.map((platform) => (
                <div key={platform.name} className="platform-card">
                  <h3>{platform.name}</h3>
                  <span className="platform-type">{platform.type}</span>
                  <p>{platform.desc}</p>
                  <div className="platform-tip">
                    <strong>Tip:</strong> {platform.tip}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>Collecting Tips for Beginners</h2>
            
            <div className="tips-list enhanced">
              {collectingTips.map((tip, i) => (
                <div key={tip.title} className="tip-item">
                  <span className="tip-number">{i + 1}</span>
                  <div>
                    <h4>{tip.title}</h4>
                    <p>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2>⚠️ Scam Warning Signs</h2>
            
            <div className="warning-box">
              <p className="warning-intro">The artisan market has scammers. Protect yourself by knowing these red flags:</p>
              
              <div className="scam-list">
                {scamSigns.map((scam) => (
                  <div key={scam.sign} className="scam-item">
                    <h4>{scam.sign}</h4>
                    <p>{scam.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="safety-tip">
                <strong>Always require:</strong> Timestamped photos with username, PayPal Goods & Services payment, and trade history verification on r/mechmarket.
              </div>
            </div>
          </section>

          <section>
            <h2>Making Your Own Artisans</h2>
            
            <div className="maker-info-panel">
              <p>Interested in becoming an artisan maker? Here is the typical journey:</p>
              
              <ol className="maker-steps">
                <li><strong>Learn sculpting:</strong> Start with polymer clay or wax. Practice small designs.</li>
                <li><strong>Master casting:</strong> Learn mold making and resin casting techniques.</li>
                <li><strong>Build reputation:</strong> Post work on Reddit, Instagram. Offer free commissions at first.</li>
                <li><strong>First sale:</strong> Small run of 10-20 caps. Price low to build trust.</li>
                <li><strong>Grow:</strong> Consistent quality leads to demand. Eventually can make it a side income.</li>
              </ol>
              
              <p className="maker-note">Most successful makers spent 1-2 years perfecting their craft before charging premium prices.</p>
            </div>
          </section>

          <section className="cta-section">
            <h2>Find Artisan Keycaps</h2>            
            <p>Browse our collection of artisan keycaps from top makers and sellers.</p>
            
            <a href="/?category=artisan" className="cta-button">             View Artisan Products →
            </a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
