import React from 'react';
import BlogPostLayout from './BlogPostLayout';

/**
 * BLOG POST TEMPLATE
 * 
 * Quick Start Guide:
 * 1. Copy this file and rename to YourPostName.tsx
 * 2. Update all TODO sections below
 * 3. Add your content between the layout tags
 * 4. Download a hero image: 
 *    curl -L -o public/blog/your-image.jpg "https://images.unsplash.com/photo-YOUR_ID?w=1200&q=80&fit=crop"
 * 5. Import in App.tsx and add route
 * 6. Build locally: npm run build
 * 7. Push to GitHub
 * 
 * Hero Image Tips:
 * - Use Unsplash: https://unsplash.com
 * - Search for relevant keywords
 * - Recommended size: 1200x600 pixels
 * - Keep under 150KB for performance
 * - Use jpg for photos, png for graphics
 */

export default function BlogPostTemplate() {
  return (
    <BlogPostLayout
      title="TODO: Write compelling title here"
      description="TODO: Meta description (150-160 chars for SEO)"
      keywords="TODO: comma, separated, keywords, for, SEO, 2026"
      date="TODO: Month Day, Year"
      readTime="TODO: X min"
      category="TODO: Category"
      heroImage="/blog/TODO-hero-image.jpg"
      heroAlt="TODO: Descriptive alt text for hero image"
    >
      
      {/* INTRODUCTION */}
      <p>
        TODO: Hook your reader immediately. Start with a strong opening that addresses the problem 
        your reader is facing. Use <strong>bold</strong> for emphasis and <em>italics</em> for tone.
      </p>

      <p>
        TODO: Expand on the hook. Give context. Why does this topic matter? Who should care?
        Keep paragraphs short and punchy.
      </p>

      {/* TL;DR BOX */}
      <div className="tldr-box">
        <strong>TL;DR:</strong> TODO: One-paragraph summary of key takeaways. 
        Make it skimmable but compelling enough to read the full article.
      </div>

      {/* SECTION 1 */}
      <h2>TODO: First Section Headline</h2>

      <p>
        TODO: Content here. Aim for 200-400 words per section.
        Use bullet points for lists:
      </p>

      <ul>
        <li>TODO: Point one with <strong>key term</strong> highlighted</li>
        <li>TODO: Point two explaining why it matters</li>
        <li>TODO: Point three with specific example</li>
      </ul>

      {/* INFO BOX */}
      <div className="highlight-box info">
        <strong>Pro Tip:</strong> TODO: Call out specific advice or insider knowledge 
        that adds value for readers who know the basics.
      </div>

      {/* SECTION 2 */}
      <h2>TODO: Second Section Headline</h2>

      <p>
        TODO: More content. Break up text with:
        - Short paragraphs
        - Bold text for emphasis
        - Links to relevant products/pages
      </p>

      {/* COMPARISON TABLE */}
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Factor</th>
            <th>Option A</th>
            <th>Option B</th>
            <th>Option C</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TODO: Criteria</td>
            <td>TODO: Value</td>
            <td>TODO: Value</td>
            <td>TODO: Value</td>
          </tr>
          <tr>
            <td>TODO: Another criteria</td>
            <td>TODO: Value</td>
            <td>TODO: Value</td>
            <td>TODO: Value</td>
          </tr>
        </tbody>
      </table>

      {/* WARNING BOX */}
      <div className="highlight-box warning">
        <strong>Watch Out:</strong> TODO: Important warning or common pitfall 
        that readers should avoid.
      </div>

      {/* SECTION 3 */}
      <h2>TODO: Third Section Headline</h2>

      <p>
        TODO: Include specific recommendations with affiliate links:
      </p>

      <h3>1. TODO: Product Name</h3>
      <p>
        TODO: Brief description and why it's recommended. Include price point.
        <a href="TODO:AFFILIATE_LINK" target="_blank" rel="noopener noreferrer">
          Check current price
        </a>
      </p>

      <h3>2. TODO: Product Name</h3>
      <p>
        TODO: Another recommendation. 
        <a href="TODO:AFFILIATE_LINK" target="_blank" rel="noopener noreferrer">
          View on vendor site
        </a>
      </p>

      {/* SUCCESS BOX */}
      <div className="highlight-box success">
        <strong>Yes, if:</strong> TODO: Who should buy this type of product.
      </div>

      <div className="highlight-box warning">
        <strong>No, if:</strong> TODO: Who should skip it and why.
      </div>

      {/* CONCLUSION */}
      <h2>The Bottom Line</h2>

      <p>
        TODO: Sum up the article. Restate key insights. Give final recommendation.
        Make it actionable.
      </p>

      <p>
        TODO: End with a question or call-to-action that encourages comments or engagement.
        Where do you land on this topic?
      </p>

      {/* RELATED CONTENT */}
      <h3>Further Reading</h3>
      <ul>
        <li><a href="/blog/TODO-RELATED-POST">TODO: Related article title</a></li>
        <li><a href="/blog/TODO-ANOTHER-POST">TODO: Another related article</a></li>
        <li><a href="/">TODO: Link to keyboard tracker or other resource</a></li>
      </ul>

      {/* CTA BOX */}
      <div className="highlight-box info">
        <strong>Find Your Perfect Keyboard:</strong> Use our{' '}
        <a href="/">keyboard tracker</a> to find the best deals on keyboards, 
        switches, and accessories. We aggregate prices from Keychron, Epomaker, Drop, 
        and other major retailers.
      </div>

    </BlogPostLayout>
  );
}
