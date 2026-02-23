# Enhanced Product URL Scraper

## Summary
Enhanced the keyboard-tracker scraper to fetch **real product URLs** from vendor sites instead of generating them.

## Changes Made

### 1. New File: `scraper/scraper-v2.js`
- Scrapes Shopify stores (Kono, NovelKeys, Keychron, KBDfans) via `/products.json` endpoints
- Scrapes Drop.com via HTML parsing for `/buy/` product links  
- Fetches Reddit [GB]/[IC] posts
- Fetches Geekhack interest checks
- Saves all data with **actual product URLs**, not homepage/collection links

### 2. Updated: `scraper/index.js`
- Now re-exports from `scraper-v2.js`
- Enhanced `scrapeDrop()` function to extract real `/buy/` URLs
- Added `runEnhancedScraper()` as default

### 3. New File: `package.json`
- Added dependencies: axios, cheerio, jsdom, express, cors
- Scripts: `npm run scrape`, `npm run scrape:enhanced`

## Vendor Coverage

| Vendor | Method | Real Product URLs |
|--------|--------|-----------------|
| Drop | HTML scraping | ✅ Yes - extracts `/buy/*` links |
| Kono.store | Shopify API | ✅ Yes - via `/products.json` |
| NovelKeys | Shopify API | ✅ Yes - via `/products.json` |
| Keychron | Shopify API | ✅ Yes - via `/products.json` |
| KBDfans | Shopify API | ✅ Yes - via `/products.json` |

## Data Output

The enhanced scraper outputs to `/data/keyboard-data.json` with:
```json
{
  "groupBuys": [...],      // Real products with URLs
  "allProducts": [...],    // Complete product catalog
  "interestChecks": [...], // Geekhack + Reddit ICs
  "vendors": [...],        // Vendor metadata
  "revenueProjection": {...}
}
```

Each product now has:
- `url`: Direct product page URL
- `affiliateUrl`: URL with tracking parameter
- `vendorUrl`: Vendor homepage
- `category`: keyboard|keycaps|switches

## Usage

```bash
# Install dependencies
cd /home/klondike/Desktop/keyboard-tracker
npm install

# Run enhanced scraper
npm run scrape:enhanced

# Or run original scraper
npm run scrape

# Start API server
npm start
```

## Dashboard Integration

The dashboard HTML (`dashboard/index.html`) should be updated to:
1. Fetch from `/api/groupbuys` endpoint
2. Use the real `url` and `affiliateUrl` fields
3. Display actual products instead of hardcoded data

## Next Steps

1. **Test the scraper**: Run `npm install && npm run scrape:enhanced`
2. **Update dashboard**: Modify to fetch from API instead of hardcoded data
3. **Add rate limiting**: Implement delays between requests for production
4. **Add caching**: Cache product data to avoid hammering vendor APIs
