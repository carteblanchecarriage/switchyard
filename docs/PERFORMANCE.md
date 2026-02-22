# Keebshelf Performance Optimization Guide

**Goal:** < 100ms API response time, < 2s page load  
**Current Baseline:** API ~50ms, Page ~2s (no caching)

---

## Current Performance Profile

### API Performance
- Data file size: ~414KB (276 products)
- Response time: ~50ms (local server)
- Memory usage: ~50MB
- Rate limit: 100 requests/15min per IP

### Frontend Performance  
- Initial load: ~2s (data.json fetch)
- Time to interactive: ~3s
- JavaScript: ~50KB
- Images: Lazy loaded

---

## Optimization Strategies

### 1. API Response Caching ⭐ HIGH PRIORITY

**Current:** Data file loaded from disk every request
**Target:** In-memory cache with 60s TTL

**Implementation:**
```javascript
// Add to api/index-v2.js
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute

function getCachedData(key, loader) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  const data = loader();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Use in endpoint
app.get('/api/groupbuys', (req, res) => {
  const data = getCachedData('groupbuys', () => {
    // load actual data
  });
  res.json(data);
});
```

**Expected improvement:** 40ms → 5ms (90% faster)

---

### 2. Response Compression ⭐ HIGH PRIORITY

**Current:** No compression
**Target:** gzip/brotli compression

**Implementation:**
```javascript
// npm install compression
const compression = require('compression');
app.use(compression());
```

**Expected improvement:** 414KB → ~80KB (80% reduction)

---

### 3. Data Pagination Optimization

**Current:** All 276 products returned for /api/groupbuys
**Target:** Server-side pagination

**Implementation:**
```javascript
// Current
app.get('/api/groupbuys', (req, res) => {
  res.json(groupBuys); // All 276 items
});

// Optimized
app.get('/api/groupbuys', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 50, 100);
  
  const start = (page - 1) * limit;
  const paginated = groupBuys.slice(start, start + limit);
  
  res.json({
    data: paginated,
    meta: {
      pagination: {
        page,
        limit,
        total: groupBuys.length,
        totalPages: Math.ceil(groupBuys.length / limit)
      }
    }
  });
});
```

**Expected improvement:** 414KB → ~50KB per request

---

### 4. Frontend Caching ⭐ HIGH PRIORITY

**Current:** Data.json fetched every page load
**Target:** Cache with 1-hour TTL

**Implementation:**
```javascript
// Add to index.html
declare global {
  interface Window {
    appData: {
      products: any[];
      timestamp: number;
    } | null;
  }
}

const CACHE_KEY = 'keebshelf_data';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function loadProducts() {
  // Check cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const data = JSON.parse(cached);
    if (Date.now() - data.timestamp < CACHE_TTL) {
      return data.products;
    }
  }
  
  // Fetch fresh
  const response = await fetch('data.json');
  const products = await response.json();
  
  // Save to cache
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    products,
    timestamp: Date.now()
  }));
  
  return products;
}
```

**Expected improvement:** 2s → 100ms (95% faster on repeat visits)

---

### 5. CDN Integration

**Current:** GitHub Pages (no CDN)
**Target:** Cloudflare (free CDN)

**Implementation:**
1. Add domain to Cloudflare
2. Configure caching rules:
   - `data.json`: Cache 1 hour
   - Static assets: Cache 1 year
   - HTML: Cache 5 minutes

**Expected improvement:** Global latency 200ms → 50ms

---

### 6. Image Optimization

**Current:** Original vendor images (often large)
**Target:** Compressed + WebP format

**Implementation:**
```javascript
// Replace in scraper
const optimizedImage = imageUrl.replace(
  'massdrop-s3.imgix.net',
  'massdrop-s3.imgix.net?auto=format&w=400&q=80'
);
```

**Expected improvement:** Image payload 50% smaller

---

### 7. Connection Optimization

**Current:** HTTP/1.1 (GitHub Pages)
**Target:** HTTP/2 or HTTP/3

**Implementation:** Use Cloudflare (automatic HTTP/3)

---

## Performance Budget

Track these metrics:

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| API Response Time | 50ms | < 20ms | High |
| Time to First Byte | 500ms | < 200ms | High |
| First Contentful Paint | 2s | < 1.5s | High |
| Largest Contentful Paint | 3s | < 2.5s | Medium |
| Time to Interactive | 3.5s | < 2s | Medium |
| Total Page Size | 500KB | < 300KB | Medium |
| Lighthouse Score | ? | > 90 | Goal |

---

## Measurement Tools

### 1. Lighthouse (Built into Chrome DevTools)
```bash
# Automated
npm install -g lighthouse
lighthouse https://carteblanchecarriage.github.io/keebshelf --output=json
```

### 2. WebPageTest
https://webpagetest.org

### 3. Chrome DevTools Performance Tab
- Record page load
- Identify long tasks
- Check render blocking resources

### 4. API Load Test
```bash
cd api
node tests/load-test.js
```

---

## Quick Wins (Do These First)

1. ✅ **Add compression** (1 line of code)
2. ✅ **Add localStorage caching** (10 lines of code)
3. ✅ **Enable Cloudflare** (DNS change only)
4. ⏳ **Optimize images** (scraper change)
5. ⏳ **Add API response caching** (middleware)

---

## Implementation Roadmap

### Week 1: Foundation
- [ ] Add compression middleware
- [ ] Implement API response caching
- [ ] Add localStorage caching to frontend

### Week 2: Optimization
- [ ] Configure Cloudflare CDN
- [ ] Optimize images in scraper
- [ ] Implement server-side pagination

### Week 3: Monitoring
- [ ] Set up Lighthouse CI
- [ ] Performance monitoring dashboard
- [ ] Alert on performance regression

---

## Cost Impact

| Optimization | Cost | Saving | Net |
|--------------|------|--------|-----|
| Compression | $0 | Bandwidth | 0 |
| localStorage | $0 | Bandwidth | 0 |
| Cloudflare | $0 | Performance | 0 |
| Image CDN | $0-5/mo | Bandwidth | -$5/mo |

All optimizations are free or save money.

---

## Expected Results

After implementing all optimizations:

- **API Response:** 50ms → 10ms (5x faster)
- **Page Load:** 2s → 800ms (2.5x faster)
- **Bandwidth:** 500KB → 150KB (70% reduction)
- **Global Performance:** Consistent < 1s load times

---

Last Updated: 2026-02-21
