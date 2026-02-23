# Data Attribution

Keyboard Tracker aggregates publicly available data from the mechanical keyboard community. This document explains our data sources and how we attribute them.

## Data Sources

### 1. Reddit
- **Subreddits**: r/MechanicalKeyboards, r/mechmarket, r/keyboards
- **Data Type**: Public posts with [GB] (Group Buy) and [IC] (Interest Check) tags
- **Method**: Reddit JSON API (public, no authentication required)
- **Attribution**: All Reddit posts link directly to original threads
- **Rate Limiting**: Respects Reddit's API guidelines

### 2. Geekhack.org
- **Forum**: Group Buy and Interest Check sections
- **Data Type**: Public forum threads
- **Method**: HTML scraping of public pages
- **Attribution**: Links back to original forum threads
- **Respect**: Follows robots.txt and doesn't scrape private content

### 3. Vendor Websites
- **Sources**: Drop.com, Kono.store, NovelKeys, Keychron, KBDfans
- **Data Type**: Public product listings, pricing, availability
- **Method**: Manual curation + public API where available
- **Attribution**: Direct links to product pages (often affiliate links)

## Data Ethics

### What We Do
✅ Only aggregate **publicly visible** data
✅ Link back to all original sources
✅ Respect robots.txt and rate limits
✅ Don't scrape private messages or login-required content
✅ Cache data to reduce load on source sites

### What We Don't Do
❌ Scrape private forum sections
❌ Bypass login walls or paywalls
❌ Scrape at excessive rates
❌ Claim ownership of others' content
❌ Store personal data from users

## Affiliate Relationships

We have affiliate partnerships with some vendors:
- **Drop**: 5% commission
- **Kono.store**: 10% commission
- **NovelKeys**: 10% commission
- **Keychron**: 8% commission
- **KBDfans**: 8% commission

These relationships are disclosed on all relevant pages per FTC guidelines.

## Community Contribution

This project exists to help the mechanical keyboard community:
- Centralizes group buy discovery
- Prevents missed deadlines
- Surfaces interest checks
- Supports vendors through affiliate sales

We welcome feedback from the community and vendors about our data practices.

## Contact

For data concerns or takedown requests: [Contact form - not yet implemented]

## Updates

- **2026-02-19**: Initial data attribution documentation
