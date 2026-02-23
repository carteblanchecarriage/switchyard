# Keebshelf Analytics Setup Guide

**Goal:** Measure everything so we can optimize what works

---

## Analytics Stack

**Recommended Stack:**
1. **Google Analytics 4** - Free, comprehensive
2. **Google Search Console** - Free, SEO tracking
3. **Plausible** - Privacy-focused alternative ($9/month)
4. **Hotjar** - Heatmaps and recordings (free tier)

**For Launch:** Start with Google Analytics 4 + Search Console (both free)

---

## Google Analytics 4 Setup

### Step 1: Create Property
1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Create account: "Keebshelf"
4. Create property: "Keebshelf Website"
5. Time zone: America/New_York
6. Currency: USD
7. Industry: Shopping

### Step 2: Add Data Stream
1. Property → Data Streams → Add Stream
2. Choose "Web"
3. Website URL: `https://carteblanchecarriage.github.io/keebshelf/dashboard/`
4. Stream name: "Keebshelf Dashboard"
5. Click "Create Stream"

### Step 3: Get Measurement ID
Copy the "Measurement ID" - looks like `G-XXXXXXXXXX`

### Step 4: Add to Website
Add this to the `<head>` of index.html:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Step 5: Configure Events

**Custom Events to Track:**

Add this JavaScript to track important interactions:

```javascript
// Track affiliate link clicks
document.querySelectorAll('a[href*="aff"], a[href*="ref"]').forEach(link => {
  link.addEventListener('click', () => {
    gtag('event', 'affiliate_click', {
      'vendor': link.dataset.vendor || 'unknown',
      'product': link.dataset.product || 'unknown',
      'value': link.dataset.price || 0
    });
  });
});

// Track filter usage
document.getElementById('vendor-filter').addEventListener('change', (e) => {
  if (e.target.value) {
    gtag('event', 'filter_applied', {
      'filter_type': 'vendor',
      'filter_value': e.target.value
    });
  }
});

// Track search
document.getElementById('search-input').addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && e.target.value.length > 2) {
    gtag('event', 'search', {
      'search_term': e.target.value
    });
  }
});

// Track product view (when modal opens)
function trackProductView(product) {
  gtag('event', 'view_item', {
    'items': [{
      'item_id': product.id,
      'item_name': product.name,
      'item_brand': product.vendor,
      'price': parseFloat(product.price.replace(/[^0-9.]/g, '')) || 0
    }]
  });
}
```

**Required Events in GA4:**

| Event | Trigger | Parameters |
|-------|---------|------------|
| page_view | Page load | page_location, page_title |
| click | Any click | link_url, link_text |
| affiliate_click | Affiliate link | vendor, product, value |
| filter_applied | User applies filter | filter_type, filter_value |
| search | User searches | search_term |
| view_item | Product modal open | item_id, item_name, item_brand, price |
| select_item | User clicks product | item_id, item_name |
| begin_checkout | (Future: email signup) | ? |
| sign_up | Email subscribe | method |

---

## Google Search Console Setup

### Step 1: Verify Ownership
1. Go to https://search.google.com/search-console
2. Add property: Domain (`carteblanchecarriage.github.io`) or URL prefix
3. Verify via:
   - HTML file upload (recommended for GitHub Pages)
   - HTML meta tag
   - DNS record (for domain verification)

### For GitHub Pages Domain Verification:
**Method 1: Meta Tag**
Add to `<head>` of index.html:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

**Method 2: HTML File**
1. Download HTML verification file from GSC
2. Add to your repo root
3. File should be accessible at: `carteblanchecarriage.github.io/google123456789.html`

### Step 2: Submit Sitemap
1. In GSC → Sitemaps
2. Add sitemap URL: `https://carteblanchecarriage.github.io/keebshelf/sitemap.xml`
3. Click Submit

### Step 3: Key Metrics to Track

**Daily (Week 1 of launch):**
- Total clicks
- Total impressions
- Average position
- Top queries
- Coverage issues

**Weekly:**
- Click-through rate (CTR)
- Ranking changes
- Index issues
- Mobile usability

**Monthly:**
- Keyword portfolio growth
- Pages with impressions
- Core Web Vitals scores

---

## Privacy-Focused Alternative: Plausible

If you prefer not to use Google Analytics, Plausible is privacy-friendly.

### Setup:
1. Sign up at https://plausible.io ($9/month for 10K pageviews)
2. Add site: `carteblanchecarriage.github.io`
3. Copy tracking script

**Script:**
```html
<script defer data-domain="carteblanchecarriage.github.io" src="https://plausible.io/js/script.js"></script>
```

