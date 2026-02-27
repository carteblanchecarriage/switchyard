import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

const gameTypes = [
  { icon: '🎯', name: 'FPS', examples: 'Valorant, CS2, Apex', needs: 'Fast actuation, anti-ghosting, N-key rollover' },
  { icon: '⚔️', name: 'MOBA', examples: 'League, Dota 2', needs: 'Macros, comfortable for long sessions' },
  { icon: '🎮', name: 'MMO', examples: 'WoW, FFXIV', needs: 'Macros, extra keys, full-size layout' }
];

const topPicks = [
  {
    badge: '🏆 BEST OVERALL',
    name: 'Wooting 60HE',
    price: '$175',
    desc: 'The keyboard that broke the rules. Analog Hall Effect switches with 0.1mm adjustable actuation. This is what the pros actually use.',
    specs: ['⚡ 0.1mm-4.0mm adjustable actuation', '⌨️ 60% Layout', '🔌 USB-C', '🎨 RGB per-key'],
    pros: ['Rapid Trigger (faster releases)', 'Adjustable actuation per-key', 'True analog input', 'Tournament legal'],
    cons: ['Expensive ($175+)', '60% learning curve', 'Waitlist for orders'],
    bestFor: 'Serious competitive FPS players who want every advantage.'
  },
  {
    badge: '💰 BEST VALUE',
    name: 'Keychron K8 Pro',
    price: '$110',
    desc: 'Wireless TKL with low-latency 2.4GHz dongle. Hot-swap for easy switch upgrades. The best "just works" gaming keyboard.',
    specs: ['📡 2.4GHz Wireless', '⌨️ TKL Layout', '🔩 Hot-swap', '💵 $110'],
    pros: ['Low latency wireless', 'Creamy pre-lubed switches', 'Bluetooth + 2.4GHz', 'Mac/Windows switch'],
    cons: ['Not as fast as Wooting', 'No per-key RGB'],
    bestFor: 'Gamers who want wireless freedom without sacrificing performance.'
  },
  {
    badge: '🎮 MMO PICK',
    name: 'Logitech G915 TKL',
    price: '$230',
    desc: 'Low-profile mechanical switches in a wireless TKL. LIGHTSPEED wireless is tournament-grade. Dedicated macro keys out of the box.',
    specs: ['📡 LIGHTSPEED Wireless', '⌨️ TKL + Macros', '⚡ 1ms Response', '💵 $230'],
    pros: ['5 dedicated G-keys', '40-hour battery', 'Low profile = less fatigue', 'G Hub software'],
    cons: ['More expensive', 'Proprietary switches', 'Software required for macros'],
    bestFor: 'MMO players who need macros and long battery life.'
  }
];

