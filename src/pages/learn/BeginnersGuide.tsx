import React from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import './GuidePages.css';

export default function BeginnersGuide() {
  useScrollToTop();
  usePageSEO({
    title: "Beginner's Guide to Mechanical Keyboards | Switchyard",
    description: "New to mechanical keyboards? Learn the basics: switch types explained simply (linear, tactile, clicky), layout sizes, and how to choose your first board. No jargon, just the essentials.",
    keywords: "mechanical keyboard beginner guide, first mechanical keyboard, switch types, linear vs tactile, keyboard sizes, 60% keyboard, buy first mechanical keyboard"
  });

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Getting Started</span>
          <h1>Beginner's Guide to Mechanical Keyboards</h1>
          <p className="guide-intro">
            New to mechanical keyboards? Learn the basics: what makes them different, 
            switch types explained simply, and how to choose your first board. No jargon, just the essentials.
          </p>
        </header>

        <div className="guide-body">
          <section>
            <h2>So... What's the Deal With Mechanical Keyboards?</h2>
            <p>
              Mechanical keyboards use individual switches under each key. Unlike the rubber domes 
              in cheap keyboards, each mechanical switch is a self-contained unit with its own 
              spring and mechanism. The result? Better feel, longer life, and endless customization.
            </p>
            
            <div className="key-benefits">
              <h3>Why Go Mechanical?</h3>
              <ul>
                <li><strong>Better feel:</strong> Tactile feedback makes typing more satisfying</li>
                <li><strong>Durability:</strong> Last 10+ years with proper care</li>
                <li><strong>Customization:</strong> Change switches, keycaps, even the case</li>
                <li><strong>Typing speed:</strong> Many users type faster with better feedback</li>
                <li><strong>Repairability:</strong> Individual switches can be replaced if they fail</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>Understanding Switch Types</h2>
            <p>Switches are the heart of a mechanical keyboard. Here's the simple version:</p>

            <div className="switch-types-grid">
              <div className="switch-card linear">
                <h4>Linear</h4>
                <p>Smooth from top to bottom. No bump, no click. Just pure glide.</p>
                <ul>
                  <li>Best for: Gaming, fast typing</li>
                  <li>Popular: Cherry MX Red, Gateron Yellow</li>
                  <li>Sound: Quiet</li>
                </ul>
              </div>

              <div className="switch-card tactile">
                <h4>Tactile</h4>
                <p>A noticeable bump when the key registers. Feedback you can feel.</p>
                <ul>
                  <li>Best for: General use, writing</li>
                  <li>Popular: Cherry MX Brown, Holy Panda</li>
                  <li>Sound: Moderate</li>
                </ul>
              </div>

              <div className="switch-card clicky">
                <h4>Clicky</h4>
                <p>Bump AND an audible click. Satisfying feedback, but louder.</p>
                <ul>
                  <li>Best for: Typing enthusiasts</li>
                  <li>Popular: Cherry MX Blue, Kailh Box White</li>
                  <li>Sound: Loud</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2>Choose Your Size</h2>
            
            <div className="size-comparison">
              <div className="size-item">
                <h4>Full Size (100%)</h4>
                <p>~104 keys. Everything including numpad.</p>
                <p className="size-best">Best for: Data entry, number crunching</p>
              </div>

              <div className="size-item">
                <h4>TKL (Tenkeyless)</h4>
                <p>~87 keys. No numpad, keeps function row.</p>
                <p className="size-best">Best for: Gaming, limited desk space</p>
              </div>

              <div className="size-item">
                <h4>75%</h4>
                <p>~82 keys. Compact but keeps arrows and function keys.</p>
                <p className="size-best">Best for: Balance of size and function</p>
              </div>

              <div className="size-item">
                <h4>65%</h4>
                <p>~68 keys. No function row, keeps arrows.</p>
                <p className="size-best">Best for: Portability, minimalism</p>
              </div>

              <div className="size-item">
                <h4>60%</h4>
                <p>~61 keys. Minimal. No arrows, no function row.</p>
                <p className="size-best">Best for: Portable setups, customization</p>
              </div>
            </div>
          </section>

          <section>
            <h2>Keycap Materials: ABS vs. PBT</h2>
            <p>
              Once you&apos;ve picked a keyboard, you&apos;ll notice keycaps come in different materials. 
              This matters more than you think:
            </p>
            
            <div className="keycap-comparison">
              <div className="keycap-type">
                <h4>ABS (Acrylonitrile Butadiene Styrene)</h4>
                <ul>
                  <li>Smooth, slightly soft feel</li>
                  <li>Develops shine over time (1-2 years)</li>
                  <li>Richer, more vibrant colors</li>
                  <li>Typically cheaper</li>
                  <li>Thinner walls (higher pitch sound)</li>
                </ul>
              </div>
              
              <div className="keycap-type">
                <h4>PBT (Polybutylene Terephthalate)</h4>
                <ul>
                  <li>Textured, grippy surface</li>
                  <li>Resists shine almost forever</li>
                  <li>More muted color palette</li>
                  <li>Usually more expensive</li>
                  <li>Thicker walls (deeper, thockier sound)</li>
                </ul>
              </div>
            </div>
            
            <p>
              <strong>Which is better?</strong> PBT lasts longer and feels premium, but ABS isn&apos;t 
              low quality&mdash;GMK makes some of the most expensive keycaps in the world from ABS. 
              For your first board, PBT is the safer choice. It won&apos;t shine, and the texture hides wear.
            </p>
            
            <p>
              <strong>Keycap profiles matter too:</strong> Cherry profile is standard (sculpted, comfortable). 
              XDA/DSA are flat and uniform. OEM is tall and angled. Most beginners prefer Cherry or OEM.
            </p>
          </section>

          <section>
            <h2>RGB: Nice to Have or Essential?</h2>
            
            <p>
              RGB lighting is everywhere in marketing, but do you actually need it? Let&apos;s separate hype from reality:
            </p>
            
            <h3>Why RGB Exists</h3>
            
            <p>
              Keyboard manufacturers learned that RGB sells. It&apos;s not about gaming performance &mdash; 
              it&apos;s an aesthetic choice. A $60 keyboard with RGB outsells an $80 without it. That&apos;s the entire business case.
            </p>
            
            <h3>When You Might Actually Want It</h3>
            
            <ul>
              <li>Gaming in the dark: You need backlighting, not rainbow RGB</li>
              <li>Macro layers: Color-coding active layer is genuinely useful</li>
              <li>Aesthetics: You like the look (valid reason)</li>
              <li>Video calls: Cool white backlighting looks professional on camera</li>
            </ul>
            
            <h3>What to Avoid</h3>
            
            <p>
              &quot;Gamer&quot; keyboards with non-addressable RGB (entire keyboard one color at a time) 
              are usually cheap marketing tricks. Either get per-key RGB or skip it entirely. 
              Non-addressable RGB looks dated fast and adds zero functional value.
            </p>
            
            <p>
              <strong>Bottom line:</strong> Skip RGB and spend $20 more on better switches or build quality.
              Your typing experience matters more than glowing colors.
            </p>
          </section>

          <section>
            <h2>Common First-Timer Mistakes</h2>
            
            <div className="mistakes-list">
              <div className="mistake-item">
                <h4>❌ Buying for switches you&apos;ve never tried</h4>
                <p>
                  You read that Cherry MX Blues are "terrible" and Reds are "the best for gaming." 
                  But touch is personal. A tactile switch might feel crisp to you and mushy to someone else. 
                  Before committing to a full set, spend $25 on a switch tester. Test your finalists for a week.
                </p>
              </div>
              
              <div className="mistake-item">
                <h4>❌ Ignoring size and desk space</h4>
                <p>
                  That full-size Corsair looks impressive. But will it fit your desk with your mousepad? 
                  Measure first. A TKL or 75% saves 4-6 inches of horizontal space. Your shoulder will thank you.
                </p>
              </div>
              
              <div className="mistake-item">
                <h4>❌ Spending too much on features you don&apos;t need</h4>
                <p>
                  Custom cables, desk mats, artisan keycaps &mdash; these are fun but add up fast. 
                  Focus on the core experience first. Get a solid keyboard with good switches. 
                  Accessorize later when you know what you actually enjoy.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Where to Buy</h2>
            
            <p>
              Your first mechanical keyboard can come from several sources, each with trade-offs:
            </p>
            
            <div className="buyer-options">
              <div className="buyer-type">
                <h4>Amazon/Retail (Keychron, Logitech, Corsair)</h4>
                <p><strong>Pros:</strong> Fast shipping, easy returns, warranty support. <strong>Cons:</strong> Limited to mass-market brands, less customization.</p>
              </div>
              
              <div className="buyer-type">
                <h4>Enthusiast Vendors (KBDfans, NovelKeys, CannonKeys)</h4>
                <p><strong>Pros:</strong> Higher quality, more customization, supports community. <strong>Cons:</strong> Slower shipping, may need assembly.</p>
              </div>
              
              <div className="buyer-type">
                <h4>R/Mechmarket (Used)</h4>
                <p><strong>Pros:</strong> Great deals on quality boards. <strong>Cons:</strong> No returns, risk of scams (always use PayPal G+S).</p>
              </div>
            </div>
            
            <p>
              For your first board, stick with Amazon or direct from Keychron. You get return rights 
              if switches don&apos;t feel right. Once you know what you like, then branch out to enthusiast vendors.
            </p>
          </section>

          <section className="cta-section">
            <h2>Ready for Your First Board?</h2>
            <p>Start with something reliable and affordable. You can always upgrade later.</p>
            
            <a href="/learn/best-budget" className="cta-button">
              See Best Budget Keyboards
            </a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
