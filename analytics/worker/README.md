# Switchyard Analytics Cloudflare Worker

Serverless analytics tracking for Switchyard.club using Cloudflare Workers + KV.

## Features

✅ **Edge Deployment** - Tracks data at 300+ locations globally  
✅ **Real-time Dashboard** - Beautiful dark-themed analytics UI  
✅ **Free Tier** - 100,000 requests/day, 1GB KV storage  
✅ **Rate Limiting** - Built-in per-IP rate limiting (100 req/min)  
✅ **CORS Enabled** - Works from any domain  
✅ **Auto-refresh** - Dashboard updates every 30 seconds  

## Quick Deploy

### 1. Install Wrangler

```bash
npm install -g wrangler
```

### 2. Authenticate

```bash
wrangler login
```

### 3. Create KV Namespace

```bash
# Create production KV namespace
wrangler kv:namespace create ANALYTICS_KV

# Create preview namespace
wrangler kv:namespace create ANALYTICS_KV --preview

# Copy the IDs to wrangler.toml
```

### 4. Update wrangler.toml

Replace the placeholder IDs in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "ANALYTICS_KV"
id = "your_actual_kv_id_here"          # From step 3
preview_id = "your_preview_id_here"   # From step 3
```

### 5. Deploy

```bash
# Deploy to production
wrangler deploy

# Or deploy to development
wrangler deploy --env development
```

### 6. Get Worker URL

After deployment, you'll see:
```
✨ Successfully published to:
https://switchyard-analytics.your-subdomain.workers.dev
```

## Integration with Switchyard

### Update public/index.html

Replace the analytics endpoint URL:

```javascript
// In public/index.html, around line 95
const endpoint = window.location.hostname === 'localhost' 
  ? 'http://localhost:3456/analytics/track'
  : 'https://switchyard-analytics.your-subdomain.workers.dev/track';
```

### Update useAnalytics.tsx

```typescript
// src/hooks/useAnalytics.tsx

const trackToWorker = async (data: any) => {
  const WORKER_URL = process.env.REACT_APP_ANALYTICS_URL 
    || 'https://switchyard-analytics.your-subdomain.workers.dev';
    
  fetch(\`\${WORKER_URL}/track\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(() => {});
};
```

### Environment Variable

Add to `.env`:

```bash
REACT_APP_ANALYTICS_URL=https://switchyard-analytics.your-subdomain.workers.dev
```

## API Endpoints

### POST /track
Record an analytics event.

```bash
curl -X POST https://your-worker.workers.dev/track \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "click",
    "product": "Keychron Q1",
    "vendor": "Keychron",
    "category": "keyboard",
    "price": "169",
    "page": "/",
    "referrer": "https://google.com"
  }'
```

**Event Types:**
- `click` - Product card click
- `view` - Product viewed
- `search` - Search query
- `affiliate_click` - Affiliate link click

### GET /dashboard
View the analytics dashboard.

```
https://your-worker.workers.dev/dashboard
```

### GET /api/summary?days=7
Get summary data as JSON.

```bash
curl "https://your-worker.workers.dev/api/summary?days=7"
```

Response:
```json
{
  "totalClicks": 245,
  "totalViews": 3240,
  "totalSearches": 89,
  "conversionRate": "7.56",
  "clicksChange": 23,
  "viewsChange": -5,
  "topVendors": [
    { "name": "Keychron", "count": 67 },
    { "name": "Drop", "count": 45 }
  ],
  "topProducts": [
    { "name": "Keychron Q1", "count": 34 },
    { "name": "Drop Alt", "count": 28 }
  ],
  "recentEvents": [...]
}
```

### GET /api/events?limit=50
Get raw events (paginated).

```bash
curl "https://your-worker.workers.dev/api/events?limit=50"
```

## Dashboard Features

The built-in dashboard at `/dashboard` shows:

- **Stats Overview** - Clicks, views, searches, conversion rate
- **Top Vendors** - Bar chart of most clicked vendors
- **Top Products** - Bar chart of most clicked products  
- **Recent Activity** - Live table of recent events
- **Period Comparison** - % change vs previous period
- **Auto-refresh** - Updates every 30 seconds

## Cost Estimate

### Free Tier (10K visitors/month):
- **Requests:** 100,000/day (plenty)
- **KV Storage:** 1GB (stores ~6 months of data)
- **Cost:** FREE

### Paid (if you exceed):
- **Additional requests:** $0.50/million
- **Additional KV storage:** $0.50/GB-month
- **Your site at 10K visits:** ~$0/month

## Data Retention

- **Raw events:** 30 days (configurable via `expirationTtl`)
- **Aggregated counters:** 30 days
- **Daily totals:** 90 days (can increase in code)

## Custom Domain

To use `analytics.switchyard.club`:

```bash
# Add domain to Cloudflare
# Then update wrangler.toml:

[[routes]]
pattern = "analytics.switchyard.club/*"
custom_domain = true
```

Deploy:
```bash
wrangler deploy
```

## Monitoring

### View Worker Logs

```bash
wrangler tail
```

### Health Check

```bash
curl https://your-worker.workers.dev/health
```

## Troubleshooting

### Dashboard shows "No data yet"
- Check browser console for CORS errors
- Verify endpoint URL is correct
- Test with direct API call:
```bash
curl -X POST https://your-worker.workers.dev/track \\
  -H "Content-Type: application/json" \\
  -d '{"type":"test","vendor":"test"}'
```

### Worker not receiving data
- Check rate limiting (100 req/min per IP)
- Verify KV binding is correct
- Check Wrangler logs: `wrangler tail`

### Dashboard not loading
- Check if CORS headers are present
- Verify worker is deployed: `wrangler deploy`
- Test endpoint: `curl https://your-worker.workers.dev/dashboard`

## Security

- Rate limiting: 100 requests/min per IP
- Data stored in Cloudflare's secure KV
- No PII stored (only aggregated metrics)
- Optional: Add API token verification

## Next Steps

1. Deploy worker with `wrangler deploy`
2. Update Switchyard to use new endpoint
3. Test with a few clicks
4. View dashboard at `/dashboard`
5. Monitor with `wrangler tail`

## Maintenance

### Clear old data
```bash
# List all keys
wrangler kv:key list --binding ANALYTICS_KV

# Delete specific key
wrangler kv:key delete --binding ANALYTICS_KV "keyname"
```

### Update worker
```bash
# Edit index.js, then:
wrangler deploy
```

---

**Questions?** Check Cloudflare Workers docs: https://developers.cloudflare.com/workers/