**Benefits:**
- GDPR compliant by default
- No cookie banner needed
- Lightweight (< 1KB)
- Open source

**Downsides:**
- Paid (after free trial)
- Less detailed than GA4
- No Google Search Console integration

---

## Key Performance Indicators (KPIs)

### Traffic Metrics
| Metric | Target M1 | Target M3 | Target M6 |
|--------|-----------|-----------|-----------|
| Daily Visitors | 100 | 1,000 | 5,000 |
| Page Views | 200 | 2,500 | 12,500 |
| Unique Visitors | 50/day | 500/day | 2,500/day |
| Sessions/User | 1.5 | 2.0 | 2.5 |
| Bounce Rate | <60% | <50% | <40% |
| Avg Session Duration | 2 min | 3 min | 4 min |

### Engagement Metrics
| Metric | Target | How to Track |
|--------|--------|--------------|
| Filter Usage | 30% of users | GA4 "filter_applied" event |
| Search Usage | 25% of users | GA4 "search" event |
| Product Views | 3 per session | GA4 "view_item" event |
| Affiliate CTR | 5% | GA4 "affiliate_click" event |
| Email Signups | 10% | GA4 "sign_up" event |

### SEO Metrics
| Metric | Target M1 | Target M6 |
|--------|-----------|-----------|
| Organic Traffic | 50% of total | 70% of total |
| Indexed Pages | 10 | 50+ |
| Average Position | 50+ | <20 |
| Top 10 Keywords | 0 | 10+ |
| Top 3 Keywords | 0 | 3+ |
| Backlinks | 5 | 50+ |
| Domain Rating | N/A | >20 |

### Revenue Metrics
| Metric | Target M1 | Target M3 | Target M6 |
|--------|-----------|-----------|-----------|
| Affiliate Conversions | 5 | 50 | 200 |
| Conversion Rate | 2% | 4% | 6% |
| Revenue | $50 | $500 | $2,000 |
| Revenue/User | $0.50 | $0.50 | $0.40 |

---

## Dashboard Setup

### GA4 Dashboard - "Keebshelf Overview"

**Cards to add:**
1. **Acquisition Overview**
   - Sessions by default channel
   - New vs returning users

2. **Engagement Overview**
   - Average engagement time
   - Views per session
   - Event count by event name

3. **Conversion Overview**
   - Affiliate clicks
   - Email signups
   - Filter usage

4. **Real-time**
   - Users in last 30 min
   - Page views by page title
   - Top events

**Create Dashboard:**
1. GA4 → Explore → Free form
2. Add dimensions: Page title, Event name, Channel
3. Add metrics: Sessions, Users, Events, Engagement time
4. Save as "Keebshelf Overview"

---

## Tracking Spreadsheet

Create a weekly tracking spreadsheet:

| Week | Date | Visits | Unique | Pages/Visit | Bounce % | Organic % | Affiliate Clicks | Conversions | Revenue |
|------|------|--------|--------|-------------|----------|-----------|------------------|-------------|---------|
| 1 | Feb 21 | ? | ? | ? | ? | ? | ? | ? | ? |
| 2 | Feb 28 | ? | ? | ? | ? | ? | ? | ? | ? |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Update weekly:** Sunday evenings

---

## Conversion Tracking

### Affiliate Link Tracking

**Add `data-*` attributes to all affiliate links:**

Current:
```html
<a href="...?ref=keyboardtracker" ...>Buy Now</a>
```

Trackable:
```html
<a href="...?ref=keyboardtracker" 
   data-vendor="keychron" 
   data-product="q1" 
   data-price="179" 
   class="affiliate-link">Buy Now</a>
```

**JavaScript:**
```javascript
// Track all affiliate clicks
document.querySelectorAll('.affiliate-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const vendor = e.target.dataset.vendor;
    const product = e.target.dataset.product;
    const price = parseFloat(e.target.dataset.price) || 0;
    
    // GA4
    gtag('event', 'affiliate_click', {
      vendor: vendor,
      product: product,
      value: price
    });
    
    // Log locally too
    console.log('Affiliate click:', { vendor, product, price });
  });
});
```

### Email Signup Tracking

```javascript
// When user subscribes
document.getElementById('subscribe-form').addEventListener('submit', (e) => {
  gtag('event', 'sign_up', {
    method: 'email_form'
  });
});
```

### UTM Parameters for Campaign Tracking

**When sharing links, always add UTM parameters:**

Base link:
```
https://carteblanchecarriage.github.io/keebshelf/dashboard/
```

With UTM:
```
https://carteblanchecarriage.github.io/keebshelf/dashboard/?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=thread-1
```

