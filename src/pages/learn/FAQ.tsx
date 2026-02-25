import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { usePageSEO } from '../../hooks/usePageSEO';
import './GuidePages.css';

const faqs = [
  {
    category: 'Getting Started',
    questions: [
      { q: 'How much should I spend on my first mechanical keyboard?', a: 'For your first board, $80-150 is the sweet spot. You get quality switches, good build quality, and features like hot-swap. Under $80 can be hit-or-miss. Over $150 is enthusiast territory — great if you know what you want, but risky for beginners.' },
      { q: 'Are mechanical keyboards really that different from regular ones?', a: 'Absolutely. The individual switches provide tactile feedback, faster actuation, and a satisfying typing experience. Typing on a mechanical keyboard after using membrane keyboards is like the difference between driving a sports car and a minivan — both get you there, but the experience is completely different.' },
      { q: 'Will a mechanical keyboard make me type faster?', a: 'Possibly. Many users report 10-20% speed increases after adapting to mechanical switches. The tactile feedback helps with accuracy, and you may find a switch type that perfectly matches your style. But results vary — some people type just as fast on any keyboard.' }
    ]
  },
  {
    category: 'Practical Concerns',
    questions: [
      { q: 'Are they loud? Will my coworkers hate me?', a: 'Depends on the switch. Linear switches (Cherry MX Red) are relatively quiet. Tactile switches (Brown) have a gentle bump. Clicky switches (Blue) are noticeably loud. If noise is a concern, go linear or tactile, or add o-rings to dampen bottom-out noise. Many offices ban clicky switches.' },
      { q: 'Can I repair a mechanical keyboard if something breaks?', a: 'Yes! That\'s a major advantage. Individual switches can be replaced (especially on hot-swap boards). Keycaps are easily swapped. Even soldering repairs are doable. A quality mechanical keyboard can last 10+ years with basic maintenance.' },
      { q: 'Do I need special software?', a: 'Most keyboards work plug-and-play. Gaming keyboards often have software for RGB control and macros, but it\'s optional. For custom firmware like QMK, you can get incredibly deep customization, but it\'s not required for normal use.' }
    ]
  },
  {
    category: 'Choosing & Buying',
    questions: [
      { q: 'What size should I get?', a: 'Start with what you know. If you use the numpad, get full-size. If you rarely use it, TKL saves desk space. 75% and 65% are popular compact options that keep arrow keys. 60% is minimal and portable but requires learning function layers.' },
      { q: 'Where should I buy from?', a: 'Amazon for fast shipping and easy returns. Mechanical keyboard specialists like Drop, Keychron, or mechanicalkeyboards.com for better selection. Vendor websites often have exclusive colorways. For group buys, Geekhack and Reddit — but expect waits of 6-18 months.' },
      { q: 'What about wireless mechanical keyboards?', a: 'They exist and work well. Look for 2.4GHz for gaming (lower latency) and Bluetooth for versatility. Battery life varies wildly — weeks to months. Some purists prefer wired for reliability, but wireless technology has improved significantly.' }
    ]
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  usePageSEO({
    title: "Mechanical Keyboard FAQ | Common Questions Answered | Switchyard",
    description: "Quick answers to common mechanical keyboard questions: pricing, switch types, noise levels, wireless options, repairability, and where to buy. Get informed before you buy.",
    keywords: "mechanical keyboard FAQ, keyboard questions, are mechanical keyboards loud, keyboard repair, wireless mechanical keyboard, first mechanical keyboard"
  });

  const toggleQuestion = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <Layout>
      <article className="guide-article">
        <header className="guide-header-section">
          <span className="guide-tag">Getting Started</span>
          <h1>Frequently Asked Questions</h1>
          <p className="guide-intro">
            Common questions about mechanical keyboards, answered.
          </p>
        </header>

        <div className="guide-body">
          {faqs.map((section, sIndex) => (
            <section key={section.category}>
              <h2>{section.category}</h2>
              <div className="faq-list">
                {section.questions.map((faq, qIndex) => {
                  const key = `${sIndex}-${qIndex}`;
                  const isOpen = openIndex === key;
                  
                  return (
                    <div key={key} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="faq-question"
                        onClick={() => toggleQuestion(key)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                      </button>
                      <div className="faq-answer">
                        <div className="faq-answer-inner">
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          <section className="cta-section">
            <h2>Still have questions?</h2>
            <p>Check out our Beginner's Guide for a complete introduction.</p>
            
            <a href="/learn/beginners-guide" className="cta-button">
              Read Beginner's Guide →
            </a>
          </section>
        </div>
      </article>
    </Layout>
  );
}
