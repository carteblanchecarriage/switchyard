# Switchyard Analytics Setup

This folder contains simple analytics tracking for Switchyard to understand traffic and optimize affiliate links.

## What's Tracked

1. **Affiliate Clicks** - When users click product links to vendors
2. **Product Views** - When users view product details
3. **Search Queries** - What users are searching for
4. **Vendor Filters** - Which vendors are most popular

## Files

- `dashboard.js` - Core analytics logic and reporting
- `server.js` - Simple Express server for viewing analytics
- `tracking-data.json` - Local storage of tracking data

## Setup

### 1. Google Analytics 4 (Recommended for Production)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for "Switchyard"
3. Get your Measurement ID (looks like `G-XXXXXXXXXX`)
4. Replace `G-SWITCHYARD` in `index.html` with your actual ID

### 2. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://carteblanchecarriage.github.io/switchyard/`
3. Verify ownership (HTML tag method)
4. Copy the verification code
5. Replace `YOUR_VERIFICATION_CODE` in `index.html`

### 3. Local Analytics (Simple)

Run the local analytics server to track clicks:

```bash
cd analytics
npm install
node server.js
```

Then open: http://localhost:3456

## Viewing Analytics

### Method 1: Command Line
```bash
node analytics/dashboard.js
```

### Method 2: Web Dashboard
```bash
node analytics/server.js
# Open http://localhost:3456
```

### Method 3: Google Analytics Dashboard
Visit: https://analytics.google.com/

## How to Use the Data

### Optimize Based on Metrics

1. **High clicks, low conversion?**
   - Check if product is in stock
   - Review affiliate link placement
   - Consider price competitiveness

2. **Top vendor not converting?**
   - Check if affiliate link works
   - Compare to direct vendor links
   - May need better product descriptions

3. **Search queries show patterns?**
   - Add more products for popular searches
   - Create dedicated category pages
   - Optimize SEO for top search terms

4. **Category underperforming?**
   - Add more products to category
   - Improve category descriptions
   - Feature on homepage

## Reports

### Daily Report
Run daily to see what's working:
```bash
node analytics/dashboard.js > reports/daily-$(date +%Y%m%d).txt
```

### Weekly Optimization Checklist
- [ ] Review top 10 products by clicks
- [ ] Check conversion rates by vendor
- [ ] Identify new popular searches
- [ ] Update featured products based on data
- [ ] Fix any broken affiliate links

## Privacy

- No personal data collected
- Only anonymized click/view counts
- GDPR compliant (no cookies required)

## Revenue Estimation

Use the dashboard to estimate revenue:

```javascript
// Average commission rates
const rates = {
  'Keychron': 0.08,    // 8%
  'KBDfans': 0.08,     // 8%
  'NovelKeys': 0.10,   // 10%
  'Epomaker': 0.06,    // 6%
  'Drop': 0.05,        // 5%
  'Qwerkywriter': 0.15 // 15% (estimated)
};

// Estimate: clicks × conversion rate × avg order × commission
// Example: 100 clicks × 2% × $150 × 8% = $24/day
```

## Optimization Ideas

Based on analytics data:

1. **Feature high-click products** on homepage
2. **Remove or move** low-performing products
3. **Create guides** for popular search terms
4. **Add more products** from top vendors
5. **A/B test** affiliate link placements
6. **Seasonal content** based on search trends

## Support

To add to GitHub Actions for automated reporting:
```yaml
- name: Generate Analytics Report
  run: node analytics/dashboard.js
```
