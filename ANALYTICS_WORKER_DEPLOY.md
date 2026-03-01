# Cloudflare Analytics Worker - Deploy Guide

## ✅ Worker Created & Pushed

**Commit:** `e0416bbd` - "Add Cloudflare Worker analytics with real-time dashboard"

### What's Included

| File | Purpose | Size |
|------|---------|------|
| `analytics/worker/index.js` | Worker script (API + Dashboard) | 17.5 KB |
| `analytics/worker/wrangler.toml` | Configuration | 0.8 KB |
| `analytics/worker/README.md` | Full deployment docs | 6.1 KB |
| `analytics/worker/deploy.sh` | One-command deploy script | 1.7 KB |
| `src/hooks/useAnalytics.tsx` | Updated React hook | 5.8 KB |

---

## 🚀 Deploy in 5 Minutes

### Step 1: Prerequisites

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Step 2: Create KV Namespace

```bash
cd analytics/worker

# Create KV namespace
wrangler kv:namespace create ANALYTICS_KV

# Output will show:
# 🌀 Creating namespace with title... ✨ Success!
# Add the following to your configuration file:
# [[kv_namespaces]]
# binding = "ANALYTICS_KV"
# id = "xxxxxxxxxxxxxxxxxxxx"
```

### Step 3: Update wrangler.toml

Open `analytics/worker/wrangler.toml` and replace:

```toml
[[kv_namespaces]]
binding = "ANALYTICS_KV"
id = "YOUR_ACTUAL_ID_HERE"           # <-- Replace with ID from step 2
preview_id = "YOUR_PREVIEW_ID_HERE"  # <-- From: wrangler kv:namespace create --preview
```

### Step 4: Deploy

```bash
# Option A: Use the deploy script
chmod +x deploy.sh
./deploy.sh

# Option B: Manual deploy
wrangler deploy
```

### Step 5: Get Your URL

After deploy, you'll see:
```
✨ Successfully published your script to:
https://switchyard-analytics.your-account.workers.dev
```

**Copy this URL for Step 6**

### Step 6: Update Switchyard

Edit `src/hooks/useAnalytics.tsx` and replace the placeholder:

```typescript
// Line 30
cd 'https://your-worker-url.workers.dev'  // <-- Replace with your actual URL
cd```

Then rebuild and deploy Switchyard:

```bash
cd ~/Desktop/keyboard-tracker
npm run build
# Deploy to GitHub Pages or wherever you host
```

---

## 📊 Features

### Real-time Dashboard
```
https://your-worker.workers.dev/dashboard
```

**What it shows:**
- Total Clicks / Product Views / Searches / Conversion Rate
- Period comparison (% change vs previous period)
- Top Vendors bar chart
- Top Products bar chart
- Recent Activity (last 20 events)
- Auto-refresh every 30 seconds

### API Endpoints

#### POST /track
```bash
curl -X POST https://your-worker.workers.dev/track \
  -H "Content-Type: application/json" \
  -d '{
    "type": "click",
    "product": "Keychron Q1",
    "vendor": "Keychron",
    "category": "keyboard",
    "price": "169"
  }'
```

#### GET /api/summary?days=7
Returns JSON summary for dashboard

#### GET /health
Health check endpoint

### Security
- ✅ Rate limiting: 100 req/min per IP
- ✅ CORS enabled for switchyard.club
- ✅ 30-day data retention
- ✅ No PII stored

---

## 💰 Cost (Free Tier)

| Metric | Free Limit | Your Site @ 10K/mo |
|--------|-----------|-------------------|
| Requests | 100,000/day | ~330/day ✅ |
| KV Storage | 1GB | ~10MB ✅ |
| KV Reads | 100,000/day | ~1,000/day ✅ |
| KV Writes | 1,000/day | ~100/day ✅ |

**Cost: $0 for your traffic volume**

---

## 🎯 Next Steps

1. [ ] Deploy worker (steps above)
2. [ ] Test: `curl -X POST /track -d '{"type":"test"}'`
3. [ ] View dashboard at `/dashboard`
4. [ ] Update Switchyard with worker URL
5. [ ] Monitor for 24 hours to ensure data flows
6. [ ] Optional: Add custom domain (analytics.switchyard.club)

---

## 🔍 Troubleshooting

### Dashboard empty?
```bash
# Check if data is being recorded
curl https://your-worker.workers.dev/api/summary?days=7

# Should return JSON with stats
```

### Switchyard not sending events?
```bash
# Check browser console for CORS errors

# Verify worker URL in useAnalytics.tsx
# Should match deployed URL
```

### Deploy fails?
```bash
# Check Wrangler login
wrangler whoami

# Check KV binding
wrangler kv:namespace list
```

---

## 📝 Files Created

All committed to repo:
- `analytics/worker/index.js` - Worker code
- `analytics/worker/wrangler.toml` - Config  
- `analytics/worker/README.md` - Full docs
- `analytics/worker/deploy.sh` - Deploy script
- `src/hooks/useAnalytics.tsx` - Updated React hook

**Status:** Pushed to GitHub ✅

Ready to deploy!
