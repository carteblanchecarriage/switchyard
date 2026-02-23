import React from 'react';
import Layout from '../components/Layout';
import './Guide.css';

const terms = [
  {
    term: 'Actuation',
    definition: 'The point at which a keystroke is registered. Measured in force (grams) and distance (millimeters).'
  },
  {
    term: 'Actuation Point',
    definition: 'The physical distance the switch stem must travel before the keystroke registers.'
  },
  {
    term: 'Bottom Out',
    definition: 'Pressing a key all the way down until it hits the bottom of the switch housing.'
  },
  {
    term: 'Case',
    definition: 'The outer housing that holds all keyboard components together. Can be plastic, aluminum, or other materials.'
  },
  {
    term: 'Clicky',
    definition: 'A switch type that produces an audible click sound when actuated. Example: Cherry MX Blue.'
  },
  {
    term: 'Debouncing',
    definition: 'The electrical process that prevents a single key press from registering multiple times.'
  },
  {
    term: 'Double Shot',
    definition: 'A keycap manufacturing method where the legend is molded from a different plastic. Very durable.'
  },
  {
    term: 'Firmware',
    definition: 'The software that runs on the keyboard\'s microcontroller. QMK and VIA are popular options.'
  },
  {
    term: 'Group Buy',
    definition: 'A pre-order system where products are manufactured after enough people commit to buying.'
  },
  {
    term: 'Hot-Swappable',
    definition: 'A keyboard that allows switches to be removed and replaced without soldering.'
  },
  {
    term: 'Keycap',
    definition: 'The plastic cap that sits on top of a switch. Comes in various profiles and materials.'
  },
  {
    term: 'Keycap Profile',
    definition: 'The shape/sculpt of keycaps. Common profiles: Cherry, OEM, SA, DSA, XDA, MT3.'
  },
  {
    term: 'Linear',
    definition: 'A switch type with a smooth keystroke and no tactile bump. Example: Cherry MX Red.'
  },
  {
    term: 'Lubing',
    definition: 'Applying lubricant to switches to make them smoother and reduce noise.'
  },
  {
    term: 'Macro',
    definition: 'A programmed sequence of keystrokes triggered by a single key press.'
  },
  {
    term: 'N-Key Rollover (NKRO)',
    definition: 'The ability to press any number of keys simultaneously and have all register.'
  },
  {
    term: 'PCB',
    definition: 'Printed Circuit Board. The electronics that connect switches to the computer.'
  },
  {
    term: 'Plate',
    definition: 'A rigid layer (usually metal or plastic) that holds switches in position above the PCB.'
  },
  {
    term: 'PBT',
    definition: 'Polybutylene Terephthalate. A durable, textured plastic used for high-quality keycaps.'
  },
  {
    term: 'Polling Rate',
    definition: 'How often the keyboard reports its state to the computer. Measured in Hz (1000Hz = 1ms).'
  },
  {
    term: 'QMK',
    definition: 'Quantum Mechanical Keyboard. Open-source firmware for custom keyboards.'
  },
  {
    term: 'Soldering',
    definition: 'Permanently attaching switches to the PCB using melted metal (solder).'
  },
  {
    term: 'Stabilizers',
    definition: 'Mechanisms under larger keys (Space, Enter, Shift) to prevent wobbling.'
  },
  {
    term: 'Stem',
    definition: 'The part of the switch that the keycap attaches to. (+ for Cherry MX compatible)'
  },
  {
    term: 'Switch',
    definition: 'The component under each keycap that registers keystrokes and provides feedback.'
  },
  {
    term: 'Tactile',
    definition: 'A switch type with a noticeable bump at the actuation point. Example: Cherry MX Brown.'
  },
  {
    term: 'Travel Distance',
    definition: 'The total distance a switch can be depressed, typically 3-4mm.'
  },
];

export default function Glossary() {
  return (
    <Layout>
      <div className="guide-content">
        <h1>Keyboard Glossary</h1>

        <p className="intro">
          Your guide to mechanical keyboard terminology. Click on terms to learn more.
        </p>

        <div className="glossary-list">
          {terms.map((item) => (
            <div key={item.term} className="glossary-item" id={item.term.toLowerCase().replace(/\s+/g, '-')} >
              <h3>{item.term}</h3>
              <p>{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
