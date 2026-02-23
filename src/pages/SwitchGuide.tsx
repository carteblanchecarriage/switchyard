import React from 'react';
import Layout from '../components/Layout';
import './Guide.css';

export default function SwitchGuide() {
  return (
    <Layout>
      <div className="guide-content">
        <h1>Switch Guide</h1>

        <section>
          <h2>What Are Mechanical Switches?</h2>
          <p>
            Mechanical switches are the heart of mechanical keyboards. Unlike membrane keyboards,
            each key has its own individual switch mechanism that provides tactile feedback and
            a satisfying click or bump when pressed.
          </p>
        </section>

        <section>
          <h2>Switch Types</h2>

          <h3>Linear Switches</h3>
          <p>Smooth keystrokes from top to bottom. No tactile bump or click. Great for gaming and fast typing.</p>
          <ul>
            <li><strong>Cherry MX Red:</strong> Light, smooth, 45g actuation</li>
            <li><strong>Cherry MX Black:</strong> Heavier, smooth, 60g actuation</li>
            <li><strong>Gateron Yellow:</strong> Budget-friendly linear</li>
          </ul>

          <h3>Tactile Switches</h3>
          <p>Bump feeling when actuated. Good balance of feedback and speed.</p>
          <ul>
            <li><strong>Cherry MX Brown:</strong> Light tactile, 55g</li>
            <li><strong>Cherry MX Clear:</strong> Heavier tactile, 65g</li>
            <li><strong>Holy Panda:</strong> Premium tactile</li>
          </ul>

          <h3>Clicky Switches</h3>
          <p>Audible click with tactile bump. Satisfying feedback but louder.</p>
          <ul>
            <li><strong>Cherry MX Blue:</strong> Classic clicky, 50g</li>
            <li><strong>Cherry MX Green:</strong> Heavier clicky, 80g</li>
            <li><strong>Kailh Box White:</strong> Crisp click, water-resistant</li>
          </ul>
        </section>

        <section>
          <h2>Switch Comparison</h2>
          <table className="switch-table">
            <thead>
              <tr>
                <th>Switch</th>
                <th>Type</th>
                <th>Actuation</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cherry MX Red</td>
                <td>Linear</td>
                <td>45g</td>
                <td>Gaming</td>
              </tr>
              <tr>
                <td>Cherry MX Brown</td>
                <td>Tactile</td>
                <td>55g</td>
                <td>General Use</td>
              </tr>
              <tr>
                <td>Cherry MX Blue</td>
                <td>Clicky</td>
                <td>50g</td>
                <td>Typing</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </Layout>
  );
}