**UTM Structure:**

| Parameter | Example |
|-----------|---------|
| utm_source | twitter, reddit, discord, email |
| utm_medium | social, organic, email, referral |
| utm_campaign | launch, content-pillar, influencer-name |
| utm_content | thread-1, post-title, guide-name |

**URL Builder:** Use campaign URL builder when sharing:
https://ga-dev-tools.google/ga4/campaign-url-builder/

**Examples:**
```
# Reddit post
?utm_source=reddit&utm_medium=social&utm_campaign=launch&utm_content=rmk-post

# Twitter thread
?utm_source=twitter&utm_medium=social&utm_campaign=launch&utm_content=thread

# Discord
?utm_source=discord&utm_medium=social&utm_campaign=launch&utm_content=server-name

# Email
?utm_source=email&utm_medium=email&utm_campaign=weekly&utm_content=newsletter-1
```

---

## Heatmap Tracking (Hotjar)

### Setup:
1. Sign up at https://hotjar.com
2. Add site: `carteblanchecarriage.github.io`
3. Copy tracking code:

```html
<!-- Hotjar Tracking Code -->
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

### What to Look For:
1. **Hotmaps** - Where users click most
2. **Scroll maps** - How far users scroll
3. **Recordings** - Watch real user sessions (anonymized)

**Insights to gain:**
- Are users finding the filters?
- Where do they drop off?
- Which products get most attention?
- Are mobile users having issues?

---

## Reporting Schedule

### Daily (First 2 weeks of launch)
- Check GA4 real-time reports
- Monitor Search Console for issues
- Respond to any anomalies

### Weekly (Sunday evening)
- Update tracking spreadsheet
- Review top-performing pages
- Check affiliate conversion
- Note any traffic spikes
- Adjust content calendar based on data

### Monthly (End of month)
- Full GA4 report
- SEO ranking check
- Content performance review
- Revenue calculation
- Strategy adjustment

### Quarterly (90 days)
- Full site audit
- Content gap analysis
- Competitor comparison
- Growth projection update

---

## A/B Testing

### What to Test:

**High-Impact Tests:**
1. **CTA Button Color** - Gold vs Blue vs Green
2. **CTA Text** - "Buy" vs "Shop Now" vs "Check Price"
3. **Product Card Layout** - Image size, price placement
4. **Filters** - Which filters get most use
5. **Search Placement** - Top vs sidebar vs modal

### How to Test:

**Simple Test (no tool needed):**
```javascript
// Rotate CTA color randomly
const colors = ['#D4AF37', '#007bff', '#28a745'];
const randomColor = colors[Math.floor(Math.random() * colors.length)];
document.documentElement.style.setProperty('--cta-color', randomColor);

// Track which performs best
gtag('event', 'cta_color_view', {
  color: randomColor
});
```

**Using Google Optimize (Free):**
1. Set up Optimize container in GA4
2. Create experiment: "CTA Button Test"
3. Set variants:
   - Variant A: Original
   - Variant B: Yellow button
   - Variant C: Blue button
4. Set objective: "affiliate_clicks"
5. Run for 2 weeks or statistical significance

---

## Analytics Alerts

### GA4 Alerts to Set Up:

**Traffic Drop Alert:**
- Trigger: Sessions decrease 50% vs previous day
- Notify: Email

**Zero Traffic Alert:**
- Trigger: Sessions = 0 for 2 hours
- Notify: Email

**Affiliate Spike Alert:**
- Trigger: Affiliate clicks > 100 in 1 hour
- Notify: Email (opportunity to capitalize)

### Search Console Alerts:

**Index Issues:**
- Automatic emails for crawl errors

**Core Web Vitals:**
- Monitor for any "Poor" ratings

---

## Troubleshooting

**Problem: GA4 showing no data**
- Check measurement ID is correct
- Verify script is in `<head>`
- Wait 24-48 hours for first data

**Problem: Search Console not verifying**
- HTML file: ensure it's at root level
- Meta tag: clear CDN cache
- DNS: Wait 24-48 hours for propagation

**Problem: Affiliate clicks not tracking**
- Check `.affiliate-link` class is on links
- Verify event code loads after DOM
- Check if ad blockers are blocking

---

**Summary:**
1. Set up GA4 with measurement ID
2. Add tracking events to index.html
3. Set up Search Console with verification
4. Submit sitemap
5. Create weekly tracking spreadsheet
6. Use UTM parameters on all shared links
7. Review data weekly and adjust strategy

**Total Setup Time:** 2-3 hours

---

**Last Updated:** 2026-02-21
