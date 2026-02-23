import React from 'react';
import Layout from '../components/Layout';
import './Guide.css';

export default function BeginnersGuide() {
  return (
    <Layout>
      <div className="guide-content">
        <h1>Beginner's Guide to Mechanical Keyboards</h1>

        <section className="intro">
          <p>
            Welcome to the world of mechanical keyboards! This guide will help you understand
            the basics and find your first mechanical keyboard.
          </p>
        </section>

        <section>
          <h2>Why Mechanical Keyboards?</h2>
          <ul>
            <li><strong>Better feel:</strong> Tactile feedback makes typing more satisfying</li>
            <li><strong>Durability:</strong> Last 10+ years with proper care</li>
            <li><strong>Customization:</strong> Change switches, keycaps, layout</li>
            <li><strong>Typing speed:</strong> Many users type faster with better feedback</li>
            <li><strong>Repairability:</strong> Individual switches can be replaced</li>
          </ul>
        </section>

        <section>
          <h2>Keyboard Sizes (Layouts)</h2>

          <div className="size-grid">
            <div className="size-card">
              <h3>Full Size (100%)</h3>
              <p>Standard layout with numpad</p>
              <ul>
                <li>~104 keys</li>
                <li>Best for: Data entry, accounting</li>
                <li>Size: Largest</li>
              </ul>
            </div>

            <div className="size-card">
              <h3>TKL (Tenkeyless)</h3>
              <p>No numpad, keeps function keys</p>
              <ul>
                <li>~87 keys</li>
                <li>Best for: Gaming, limited desk space</li>
                <li>Size: Medium</li>
              </ul>
            </div>

            <div className="size-card">
              <h3>75%</h3>
              <p>Compact with arrow keys</p>
              <ul>
                <li>~82 keys</li>
                <li>Best for: Balance of size and function</li>
                <li>Size: Compact</li>
              </ul>
            </div>

            <div className="size-card">
              <h3>65%</h3>
              <p>No function row, keeps arrows</p>
              <ul>
                <li>~68 keys</li>
                <li>Best for: Portability, minimalism</li>
                <li>Size: Small</li>
              </ul>
            </div>

            <div className="size-card">
              <h3>60%</h3>
              <p>Minimalist, no arrows or function row</p>
              <ul>
                <li>~61 keys</li>
                <li>Best for: Portability, customization</li>
                <li>Size: Very small</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2>Budget Recommendations</h2>

          <h3>Entry Level ($50–100)</h3>
          <ul>
            <li>Great starting point for first mechanical keyboard</li>
            <li>Reliable brands: Keychron K series, Royal Kludge, Epomaker</li>
            <li>Good build quality, hot-swap options available</li>
            <li>Wired and wireless options</li>
          </ul>

          <h3>Mid-Range ($100–200)</h3>
          <ul>
            <li>Improved materials and build quality</li>
            <li>Better switches (Cherry, Gateron, Kailh)</li>
            <li>Brands: Drop, Keychron Q series, Leopold, Varmilo</li>
            <li>Programmable features, premium keycaps</li>
          </ul>

          <h3>High End ($200+)</h3>
          <ul>
            <li>Premium materials (aluminum cases, brass plates)</li>
            <li>Custom options, group buys</li>
            <li>Brands: Rama, KBDFans, CannonKeys, NovelKeys</li>
            <li>Enthusiast features, limitless customization</li>
          </ul>
        </section>

        <section>
          <h2>First Purchase Checklist</h2>
          <ul className="checklist">
            <li>☐ Decide on size (full size, TKL, 75%, 65%, or 60%)</li>
            <li>☐ Choose switch type (linear, tactile, or clicky)</li>
            <li>☐ Set budget range</li>
            <li>☐ Consider hot-swap (easier to change switches later)</li>
            <li>☐ Check if you want wireless/wired</li>
            <li>☐ Read reviews on r/MechanicalKeyboards</li>
          </ul>
        </section>

        <section>
          <h2>Common Beginner Mistakes</h2>

          <div className="mistakes">
            <div className="mistake">
              <h4>❌ Buying solely based on reviews</h4>
              <p>✓ Switch testers let you feel switches before committing</p>
            </div>

            <div className="mistake">
              <h4>❌ Going too small too fast</h4>
              <p>✓ Start with familiar layouts (TKL or 75%) before going 60%</p>
            </div>

            <div className="mistake">
              <h4>❌ Ignoring keycap profiles</h4>
              <p>✓ OEM and Cherry are safe starting points</p>
            </div>

            <div className="mistake">
              <h4>❌ Buying non-hot-swap for first board</h4>
              <p>✓ Hot-swap lets you experiment with switches</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
