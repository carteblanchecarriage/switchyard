# Analytics Setup - QUICKSTART

## ✅ What's Already Set Up

1. **Google Analytics 4 Tracking Code** - Added to `index.html`
2. **Custom Tracking Functions** - Ready for affiliate clicks, product views, searches
3. **Analytics Dashboard** - Node.js scripts for viewing stats
4. **Daily Reports** - Automated report generation

## 🚀 Next Steps

### 1. Enable Google Analytics (5 minutes)

```bash
# 1. Go to https://analytics.google.com/
# 2. Create a new property called "Switchyard"
# 3. Copy the Measurement ID (looks like G-XXXXXXXXXX)
# 4. Update index.html line ~105:
```

In `index.html`, find:
```javascript
gtag('config', 'G-SWITCHYARD', {
```

Replace `G-SWITCHYARD` with your actual GA4 ID.

### 2. Enable Google Search Console (5 minutes)

```bash
# 1. Go to https://search.google.com/search-console
# 2. Add property: https://carteblanchecarriage.github.io/switchyard/
# 3. Choose "HTML tag" verification method
# 4. Copy the content attribute value
# 5. Update index.html line ~135:
```

In `index.html`, find:
```html
<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
```

Replace `YOUR_VERIFICATION_CODE` with your actual code.

## 📊 Viewing Analytics

### Option 1: Command Line (Simple)
```bash
cd keyboard-tracker
node analytics/dashboard.js
```

Shows: Total clicks, views, top products, conversion rates

### Option 2: Web Dashboard (Better)
```bash
cd keyboard-tracker/analytics
npm install
node server.js
# Open http://localhost:3456
```

Shows: Visual charts, vendor breakdowns, category performance

### Option 3: Google Analytics (Production)
Visit: https://analytics.google.com/analytics/web/

Shows: Full traffic data, user behavior, acquisition channels

## 📈 Using the Data

### Weekly Optimization Checklist

```markdown
- [ ] Check top 10 products by clicks
- [ ] Review conversion rates by vendor
- [ ] Identify new popular search terms
- [ ] Move high-click products to homepage
- [ ] Check if top products are in stock
- [ ] Update affiliate links if broken
```

### Key Metrics to Watch

1. **Conversion Rate** (clicks ÷ views)
   - Good: 2-5%
   - Check product is in stock
   - Test different link placements

2. **Top Vendors**
   - Feature popular vendors
   - Add more products from top performers
   - Check commission rates

3. **Search Terms**
   - Create content for popular searches
   - Add products people are looking for
   - Optimize SEO

4. **Category Performance**
   - Keyboards vs keycaps vs switches
   - Feature underperforming categories

## 🎯 Example Optimization

**IF:** "Drop ALT Keyboard" gets 50 clicks/day but low conversion

**THEN:**
1. Check if it's in stock on Drop
2. Add warning if out of stock
3. Feature similar alternatives
4. Test different price display (show sale price)

**IF:** Users search "budget 60%" but few results

**THEN:**
1. Create "Best Budget 60% Keyboards" guide
2. Add more budget 60% products
3. Feature budget section on homepage

## 🔗 Integrating Tracking in Components

Example: Track when someone views a product

```typescript
import { useAnalytics } from '../hooks/useAnalytics';

function ProductCard({ product }) {
  const { trackView, trackClick } = useAnalytics();
  
  useEffect(() => {
    trackView(product, product.vendor, product.category);
  }, []);
  
  const handleBuy = () => {
    trackClick(product, product.vendor, product.category, product.price);
  };
  
  return (
    <div onClick={handleBuy}>
      {/* Product content */}
    </div>
  );
}
```

## 💰 Revenue Estimation

Based on analytics data:

```javascript
// Calculate potential revenue
const dailyClicks = 100;
const conversionRate = 0.02; // 2%
const avgOrder = 150;
const avgCommission = 0.08; // 8%

const dailyRevenue = dailyClicks * conversionRate * avgOrder * avgCommission;
// = $24/day = $720/month
```

Track this in your daily reports!

## 📁 Files Created

```
keyboard-tracker/
├── analytics/
│   ├── dashboard.js          # Core analytics logic
│   ├── server.js             # Web dashboard server
│   ├── daily-report.js       # Daily report generator
│   ├── README.md             # Full documentation
│   ├── QUICKSTART.md         # This file
│   └── package.json          # NPM dependencies
├── src/
│   └── hooks/
│       └── useAnalytics.ts   # React hook for tracking
```

## 🆘 Troubleshooting

**Dashboard shows no data?**
- Analytics are stored locally in `analytics/tracking-data.json`
- Data appears after users click links on the live site
- For GA4 data, visit analytics.google.com

**Google Analytics not working?**
- Check browser console for errors
- Verify GA4 ID is correct in index.html
- Wait 24-48 hours for data to appear in GA4

**Search Console verification failed?**
- Make sure the meta tag is in the `<head>`
- Site must be public on GitHub Pages
- Try the "URL prefix" method if verification fails

## 🎉 Next Level

After basic analytics are working:

1. **A/B Test Link Placements**
   - Test "Buy Now" vs "View on [Vendor]"
   - Test button colors
   - Track which gets more clicks

2. **Custom Events**
   - Track scroll depth on guides
   - Track "Add to Wishlist" clicks
   - Track social shares

3. **Email Integration**
   - Track newsletter signups
   - Track email click-through rates
   - Segment users by interest

Questions? Check `analytics/README.md` for detailed docs.
