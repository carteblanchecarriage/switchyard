import React from 'react';
import Layout from '../components/Layout';
import { usePageSEO } from '../hooks/usePageSEO';
import { useScrollToTop } from '../hooks/useScrollToTop';

const switchTypes = [
  {
    type: 'Linear',
    icon: '➡️',
    desc: 'Smooth keystrokes from top to bottom. No tactile bump or audible click.',
    feel: 'Like sliding on ice. Consistent resistance.',
    sound: 'Low to moderate. Smooth bottom-out sound.',
    bestFor: ['Gaming', 'Fast typing', 'Shared spaces'],
    popular: ['Cherry MX Red', 'Gateron Yellow', 'Cherry MX Black', 'Tangerine'],
    actuation: '45-60g'
  },
  {
    type: 'Tactile',
    icon: '⛰️',
    desc: 'Noticeable bump at actuation point. Feedback you can feel without extra noise.',
    feel: 'Small "snap" when key registers. You feel the activation point.',
    sound: 'Moderate. Thocky or clacky depending on housing.',
    bestFor: ['Typing', 'Programming', 'General use'],
    popular: ['Cherry MX Brown', 'Holy Panda', 'Cherry MX Clear', 'Zealios'],
    actuation: '55-67g'
  },
  {
    type: 'Clicky',
    icon: '🔔',
    desc: 'Tactile bump PLUS audible click. Satisfying feedback, but noticeably louder.',
    feel: 'Distinct bump with audible confirmation. Very tactile.',
    sound: 'Loud. Click mechanism makes noise on actuation.',
    bestFor: ['Typing enthusiasts', 'Private offices', 'ASMR'], 
    popular: ['Cherry MX Blue', 'Kailh Box White', 'Cherry MX Green', 'Navy'],
    actuation: '50-80g'
  }
];

const popularSwitches = [
  { name: 'Cherry MX Red', type: 'Linear', force: '45g', travel: '2.0mm', rating: 4.2, bestFor: 'Gaming', price: '$0.40/ea', desc: 'The gaming standard. Light, fast, and smooth. Found in most gaming keyboards.' },
  { name: 'Cherry MX Brown', type: 'Tactile', force: '55g', travel: '2.0mm', rating: 4.0, bestFor: 'General Use', price: '$0.40/ea', desc: 'Jack of all trades. Tactile bump without the click noise. Office-friendly.' },
  { name: 'Cherry MX Blue', type: 'Clicky', force: '50g', travel: '2.2mm', rating: 3.8, bestFor: 'Typing', price: '$0.45/ea', desc: 'The classic clicky switch. Loud and proud. Not for shared spaces.' },
  { name: 'Cherry MX Black', type: 'Linear', force: '60g', travel: '2.0mm', rating: 4.3, bestFor: 'Heavy Gaming', price: '$0.40/ea', desc: 'Like Red but heavier. Prevents accidental presses. Popular with FPS players.' },
  { name: 'Gateron Yellow', type: 'Linear', force: '50g', travel: '2.0mm', rating: 4.5, bestFor: 'Budget Gaming', price: '$0.25/ea', desc: 'Smoother than Cherry Reds at half the price. The budget king.' },
  { name: 'Holy Panda', type: 'Tactile', force: '67g', travel: '2.0mm', rating: 4.7, bestFor: 'Enthusiast Typing', price: '$1.20/ea', desc: 'Premium tactile feel. Deep "thock" sound. Custom/aftermarket only.' },
  { name: 'Kailh Box White', type: 'Clicky', force: '50g', travel: '1.8mm', rating: 4.4, bestFor: 'Clicky Gaming', price: '$0.35/ea', desc: 'Crisp click with Box stem dust protection. Waterproof rating.' },
  { name: ' Cherry MX Speed/Silver', type: 'Linear', force: '45g', travel: '1.2mm', rating: 4.1, bestFor: 'Competitive Gaming', price: '$0.50/ea', desc: 'Ultra-short travel for fastest reaction times. Easy to mistype.' }
];

