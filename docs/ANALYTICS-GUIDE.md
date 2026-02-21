# Keebshelf Analytics Guide

## Free Analytics Options for Keebshelf

### Option 1: Plausible Analytics (Recommended) ⭐
**Best for:** Privacy-focused, simple, fast
- **Price:** Free tier (10k pageviews/month) or self-hosted
- **Pros:** No cookie banner needed, lightweight (<1KB), simple dashboard, GDPR-compliant
- **Cons:** Limited advanced features, free tier has limits
- **Setup:** Single script tag, 5 minutes
- **Link:** plausible.io

### Option 2: Google Analytics 4
**Best for:** Comprehensive data, free forever
- **Price:** Free (up to millions of hits)
- **Pros:** Most features, integrates with Search Console, audience insights, conversion tracking
- **Cons:** Cookie banner required, heavy script, privacy concerns, complex
- **Setup:** Google account, property creation, script tag
- **Link:** analytics.google.com

### Option 3: Cloudflare Web Analytics
**Best for:** Already using Cloudflare
- **Price:** Free forever
- **Pros:** No JavaScript (server-side), privacy-first, fast, bot detection
- **Cons:** Requires Cloudflare DNS proxy, less detailed than GA4
- **Setup:** Enable in Cloudflare dashboard
- **Link:** dash.cloudflare.com

### Option 4: Umami (Self-Hosted)
**Best for:** Full control, open source
- **Price:** Free (host on your own server)
- **Pros:** Own your data, simple UI, no third-party scripts
- **Cons:** Requires Node.js hosting, setup complexity
- **Setup:** Deploy to Railway/Vercel/self-host
- **Link:** umami.is

### Option 5: Simple Analytics
**Best for:** Minimal, privacy-focused
- **Price:** Free trial, then paid ($9/month)
- **Pros:** Clean UI, no cookies, EU-based
- **Cons:** Not free long-term
- **Link:** simpleanalytics.com

---

## Recommended: Plausible (Free Tier)

### Why Plausible for Keebshelf:
1. ✅ **No cookie banner** — Clean UX, no annoying banners
2. ✅ **Lightweight** — 1KB vs 50KB+ (GA4)
3. ✅ **Simple dashboard** — Easy to understand metrics
4. ✅ **Privacy-focused** — No personal data collection
5. ✅ **GitHub Pages compatible** — Just a script tag
6. ✅ **Free tier** — 10k pageviews/month (plenty for startup)

### What You'll Track:
- Page views (homepage, guides, blog)
- Popular products (which keyboards people click)
- Wizard funnel (start → step 1 → step 5 → results)
- Outbound clicks (vendor referrals)
- Referrer sources (Google, Reddit, etc.)
- Device types (mobile vs desktop)

### Key Metrics to Watch:
| Metric | Why It Matters |
|--------|----------------|
| **Daily visitors** | Is traffic growing? |
| **Top products** | Which keyboards are popular? |
| **Wizard completion** | Are people finishing? Where do they drop? |
| **Click-through rate** | Are people clicking to vendors? |
| **Bounce rate** | Are people leaving immediately? |
| **Referrers** | Where is traffic coming from? |

---

## Implementation (Plausible)

### Step 1: Sign Up
1. Go to plausible.io
2. Create free account
3. Add your domain: `carteblanchecarriage.github.io`

### Step 2: Add Script
Add to `<head>` of all pages:
```html
<script defer data-domain="carteblanchecarriage.github.io" src="https://plausible.io/js/script.js"></script>
```

Or self-hosted:
```html
<script defer data-domain="carteblanchecarriage.github.io" src="https://your-plausible.com/js/script.js"></script>
```

### Step 3: Track Events (Optional)
Track custom events like wizard completion:
```javascript
// When user completes wizard
plausible('Wizard Complete', {props: {step: 5}})

// When user clicks vendor link
plausible('Vendor Click', {props: {vendor: 'Drop', product: 'CTRL'}})
```

---

## Alternative: Cloudflare (If Already Using)

If you're proxying through Cloudflare (for the tunnel), just enable:
1. Go to Cloudflare dashboard
2. Analytics → Analytics & Logs
3. Enable Web Analytics (free)
4. No code needed!

---

## Quick Decision Tree

```
Want simple + private?        → Plausible (free tier)
Already using Cloudflare?     → Cloudflare Analytics
Need advanced features?       → Google Analytics 4
Want full control?            → Umami (self-hosted)
```

---

## My Recommendation for Keebshelf

**Start with Plausible free tier** → Upgrade or switch to Cloudflare if you hit limits.

Reasons:
- Keeps site fast (1KB script)
- No cookie banner = cleaner UX
- 10k pageviews is plenty for current traffic
- Simple dashboard, not overwhelming
- Privacy-first fits the community vibe

**Add this week, start tracking immediately.**
