import React from 'react';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';

export default function TermsOfService() {
  return (
    <Layout>
      <SEOHead
        title="Terms of Service | Switchyard"
        description="Terms of Service for Switchyard — the rules governing use of our mechanical keyboard tracker and review site."
        canonical="/terms"
      />
      <article className="guide-article">
        <header className="guide-header-section">
          <h1>Terms of Service</h1>
          <p className="guide-intro">Last updated: March 2026</p>
        </header>

        <div className="guide-body">
          <section>
            <h2>Acceptance of Terms</h2>
            <p>By accessing or using Switchyard at switchyard.club ("Site"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Site.</p>
          </section>

          <section>
            <h2>About the Site</h2>
            <p>Switchyard is an informational website that tracks mechanical keyboard products, prices, and availability from various retailers. We provide editorial content, buying guides, and product comparisons to help consumers make informed purchasing decisions.</p>
          </section>

          <section>
            <h2>Affiliate Disclosure</h2>
            <p>Switchyard participates in affiliate marketing programs. This means we may earn a commission when you click certain links on our Site and subsequently make a purchase — at no additional cost to you.</p>
            <p>Specifically, Switchyard is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</p>
            <p>Our editorial opinions and product recommendations are not influenced by affiliate relationships. We only recommend products we believe offer genuine value to our readers.</p>
          </section>

          <section>
            <h2>Product Information & Accuracy</h2>
            <p>We strive to keep product information, pricing, and availability up to date. However:</p>
            <ul>
              <li>Prices and availability change frequently and may differ from what is shown on our Site</li>
              <li>Product descriptions are provided for informational purposes only</li>
              <li>We are not responsible for errors or omissions in product information</li>
              <li>Always verify current pricing and availability on the retailer's website before purchasing</li>
            </ul>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>All original content on the Site — including written guides, editorial copy, and site design — is owned by Switchyard and protected by applicable copyright laws. You may not reproduce or republish our content without prior written permission.</p>
            <p>Product images and brand names are the property of their respective owners and are used for identification purposes only.</p>
          </section>

          <section>
            <h2>Disclaimer of Warranties</h2>
            <p>The Site is provided "as is" and "as available" without any warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components.</p>
            <p>We do not guarantee the accuracy, completeness, or usefulness of any information on the Site. Any reliance you place on such information is strictly at your own risk.</p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Switchyard shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or your reliance on any information provided herein, including but not limited to purchasing decisions made based on our content.</p>
          </section>

          <section>
            <h2>Third-Party Links</h2>
            <p>Our Site contains links to third-party websites (retailers, manufacturers, and other resources). These links are provided for your convenience. We have no control over the content or practices of those sites and accept no responsibility for them. Visiting third-party sites is at your own risk.</p>
          </section>

          <section>
            <h2>Prohibited Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Site for any unlawful purpose</li>
              <li>Scrape or systematically download content without permission</li>
              <li>Attempt to interfere with or disrupt the Site's operation</li>
              <li>Misrepresent your affiliation with the Site</li>
            </ul>
          </section>

          <section>
            <h2>Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. Changes take effect when posted on this page. Your continued use of the Site after changes are posted constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2>Governing Law</h2>
            <p>These Terms are governed by the laws of the United States. Any disputes arising from your use of the Site shall be subject to the exclusive jurisdiction of the courts of the United States.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Questions about these Terms? Email us at <a href="mailto:info@switchyard.club">info@switchyard.club</a>.</p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
