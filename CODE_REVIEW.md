# Code Review: Keebshelf MVP

**Date:** 2026-02-20
**Reviewer:** Klondike
**Scope:** Full MVP codebase

---

## Executive Summary

The MVP is **functional and well-architected** for a static GitHub Pages deployment. Major strengths include proper data scraping, pagination, and affiliate link tracking. However, there are several housekeeping issues, potential bugs, and optimization opportunities.

**Status:** ✅ Ready for use with minor fixes recommended

---

## 🔴 Critical Issues (Fix Immediately)

### 1. Duplicate Data Files (1.2MB waste)
**Issue:** Identical 412KB data.json files exist in 3 locations:
- `/data.json` (root)
- `/data/keyboard-data.json` (scraper output)
- `/dashboard/data.json` (GitHub Pages)

**Impact:** Repository bloat, confusion about which file to update

**Fix:** Use symlinks or update scraper to write to all locations:
```javascript
// In scraper-v2.js, replace single write with:
const writeLocations = [
  DATA_FILE,  // data/keyboard-data.json
  path.join(__dirname, '..', 'data.json'),  // root
  path.join(__dirname, '..', 'dashboard', 'data.json')  // GitHub Pages
];
writeLocations.forEach(loc => fs.writeFileSync(loc, jsonData));
```

---

## 🟡 High Priority Issues

### 2. Missing Error Handling on Image Loads
**Location:** `index.html` line ~1080

**Issue:** Images fail silently if URLs are broken
```javascript
// Current: No error handling
<img data-src="${item.image}" alt="${item.name}">
```

**Fix:** Add error handling:
```javascript
<img data-src="${item.image}" alt="${item.name}" 
     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image';this.classList.add('loaded')">
```

### 3. No Input Sanitization in Search
**Location:** `index.html` line ~1220

**Issue:** Search query is directly used in filter without sanitization
```javascript
const query = e.target.value.toLowerCase().trim(); // OK but could be better
item.name.toLowerCase().includes(query) // Potential issue if query has special chars
```

**Risk:** Low (static site), but good practice

**Fix:** Escape regex special characters:
```javascript
const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

### 4. Hardcoded Drop Products
**Location:** `scraper/scraper-v2.js` line ~200+

**Issue:** Drop products are hardcoded because their site blocks scraping:
```javascript
const products = [
  { id: 'drop-ctrl-v2', name: 'Drop CTRL Mechanical Keyboard', ... },
  // Only 8 products - manual maintenance required
];
```

**Risk:** Stale data, manual updates needed

**Fix:** Add headless browser option (Puppeteer/Playwright) as fallback:
```javascript
async function scrapeDropWithPuppeteer() {
  // Use puppeteer for JavaScript-heavy sites
}
```

---

## 🟢 Medium Priority Improvements

### 5. No Caching Strategy
**Issue:** Every page load fetches fresh data.json (412KB)

**Fix:** Add localStorage caching with TTL:
```javascript
const CACHE_KEY = 'keebshelf_data';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

