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