const specsExplained = [
  { term: 'Actuation Force', desc: 'How hard you press before the key registers. Measured in grams (g).', examples: '45g = Light, 60g = Medium, 80g = Heavy' },
  { term: 'Actuation Point', desc: 'How far you press before it registers. Shorter = faster.', examples: '1.2mm = Super fast, 2.0mm = Standard, 2.2mm = Deliberate' },
  { term: 'Total Travel', desc: 'Total distance the key can move. Affects bottom-out feel.', examples: '3.4mm = Standard, 4.0mm = Deep, <2mm = Low-profile' },
  { term: 'Spring Weight', desc: 'The spring inside the switch. Heavier = more resistance.', examples: 'Bottom-out force is typically 15-20g higher than actuation' }
];

const useCaseRecs = [
  { use: 'Competitive Gaming', rec: 'Linear (Red/Silver)', why: 'Fastest actuation, no tactile bump to slow you down' },
  { use: 'Programming/Coding', rec: 'Tactile (Brown/Clear)', why: 'Feedback confirms registration without fatigue' },
  { use: 'Office/Shared Space', rec: 'Tactile (Brown)', why: 'Not as loud as clicky but more feedback than linear' },
  { use: 'Writing/Authoring', rec: 'Clicky (Blue/White)', why: 'Audio feedback rhythm helps some writers' },
  { use: 'Data Entry', rec: 'Clicky or Heavy Tactile', why: 'Clear confirmation prevents double-presses' },
  { use: 'First Mechanical', rec: 'Tactile (Brown)', why: 'Best balance - you feel the difference vs membrane' }
];

const noiseLevels = [
  { level: 'Quiet', switches: 'Cherry MX Silent Red, Gateron Silent Brown', db: '~40dB', context: 'Library acceptable' },
  { level: 'Normal', switches: 'Cherry MX Red, Brown, Black', db: '~50dB', context: 'Office appropriate' },
  { level: 'Moderate', switches: 'Holy Panda, Boba U4T', db: '~55dB', context: 'Private office' },
  { level: 'Loud', switches: 'Cherry MX Blue, Green, Box White', db: '~65dB', context: 'Home office only' }
];