function getCachedData() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  }
  return null;
}
```

### 6. Missing SEO Meta Tags
**Location:** `index.html` head section

**Current:** Only basic title and viewport

**Fix:** Add Open Graph, Twitter Cards, description:
```html
<meta name="description" content="Curated mechanical keyboard group buys and interest checks. Track drops from Keychron, Drop, KBDfans, NovelKeys, and more.">
<meta property="og:title" content="Keebshelf | Mechanical Keyboard Collection">
<meta property="og:description" content="Curated mechanical keyboard group buys...">
<meta property="og:image" content="https://carteblanchecarriage.github.io/keebshelf/preview.png">
```

### 7. No Analytics
**Issue:** Can't track user behavior, popular products, conversion rates

**Fix:** Add Plausible (privacy-friendly) or Google Analytics:
```html
<script defer data-domain="carteblanchecarriage.github.io" src="https://plausible.io/js/script.js"></script>
```

### 8. Kono.store Scraper Broken
**Location:** `scraper/scraper-v2.js`

**Issue:** Returns 404 for all collections (lines 15-17, 60-layout, etc.)

**Fix:** Check their actual API structure or remove from auto-scrape

---

## 📋 Code Quality Issues

### 9. Inconsistent Naming
- `joins` vs `upvotes` vs `votes` (different sources use different terms)
- `origin` (frontend) vs `vendor` (backend)
- `category` sometimes `keyboard`, sometimes `product_type`

**Recommendation:** Standardize in scraper transformation layer

### 10. Magic Numbers
**Location:** Throughout codebase

```javascript
ITEMS_PER_BATCH = 50;  // ✓ Good: Named constant
Math.floor(Math.random() * 500) + 50;  // ✗ Bad: Magic numbers
```

### 11. Commented-Out Code
**Search:** `git grep -n "\/\/\|#" -- '*.js' | grep -v node_modules | wc -l`

**Fix:** Remove dead code before production

---

## 🏗️ Architecture Concerns

### 12. Data Flow Confusion
```
Scraper → data/keyboard-data.json → (copied to) → data.json
                                      ↓
                               dashboard/data.json
```

**Better Flow:**
```
Scraper → data/products.json → GitHub Pages reads directly
                                      ↓
                              API serves same file
```

### 13. API Not Actually Used
**Issue:** The API folder exists but isn't deployed anywhere

**Current:** Static GitHub Pages site
**Future:** Could deploy API to Vercel/Railway for dynamic updates

---

## ✅ What's Working Well

1. **Pagination:** Loads 50 items at a time - prevents browser freeze
2. **Affiliate Links:** All URLs have `?ref=keyboardtracker` or `?referer=keyboardtracker`
3. **Category System:** Properly tags keyboards (280), cases (30), switches, keycaps
4. **Responsive Design:** CSS Grid works on mobile
5. **Error Handling:** Graceful fallback to hardcoded data
6. **Rate Limiting:** 1-second delays between scraper requests
7. **Data Validation:** Filters non-keyboard products in scraper

---

## 🎯 Recommended Next Steps (Priority Order)

### Immediate (Today)
- [ ] Fix duplicate data files (Issue #1)
- [ ] Add image error handling (Issue #2)
- [ ] Add SEO meta tags (Issue #6)

### This Week
- [ ] Add localStorage caching (Issue #5)
- [ ] Fix Kono.store scraper or remove (Issue #8)
- [ ] Add Plausible analytics (Issue #7)

### This Month
- [ ] Move off hardcoded Drop products (Issue #4)
- [ ] Deploy API to Vercel for dynamic updates
- [ ] Add user accounts for "Track this item" feature

---

## 📊 Performance Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Initial Load | ~2s (412KB data.json) | <1s with caching |
| Time to First Item | ~500ms | ~200ms |
| Bundle Size | 0 (no JS bundle) | N/A (static) |
| Lighthouse Score | ? | >90 |

---

## 🔐 Security Review

| Check | Status | Notes |
|-------|--------|-------|
| XSS Protection | ✓ | No user input displayed raw |
| HTTPS | ✓ | GitHub Pages enforces |
| Content Security Policy | ✗ | Not implemented |
| Dependency Vulnerabilities | ? | Run `npm audit` in scraper/

---

## 📈 Scalability Concerns

**Current:** 438 products
**Projected:** Could handle 5,000+ with current pagination

**Bottlenecks:**
1. `data.json` size (will exceed 1MB eventually)
2. No database (flat JSON only)
3. No server-side search (client-side only)

**Solutions for Scale:**
- Split data by category: `keyboards.json`, `keycaps.json`, etc.
- Add server-side API with database
- Implement Algolia/Elasticsearch for search

---

**Overall Grade: B+**

Solid MVP with good foundation. Fix duplicate files and add caching before marketing push.
