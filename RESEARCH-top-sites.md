# Keebshelf Competitive Research & Feature Roadmap

## What Makes Mechanical Keyboard Sites Successful

### 1. Geekhack (geekhack.org)
**Why it works:**
- **Interest check (IC) to group buy (GB) pipeline** - Community validates designs before production
- **Vendor-neutral** - Not tied to one manufacturer
- **Deep technical discussions** - PCB files, QMK firmware, plate files
- **Mature user base** - Been around since 2011

**What Keebshelf can learn:**
- Track IC → GB progression (currently just scrapes them)
- Show sentiment/engagement on IC threads (upvotes, comments)
- Archive historical ICs (some lead to GB 12 months later)

### 2. r/MechanicalKeyboards (Reddit)
**Why it works:**
- **Discovery** - Photos drive engagement
- **No barrier to entry** - Anonymous posts
- **Sound tests** - Audio is crucial
- **Daily routine** - People check every morning

**What Keebshelf can learn:**
- Daily "new drops" digest
- Sound test integration
- Photo-first layout (currently text-heavy)

### 3. Vendor Sites (KBDfans, NovelKeys, Keychron)
**Why they work:**
- **Trust** - Official source
- **Purchase directly** - No friction
- **Newsletter/notification** - "Notify me"

**What Keebshelf can learn:**
- Can't compete as vendor but CAN aggregate
- Price comparison across vendors for same item (e.g., Gateron Yellows everywhere)
- Unified "notify me" wishlist

### 4. Drop (formerly Massdrop)
**Why it works:**
- **Group buy infrastructure** - Actually runs the transactions
- **Voting** - "Request this product"
- **Discussion per product** - Builds community around drops

**What Keebshelf can learn:**
- Community wishlist/voting (even if we don't fulfill)
- Discussion threads per product (via webhook to Discord?)

---

## Gaps Keebshelf Can Fill

### The Problem Today
- Community lives in 3 places: Geekhack (ICs), Reddit (photos), Vendors (purchases)
- No single place to see "what's available now and how much does it cost"
- Price comparison requires 5+ tabs
- Historical pricing doesn't exist ("was this cheaper during Black Friday?")
- Availability comes with lag (sold out but still shows in stock)

### The Opportunity
**"The Bloomberg Terminal for Mechanical Keyboards"**
- Real-time data
- Historical trends
- Cross-vendor comparison
- Watchlists/alerts
- No FOMO (know when it's available)

---

## Feature Roadmap (Ethical & Sustainable)

### v1.0 (Current)
- ✅ Basic scraping from 4-5 vendors
- ✅ Filter by category
- ✅ Sort by price
- ✅ Hide sold out

### v1.1 (Next 2 weeks)
- ⏩ **Price history** - Track prices over time
- ⏩ **Price alerts via email** - "Notify me when under $X"
- ⏩ **Daily digest email** - New items available today
- ⏩ **Mobile app** (or PWA)

### v1.2 (Next 2 months)
- ⏩ **Cross-vendor price comparison** - Same switch at KBDfans vs NovelKeys
- ⏩ **IC → GB tracking** - See interest checks that graduated to group buys
- ⏩ **Community reviews/ratings** - User-submitted
- ⏩ **Sound test database** - Link to YouTube sound tests per switch/keyboard

### v2.0 (Long term)
- ⏩ **Live inventory** - Real stock counts (if vendors provide API)
- ⏩ **Pre-owned marketplace** - Aggregated /r/mechmarket, /r/hardwareswap
- ⏩ **Build configurator** - "Show me all parts under $300"
- ⏩ **Vendor API partnerships** - Official data feeds vs scraping

---

## What Makes Keebshelf Different

### NOT Trying To Be:
- Drop (we don't need transaction revenue)
- Geekhack (we don't need IC management)
- A vendor (we don't inventory)

### Trying To Be:
- **Kayak.com for keyboards** - Just information, neutral
- **Hacker News for keyboards** - What's new, discussion
- **RSS for keyboards** - Aggregate everything

---

## Ethical Considerations

### What's Fair:
- ✅ Scraping public data (same as Google)
- ✅ Linking with affiliate codes (disclosed)
- ✅ Providing price transparency
- ✅ Reducing vendor switching costs (pro-consumer)

### What's Not:
- ❌ Scraping behind login walls
- ❌ False availability data (leads to bad UX)
- ❌ Hidden vendor preference (all vendors should be equal)
- ❌ User tracking without consent
- ❌ Reselling data to vendors

### The Line:
- Keep it simple: **information wants to be free**
- Be neutral: **equal treatment of all vendors**
- Be honest: **clear about data sources and limitations**

---

## Success Metrics

### Short Term (3 months)
- 1,000 uniques/month
- Newsletter subscribers: 100
- Price alerts set up: 50

### Medium Term (12 months)
- 10,000 uniques/month
- Newsletter: 1,000
- Referral revenue: $500/month
- API partnerships: 2 vendors

### Long Term (24 months)
- 50,000 uniques/month
- Newsletter: 5,000
- Revenue: $2,000/month (sustainable)
- Consider: full-time curator, part-time dev

---

## Next 48 Hours Priority

### Hour 0-12: Data Infrastructure
1. Set up price history DB (Supabase)
2. Update scraper to capture historical prices
3. Build price chart component

### Hour 12-24: Price Alerts
1. Email capture form (no login required)
2. Simple price threshold alerts
3. Integration with SendGrid/Mailgun

### Hour 24-36: Daily Digest
1. Scrape diff detection (what's new since last check)
2. Email template for daily updates
3. Schedule daily send (9 AM EST)

### Hour 36-48: Social Sharing
1. "Share this deal" buttons for each item
2. Auto-generate shareable screenshots
3. Twitter/Discord/Reddit formatted posts

---

## Differentiation Statement

**Keebshelf is the Bloomberg terminal for mechanical keyboards.**

We don't sell. We don't judge. We don't favor vendors.

We aggregate 200+ products from every major vendor.
We track price history so you know if it's a good deal.
We alert you when something you want is in stock or on sale.
We curate 50+ interest checks so you know what's coming.

Everything. Every vendor. One place.
