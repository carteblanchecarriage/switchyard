import React from 'react';
import Layout from '../components/Layout';
import SEOHead from '../components/SEOHead';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEOHead
        title="Privacy Policy | Switchyard"
        description="Privacy Policy for Switchyard — how we collect, use, and protect your information."
        canonical="/privacy"
      />
      <article className="guide-article">
        <header className="guide-header-section">
          <h1>Privacy Policy</h1>
          <p className="guide-intro">Last updated: March 2026</p>
        </header>

        <div className="guide-body">
          <section>
            <h2>Who We Are</h2>
            <p>Switchyard ("we", "us", "our") operates switchyard.club, a mechanical keyboard product tracker and review site. We help enthusiasts find and compare keyboards, switches, and accessories.</p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <h3>Information You Provide</h3>
            <p>Switchyard does not require account registration or any form of sign-up. We do not collect names, email addresses, or any personal information directly from visitors.</p>

            <h3>Automatically Collected Information</h3>
            <p>When you visit our site, standard web analytics tools may automatically collect:</p>
            <ul>
              <li>Pages visited and time spent on each page</li>
              <li>Referring website (how you found us)</li>
              <li>Browser type and operating system</li>
              <li>General geographic location (country/region level only)</li>
              <li>Device type (desktop, mobile, tablet)</li>
            </ul>
            <p>This data is collected in aggregate and is not linked to any individual identity.</p>

            <h3>Cookies</h3>
            <p>We may use essential cookies to remember your preferences (such as filters or sort settings). We do not use tracking cookies for advertising purposes. Third-party services embedded on our site (such as analytics providers) may set their own cookies per their respective privacy policies.</p>
          </section>

          <section>
            <h2>Affiliate Links & Third-Party Sites</h2>
            <p>Switchyard participates in affiliate programs including the Amazon Associates Program. When you click an affiliate link and make a purchase, we may earn a small commission at no additional cost to you.</p>
            <p>Clicking an affiliate link takes you to a third-party website (such as Amazon, Drop, or Keychron). We are not responsible for the privacy practices of those sites. We encourage you to review their privacy policies before making a purchase.</p>
            <p>As an Amazon Associate, we earn from qualifying purchases.</p>
          </section>

          <section>
            <h2>How We Use Information</h2>
            <p>Any information we collect is used solely to:</p>
            <ul>
              <li>Understand how visitors use the site so we can improve it</li>
              <li>Identify popular content and products</li>
              <li>Diagnose technical issues</li>
            </ul>
            <p>We do not sell, rent, or share your information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2>Children's Privacy</h2>
            <p>Switchyard is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided personal information to us, please contact us and we will delete it promptly.</p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>We take reasonable measures to protect the information we collect. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>Depending on your location, you may have rights under applicable privacy laws (such as GDPR or CCPA) including the right to access, correct, or delete data we hold about you. Since we collect minimal data and do not tie it to individuals, most requests can be addressed by clearing your browser cookies and cache.</p>
            <p>For any privacy-related requests or questions, contact us at <a href="mailto:info@switchyard.club">info@switchyard.club</a>.</p>
          </section>

          <section>
            <h2>Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. The "last updated" date at the top of this page reflects the most recent revision. Continued use of the site after any changes constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>Questions about this Privacy Policy? Email us at <a href="mailto:info@switchyard.club">info@switchyard.club</a>.</p>
          </section>
        </div>
      </article>
    </Layout>
  );
}