export default function BestGamingGuide() {
  useScrollToTop();
  usePageSEO({
    title: "Best Gaming Mechanical Keyboards 2026 | Low Latency Picks | Switchyard",
    description: "Top gaming keyboards for competitive play: Wooting 60HE, Keychron K8 Pro, and Logitech G915. Low latency, fast switches, RGB, and features that actually matter for FPS, MOBA, and MMO games.",
    keywords: "best gaming keyboard 2026, competitive gaming keyboard, low latency keyboard, Wooting 60HE, Keychron K8 Pro, FPS gaming keyboard, esports keyboard, RGB gaming keyboard"
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section gaming-hero">
          <span className="guide-tag">Recommendations</span>
          <h1>Best Gaming Mechanical Keyboards</h1>
          <p className="guide-intro">
            Tournament-ready picks for competitive play. Low latency, fast switches, and the features that actually matter for gaming.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>What Gamers Actually Need</h2>
            
            <div className="game-type-grid">
              {gameTypes.map((game) => (
                <div key={game.name} className="game-type-card">
                  <div className="game-icon">{game.icon}</div>
                  <h3>{game.name}</h3>
                  <p className="game-examples">{game.examples}</p>
                  <p className="game-needs"><strong>Need:</strong> {game.needs}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            {topPicks.map((pick) => (
              <div key={pick.name} className="gaming-pick-card">
                <div className="pick-header">
                  <span className="gaming-badge">{pick.badge}</span>
                </div>
                
                <h3>{pick.name}</h3>
                <p className="gaming-desc">{pick.desc}</p>
                
                <div className="specs-row">
                  {pick.specs.map((spec) => (
                    <span key={spec} className="spec-pill">{spec}</span>
                  ))}
                </div>
                
                <div className="pros-cons-grid">
                  <div className="pros-box">
                    <h4>Why It's Best:</h4>
                    <ul>
                      {pick.pros.map((pro) => (
                        <li key={pro}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="cons-box">
                    <h4>Consider:</h4>
                    <ul>
                      {pick.cons.map((con) => (
                        <li key={con}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <p className="best-for"><strong>Best For:</strong> {pick.bestFor}</p>
              </div>
            ))}
          </section>

          <section>
            <h2>Gaming Specs Explained</h2>
            
            <div className="specs-explained">
              <div className="spec-item">
                <h4>Polling Rate</h4>
                <p>How often the keyboard reports to your PC. 1000Hz = 1ms. Higher is better, but diminishing returns after 1000Hz.</p>
              </div>
              
              <div className="spec-item">
                <h4>N-Key Rollover (NKRO)</h4>
                <p>Press any number of keys simultaneously, all register. Essential for games with complex inputs.</p>
              </div>
              
              <div className="spec-item">
                <h4>Actuation Force</h4>
                <p>How hard you press before the key registers. Lighter (45g) = faster for gaming. Heavier = fewer accidental presses.</p>
              </div>
              
              <div className="spec-item">
                <h4>Debounce Time</h4>
                <p>Delay to prevent "chattering" (one press registering twice). Optical switches have near-zero debounce.</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Switches for Gaming: The Real Talk</h2>
            
            <p>
              Forget the marketing. Here&apos;s what actually matters for gaming switches:
            </p>
            
            <h3>Linear vs. Tactile for Gaming</h3>
            
            <p>
              <strong>Linear switches</strong> (Cherry MX Red, Gateron Yellow, Silver) are the gaming standard. 
              Why? No tactile bump means consistent, smooth presses. When every millisecond counts in competitive play, 
              you want zero interference between your finger and the actuation point. Linear switches deliver that pure, 
              uninterrupted force curve from top to bottom.
            </p>
            
            <p>
              <strong>Tactile switches</strong> (Cherry MX Brown, Holy Panda) have a &quot;bump&quot; you feel when the key activates. 
              While excellent for typing, that bump requires slightly more force and adds a tiny amount of travel time. 
              For casual gaming, you&apos;ll never notice. For competitive FPS at high levels, linear is preferred.
            </p>
            
            <h3>Speed Switches: Worth the Hype?</h3>
            
            <p>
              &quot;Speed&quot; switches like Cherry MX Silver and Gateron Yellow actuate at 1.2mm instead of the standard 2mm. 
              Sound impressive? The math says it saves about 5-10ms per keystroke. In CS2 or Valorant, that could theoretically 
              be the difference between you and your opponent firing first.
            </p>
            
            <p><strong>Reality check:</strong> The biggest factor in your reaction time is still you. Faster switches help, 
              but only at the margins of elite play. If you&apos;re already in the top 5% of players, speed switches might give you 
              an edge. For everyone else, focus on your aim and game sense first.</p>
            
            <h3>Bottom Line</h3>
            
            <ul>
              <li>Casual gaming: Any linear or light tactile works fine</li>
              <li>Competitive FPS: Linear switches (Red, Silver, Yellow)</li>
              <li>MMO/MOBA: Tactile is fine, macros matter more</li>
              <li>RPG/Story games: Whatever feels comfortable</li>
            </ul>
          </section>

          <section>
            <h2>Wireless vs. Wired for Gaming</h2>
            
            <p>
              Old wisdom said &quot;never game wireless.&quot; Technology has changed. Modern 2.4GHz wireless dongles 
              have identical latency to wired connections. The Keychron K8 Pro and Logitech G915 can keep up with any wired board.
            </p>
            
            <h3>When to Go Wireless</h3>
            
            <ul>
              <li>Clean desk setup matters to you</li>
              <li>You switch between devices (PC ↔ console)</li>
              <li>Battery anxiety doesn&apos;t trigger you</li>
              <li>You have a wireless mouse already (might as well complete the look)</li>
            </ul>
            
            <p><strong>One caveat:</strong> Bluetooth has ~20-50ms of additional latency over 2.4GHz wireless. 
              For gaming, always use the 2.4GHz dongle, not Bluetooth. Most gaming keyboards include both.</p>
          </section>

          <section>
            <h2>Quick Comparison Table</h2>
            
            <div className="comparison-table-container">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Wooting 60HE</th>
                    <th>Keychron K8 Pro</th>
                    <th>Logitech G915</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    <td>$175</td>
                    <td>$110</td>
                    <td>$230</td>
                  </tr>
                  <tr>
                    <td>Layout</td>
                    <td>60%</td>
                    <td>TKL</td>
                    <td>TKL + G-keys</td>
                  </tr>
                  <tr>
                    <td>Wireless</td>
                    <td>Wired only</td>
                    <td>2.4GHz + BT</td>
                    <td>LIGHTSPEED</td>
                  </tr>
                  <tr>
                    <td>Polling</td>
                    <td>1000Hz</td>
                    <td>1000Hz</td>
                    <td>1000Hz</td>
                  </tr>
                  <tr>
                    <td>Hot-Swap</td>
                    <td>Yes</td>
                    <td>Yes</td>
                    <td>No</td>
                  </tr>
                  <tr>
                    <td>Best For</td>
                    <td>Comp FPS</td>
                    <td>All-Rounder</td>
                    <td>MMO/FPS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>RGB and Aesthetics: More Than Looks</h2>
            
            <p>
              RGB lighting isn&apos;t just for show — it can actually improve your gaming experience. 
              Here&apos;s how to use it effectively:
            </p>
            
            <h3>Functional RGB Setups</h3>
            
            <p>
              <strong>Game-specific profiles:</strong> Many gaming keyboards let you save lighting profiles. 
              Set up red WASD keys for FPS games, green ability keys for MOBAs, or blue macro keys for MMOs. 
              Your muscle memory will thank you when your most-used keys are always highlighted.
            </p>
            
            <p>
              <strong>Health benefits:</strong> Low blue-light warm tones (amber, orange) reduce eye strain during long sessions. 
              Some keyboards have a "night mode" that dims everything except essential keys.
            </p>
            
            <p>
              <strong>Distraction reduction:</strong> Turn off RGB entirely for competitive play. Focus on the screen, not your keyboard. 
              Many pro players run their keyboards completely dark.
            </p>
            
            <h3>Per-Key vs. Zone RGB</h3>
            
            <p>
              <strong>Per-key RGB</strong> lets you customize every single key. The Wooting 60HE and Logitech G915 have this. 
              It&apos;s more expensive but offers total control.
            </p>
            
            <p>
              <strong>Zone RGB</strong> lights up groups of keys together. Common in budget gaming keyboards. 
              Still functional, just less granular. Fine for most users.
            </p>
            
            <p>
              <strong>Verdict:</strong> Per-key is nice but not essential. Zone RGB saves $50-70 and still looks great.
            </p>
          </section>

          <section>
            <h2>Keycaps: The Overlooked Gaming Factor</h2>
            
            <p>
              Stock keycaps are often the weakest link in gaming keyboards. Here&apos;s what to know:
            </p>
            
            <h3>Material Matters</h3>
            
            <p>
              <strong>PBT vs ABS:</strong> PBT keycaps resist shine and oil from your fingers. After 6 months of heavy gaming, 
              ABS keycaps look greasy and worn. PBT stays fresh. Worth the upgrade if your keyboard comes with ABS.
            </p>
            
            <p>
              <strong>Thickness:</strong> Thick PBT (1.5mm+) feels more solid and reduces wobble. Cheap thin keycaps rattle 
              and flex under pressure. The Keychron K8 Pro comes with decent thick PBT stock.
            </p>
            
            <h3>Profile for Gaming</h3>
            
            <p>
              Different keycap profiles affect your finger travel:
            </p>
            
            <ul>
              <li><strong>Cherry profile:</strong> Standard, angled. Great for gaming and typing.</li>
              <li><strong>OEM profile:</strong> Taller, common on gaming keyboards. Good for tactile feedback.</li>
              <li><strong>DSA/XDA:</strong> Flat, uniform. Popular with enthusiasts, takes adjustment.</li>
              <li><strong>Low-profile:</strong> Shorter travel. The G915 uses these for speed.</li>
            </ul>
            
            <p>
              <strong>Best for gaming:</strong> Cherry or OEM profile. Familiar feel, no learning curve.
            </p>
            
            <h3>Texture and Legends</h3>
            
            <p>
              <strong>Textured keycaps:</strong> Some gaming keyboards include textured WASD keys. 
              Helps you find home position without looking down. Small but meaningful upgrade.
            </p>
            
            <p>
              <strong>Doubleshot legends:</strong> The lettering is molded, not printed. Never wears off. 
              Look for doubleshot PBT if you&apos;re investing in replacement keycaps.
            </p>
          </section>

          <section>
            <h2>Build Quality: What Separates Premium from Budget</h2>
            
            <h3>Case Materials</h3>
            
            <p>
              <strong>Plastic cases</strong> are lighter and cheaper but can creak and flex. Fine for travel, 
              less satisfying at home. The Keychron V1 uses quality plastic that doesn&apos;t feel cheap.
            </p>
            
            <p>
              <strong>Aluminum cases</strong> feel premium and add weight stability. Your keyboard stays put during intense sessions. 
              The Wooting&apos;s solid aluminum case is part of why it feels so substantial.
            </p>
            
            <p>
              <strong>Hybrid designs</strong> use aluminum plates with plastic bases. Good compromise. 
              The Keychron K8 Pro takes this approach.
            </p>
            
            <h3>Plate Flex and "Bounce"</h3>
            
            <p>
              A little flex in the mounting plate helps with comfort during long sessions. Too much flex feels mushy, 
              too little feels harsh. Gasket mount designs (like Keychron&apos;s Q series) add subtle cushioning 
              that reduces hand fatigue during 6-hour raids.
            </p>
            
            <p>
              For pure gaming performance, a stiff plate is actually better — more consistent actuation forces 
              across all keys. But for comfort during long sessions, some flex is welcome.
            </p>
          </section>

          <section>
            <h2>Maintenance: Keep Your Gaming Keyboard Alive</h2>
            
            <h3>Weekly Cleaning</h3>
            
            <ul>
              <li>Blow out dust with compressed air (keyboard unplugged)</li>
              <li>Wipe keycaps with damp microfiber (water only, no harsh chemicals)</li>
              <li>Check for stuck keys from snack crumbs (we&apos;ve all been there)</li>
            </ul>
            
            <h3>Monthly Deep Clean</h3>
            
            <ul>
              <li>Remove keycaps with a keycap puller</li>
              <li>Soak keycaps in warm soapy water for 30 minutes</li>
              <li>Blow out the case with compressed air</li>
              <li>Reassemble once dry</li>
            </ul>
            
            <div className="warning-box">
              <strong>Warning:</strong> Don&apos;t remove switches unless your keyboard is hot-swap. 
              Soldered switches require desoldering to remove. Clean around them instead.
            </div>
            
            <h3>Switch Lubrication</h3>
            
            <p>
              Higher-end keyboards come pre-lubed (like the K8 Pro). If yours doesn&apos;t, 
              you can add switch lube to reduce scratchiness. Requires disassembling and lubing each switch individually. 
              2-3 hours of work. Worth it if you enjoy the process; skip it if you just want to game.
            </p>
            
            <h3>Cable Care</h3>
            
            <p>
              If you own a wired or charging cable:
            </p>
            
            <ul>
              <li>Don&apos;t kink or sharply bend cables</li>
              <li>Use a cable coil to prevent desk snags</li>
              <li>For wireless: keep the USB-C port clean</li>
            </ul>
          </section>

          <section>
            <h2>Future-Proofing: What to Consider</h2>
            
            <h3>USB Ports and Connectivity</h3>
            
            <p>
              USB-C is standard now, but some keyboards still use USB-A passthrough. 
              That&apos;s useful for plugging your mouse into your keyboard for cleaner cable management. 
              The Logitech G915 includes a USB passthrough.
            </p>
            
            <h3>Software and Updates</h3>
            
            <p>
              Brands matter for support. Logitech&apos;s G Hub and Keychron&apos;s VIA get regular updates. 
              Wooting updates firmware actively. Smaller brands might release a keyboard and move on. 
              Check update history before buying.
            </p>
            
            <h3>Switch Compatibility</h3>
            
            <p>
              Hot-swap sockets let you try new switches as they release. In 2025 alone, 
              Gateron released the Cloud and Box series, Akko had new switches, and Cherry updated the MX2A lineup. 
              A hot-swap board evolves with the market. A soldered board is locked in.
            </p>
            
            <p>
              <strong>Investment advice:</strong> If you plan to keep a keyboard 3+ years, 
              hot-swap pays for itself in switch experimentation alone.
            </p>
          </section>

          <section className="cta-section gaming-cta">
            <h2>Find Your Gaming Keyboard</h2>
            <p>Browse our live inventory filtered for gaming features and low latency specs.</p>
            <a href="/" className="cta-button">Browse Gaming Keyboards →</a>
            <p className="related-links" style={{marginTop: '1.5rem', fontSize: '0.875rem'}}>
              Also check: <a href="/learn/switch-guide">Switch Guide</a> • 
              <a href="/blog/hall-effect-keyboards-2026">Hall Effect Breakdown</a>
            </p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