export default function SwitchGuide() {
  useScrollToTop();
  
  usePageSEO({
    title: "Complete Mechanical Switch Guide 2026 | Linear vs Tactile vs Clicky | Switchyard",
    description: "The ultimate mechanical keyboard switch guide. Compare Cherry MX Red, Brown, Blue, Holy Panda, and more. Learn about actuation force, travel distance, sound profiles, and find the perfect switch for gaming, typing, or office work.",
    keywords: "mechanical keyboard switches, linear vs tactile, Cherry MX guide, switch comparison, gaming switches, typing switches, actuation force, loud vs quiet switches, Holy Panda, Gateron Yellow"
  });

  return (
    <Layout>
      <div className="guide-content">
        <header className="guide-header-section">
          <h1>Mechanical Switch Guide</h1>
          <p className="guide-intro">
            The switch defines your typing experience more than any other component. 
            Learn the differences between linear, tactile, and clicky — and find your perfect match.
          </p>
        </header>

        <section className="guide-section">
          <h2>The Three Switch Types</h2>
          <p className="section-intro">
            Every mechanical switch falls into one of three categories. Understanding these 
            is 90% of choosing the right switch.
          </p>

          <div className="switch-types-grid">
            {switchTypes.map((s) => (
              <div key={s.type} className={`switch-card ${s.type.toLowerCase()}`}>
                <div className="switch-header">
                  <span className="switch-icon">{s.icon}</span>
                  <h3>{s.type}</h3>
                </div>
                <p className="switch-desc">{s.desc}</p>
                
                <div className="switch-details">
                  <div className="detail-row">
                    <strong>Feel:</strong> {s.feel}
                  </div>
                  <div className="detail-row">
                    <strong>Sound:</strong> {s.sound}
                  </div>
                  <div className="detail-row">
                    <strong>Actuation:</strong> {s.actuation}
                  </div>
                </div>

                <div className="switch-best">
                  <strong>Best for:</strong> {s.bestFor.join(', ')}
                </div>

                <div className="popular-switches">
                  <strong>Popular:</strong> {s.popular.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section">
          <h2>Popular Switches Compared</h2>
          <p className="section-intro">
            These are the switches you will actually find in keyboards. We have rated them 
            based on community feedback and our own testing.
          </p>

          <div className="switches-comparison-table">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Switch</th>
                  <th>Type</th>
                  <th>Force</th>
                  <th>Travel</th>
                  <th>Best For</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {popularSwitches.slice(0, 8).map((sw) => (
                  <tr key={sw.name}>
                    <td><strong>{sw.name}</strong></td>
                    <td><span className={`type-badge ${sw.type.toLowerCase()}`}>{sw.type}</span></td>
                    <td>{sw.force}</td>
                    <td>{sw.travel}</td>
                    <td>{sw.bestFor}</td>
                    <td>{sw.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>Switch Specs Explained</h2>
          <p className="section-intro">
            Understanding these four specs will help you read switch descriptions like a pro.
          </p>

          <div className="specs-grid">
            {specsExplained.map((spec) => (
              <div key={spec.term} className="spec-card">
                <h3>{spec.term}</h3>
                <p>{spec.desc}</p>
                <div className="spec-examples">{spec.examples}</div>
              </div>
            ))}
          </div>

          <div className="tip-box">
            <strong>Pro Tip:</strong> Actuation point matters more than force for speed. 
            Cherry MX Silver (1.2mm) activates 40% sooner than standard switches (2.0mm).
          </div>
        </section>

        <section className="guide-section">
          <h2>Recommendations by Use Case</h2>

          <div className="use-case-grid">
            {useCaseRecs.map((rec) => (
              <div key={rec.use} className="use-case-card">
                <h3>{rec.use}</h3>
                <div className="rec-switch">{rec.rec}</div>
                <p>{rec.why}</p>
              </div>
            ))}
  </div>
        </section>

        <section className="guide-section">
          <h2>Noise Level Guide</h2>
          <p className="section-intro">
            Noise is often the deciding factor. Here is what to expect in decibels and real-world context.
          </p>

          <div className="noise-table">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Switches</th>
                  <th>Decibels</th>
                  <th>Where</th>
                </tr>
              </thead>
              <tbody>
                {noiseLevels.map((n) => (
                  <tr key={n.level}>
                    <td><strong>{n.level}</strong></td>
                    <td>{n.switches}</td>
                    <td>{n.db}</td>
                    <td>{n.context}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>Specialty Switches</h2>
          
          <div className="specialty-switches">
            <h3>Speed Switches</h3>
            <p>
              Cherry MX Silver, Kailh Speed, Gateron Yellow KS-9. Shorter actuation (1.2-1.4mm) 
              for competitive gaming. Higher typo risk but fastest response.
            </p>

            <h3>Silent Switches</h3>
            <p>
              Cherry MX Silent Red/Brown, Gateron Silent switches. Rubber dampeners inside 
              reduce bottom-out noise by ~40%. Great for open offices or night gaming.
            </p>

            <h3>Low-Profile Switches</h3>
            <p>
              Cherry MX Low Profile, Kailh Choc. Shorter travel (1.0-1.5mm actuation) for 
              slim keyboards. Different feel — try before committing.
            </p>

            <h3>Optical/Hall Effect</h3>
            <p>
              Uses light or magnets instead of metal contacts. Faster response, longer lifespan 
              (100M keystrokes), adjustable actuation on some models like Wooting HE.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>How to Try Before Buying</h2>
          
          <div className="try-options">
            <h3>Switch Tester Kits</h3>
            <p>
              Buy a tester with 9-12 switches (usually $15-25) to feel the differences. 
              Amazon sells them, or buy from mechanical keyboard retailers like NovelKeys or DROP.
            </p>

            <h3>Hot-Swap Keyboards</h3>
            <p>
              Best option: buy a hot-swap keyboard and try different switches. 
              Swap them in seconds without soldering. Keychron, Akko, and RK make affordable hot-swap boards.
            </p>

            <h3>r/mechmarket</h3>
            <p>
              Buy small quantities of switches from Reddit users. Usually $0.30-0.60 each 
              with small shipping costs. Great for testing 10-20 different switches.
            </p>
          </div>

          <div className="warning-box">
            <strong>Warning:</strong> Do not trust typing tests alone. The sound you hear 
            in YouTube videos depends on the keyboard case, plate material, keycaps, and recording equipment. 
            Feel matters more than recorded sound.
          </div>
        </section>

        <section className="guide-section">
          <h2>Switch Testers and Starter Kits</h2>
          <p>
            Can't decide? These switch testers let you try before you buy. 
            Most include 9-12 popular switch types.
          </p>
          
          <div className="product-card">
            <h3>Glorious GMMK Switch Tester</h3>
            <p>12-switch tester with popular Gateron, Kailh, and Cherry options. 
            Includes carrying case. Perfect for first-time buyers.</p>
            <a href="/?search=Glorious+switch+tester&category=keyboard" className="cta-button">Find Switch Tester →</a>
          </div>
          
          <div className="product-card">
            <h3>NovelKeys Switch Tester</h3>
            <p>Enthusiast-focused tester with premium switches including Holy Pandas, 
            Zealios, and Kailh BOX. Higher end options.</p>
            <a href="/?search=NovelKeys+switch+tester&category=keyboard" className="cta-button">Find NovelKeys Tester →</a>
          </div>
          
          <div className="product-card">
            <h3>Amazon 9-Switch Tester</h3>
            <p>Budget option with basic Cherry MX variants (Red, Brown, Blue, Black). 
            Under $15 and ships fast.</p>
            <a href="/?search=9+switch+tester&category=keyboard" className="cta-button">Find Budget Tester →</a>
          </div>
          
          <div className="highlight-box info">
            <strong>Pro Tip:</strong> If you're serious about finding your perfect switch, 
            buy a hot-swap keyboard as your first board. You can try 10+ switches over time 
            without buying a tester you'll never use again.
          </div>
        </section>

        <section className="guide-section">
          <h2>Making Your Decision</h2>
          
          <div className="decision-framework">
            <ol className="decision-steps">
              <li>
                <strong>Start with use case:</strong> Gaming = Linear, Work = Tactile, 
                Private typing enjoyment = Clicky
              </li>
              <li>
                <strong>Consider your environment:</strong> Shared space = avoid clicky, 
                Private = anything goes
              </li>
              <li>
                <strong>Pick a budget tier:</strong> Budget (~$0.25/switch), Mid (~$0.50/switch), 
                Premium (~$1.00+/switch)
              </li>
              <li>
                <strong>Choose popular options first:</strong> Cherry MX Brown/Red are safe defaults. 
                Branch out once you know your preferences.
              </li>
            </ol>
          </div>
        </section>

        <section className="cta-section">
          <h2>Find Keyboards With Your Perfect Switch</h2>
          <p>
            Use our wizard to find keyboards with the switches you want, or <a href="/?category=switches">browse our switch database</a> with live pricing.
          </p>
          <p><a href="/?category=switches" className="cta-button">Browse All Switches →</a></p>
          <p className="related-links">
            Popular: <a href="/?search=Cherry+MX+Red">Cherry MX Red</a> • 
            <a href="/?search=Gateron+Yellow">Gateron Yellow</a> • 
            <a href="/?search=Cherry+MX+Brown">Cherry MX Brown</a> •
            <a href="/?search=Cherry+MX+Blue">Cherry MX Blue</a> •
            <a href="/?search=Holy+Panda">Holy Panda</a>
          </p>
        </section>
      </div>
    </Layout>
  );
}
