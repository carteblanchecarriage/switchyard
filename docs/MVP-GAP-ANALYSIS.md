# Keebshelf MVP Feature Gap Analysis

**Goal:** Identify what's truly missing for a Minimum Viable Product launch

**Current Status:** Production infrastructure complete, core functionality working
**Definition of MVP:** Usable by strangers without hand-holding, generates value, can be improved post-launch

---

## Current State Analysis

### ✅ What's Working (Shippable Now)
| Feature | Status | Quality |
|---------|--------|---------|
| Product aggregation (276 items) | ✅ | High |
| Vendor filtering | ✅ | High |
| Price sorting | ✅ | High |
| Category filtering | ✅ | High |
| Mobile responsive | ✅ | High |
| Affiliate links | ✅ | High (disclosed) |
| Data freshness (<2hrs) | ✅ | High |
| API | ✅ | Production-ready (B+ security) |
| SEO foundation | ✅ | Good |
| Content (3 guides) | ✅ | Good |

### ⚠️ What's Working But Needs Polish
| Feature | Issue | Effort |
|---------|-------|--------|
| Search function | Client-side only, no highlighting | Low |
| Product modal | Basic, need better info | Low |
| Filtering UX | Works but could be smoother | Low |
| Loading states | Spinner only, no skeleton | Low |
| Error states | Generic, need specific errors | Low |

### ❌ What's Missing for MVP
| Feature | Why Required | Effort |
|---------|------------|--------|
| **Email alerts/wishlist** | Core value prop ("get notified") | Medium |
| **Price history** | Builds trust ("is this a good deal?") | Medium |
| **Better product details** | Users need specs before clicking | Low |
| **Sorting beyond price** | Popularity, newest, alphabetical | Low |

---

## MVP Feature Requirements

### Must Have (Launch Blockers)

#### 1. Email/Wishlist System ⭐⭐⭐
**User Story:** As a shopper, I want to save products and get notified when prices drop or they come in stock.

**Current State:** Modal says "Track This Item" but not implemented

**Required:**
- [ ] Email capture form (modal or inline)
- [ ] Save product to "my list"
- [ ] Send email when price drops 10%+
- [ ] Send email when out-of-stock item returns
- [ ] Daily digest of price changes
- [ ] Unsubscribe functionality

**Technical:**
- Supabase for user/product storage
- SendGrid/Mailgun for emails
- Background job for price comparisons

**Effort:** 8-12 hours
**Impact:** HIGH - Core value proposition

---

#### 2. Product Detail Enhancement ⭐⭐⭐
**User Story:** As a shopper, I want to see specs before I click the buy button.

**Current State:** Modal shows name, price, vendor, description only

**Required:**
- [ ] Switch type (if available)
- [ ] Layout/size (60%, 65%, etc.)
- [ ] Hot-swap vs solder
- [ ] Connectivity (wired/wireless)
- [ ] Keycap material (PBT, ABS)
- [ ] Case material (aluminum, plastic, acrylic)
- [ ] Weight (if available)
- [ ] Availability status (pre-order, in-stock, sold out)

**Technical:**
- Scraper enhancement to extract more specs
- Modal redesign for more information density
- Icon system for quick visual scanning

**Effort:** 4-6 hours
**Impact:** HIGH - Reduces bounce before clicking affiliate link

---

#### 3. Price History Chart ⭐⭐
**User Story:** As a shopper, I want to know if $179 is a good price or if I should wait.

**Current State:** No price history tracked

**Required:**
- [ ] Store price history in database
- [ ] Show price chart on product modal
- [ ] Display: Current price, lowest price, highest price, average
- [ ] "Last price change" indicator
- [ ] Price trend arrow (rising/falling/stable)

**Technical:**
- Supabase table: `price_history`
- Chart library: Chart.js or lightweight custom
- Scraper updates to store prices

**Effort:** 6-8 hours
**Impact:** MEDIUM - Builds trust and increases conversions

---

#### 4. Advanced Sorting ⭐
**User Story:** As a shopper, I want to sort by more than just price.

**Current State:** Price only (low/high)

**Required:**
- [ ] Sort by: Newest first (date added)
- [ ] Sort by: Name (A-Z)
- [ ] Sort by: Vendor (alphabetical)
- [ ] Sort by: Price (already done)

**Technical:**
- Frontend sorting enhancement
- Add "dateAdded" field to products
- Update sort dropdown UI

**Effort:** 2-3 hours
**Impact:** LOW - Nice to have

---

#### 5. Empty State / No Results ⭐
**User Story:** As a shopper, when my search returns nothing, I should know what to do.

**Current State:** Blank grid when no matches

**Required:**
- [ ] Friendly "no results" message
- [ ] Clear filters CTA button
- [ ] Suggested searches or popular items
- [ ] "Can't find what you're looking for? Let us know" form

**Technical:**
- Conditional rendering in filter logic
- Design empty state illustration/icon
- Add feedback form

**Effort:** 2 hours
**Impact:** LOW - UX polish

---

## Should Have (Post-Launch Week 1-2)

#### 6. Keyboard Comparison Tool
**User Story:** I can't decide between Keychron Q1 vs Drop CTRL. Let me compare side-by-side.

**Requirement:** Select 2-3 products, open comparison modal/table

**Effort:** 6 hours
**Impact:** MEDIUM

#### 7. User Accounts / Wishlist Persistence
**User Story:** I want to save my list without giving my email to another service.

**Requirement:** Simple auth (magic link), saved favorites

**Effort:** 6 hours
**Impact:** MEDIUM

#### 8. Search Enhancement
**User Story:** Current search just filters. I want fuzzy search, autocomplete, "did you mean"

**Requirement:** Fuse.js or similar fuzzy search, suggestion dropdown

**Effort:** 4 hours  
**Impact:** MEDIUM

---

## Nice to Have (Post-Launch Month 1-2)

#### 9. "Find My Perfect Board" Wizard
**Effort:** 12 hours  
**Impact:** HIGH (but can wait)

#### 10. Community Reviews
**Effort:** 16 hours  
**Impact:** HIGH (trust building)

#### 11. Vendor Reliability Ratings
**Effort:** 4 hours  
**Impact:** MEDIUM

#### 12. Group Buy Calendar
**Effort:** 8 hours  
**Impact:** MEDIUM

#### 13. Mobile App
**Effort:** 40+ hours  
**Impact:** MEDIUM (most traffic is mobile web)

---

## Feature Prioritization Framework

### RICE Scoring

**R**each: How many users will this affect? (1-10)
**I**mpact: How much will it improve their experience? (1-10)
**C**onfidence: How sure are we this is the right feature? (1-10)
**E**ffort: How many hours of work? (1-10)

**Score = (R × I × C) / E**

| Feature | R | I | C | E | Score | Priority |
|---------|---|---|---|---|-------|----------|
| Email Alerts | 8 | 10 | 8 | 10 | 63 | **P0** |
| Product Details | 10 | 8 | 9 | 6 | 120 | **P0** |
| Price History | 7 | 8 | 7 | 8 | 49 | **P1** |
| Advanced Sorting | 6 | 5 | 9 | 3 | 90 | **P1** |
| Empty States | 5 | 4 | 9 | 2 | 90 | **P1** |
| Comparison Tool | 6 | 7 | 7 | 6 | 49 | **P2** |
| User Accounts | 6 | 6 | 6 | 6 | 36 | **P2** |
| Search Enhancement | 8 | 6 | 8 | 4 | 96 | **P2** |
| Wizard | 9 | 9 | 6 | 12 | 40 | **P3** |
| Reviews | 8 | 9 | 6 | 16 | 27 | **P3** |

---

## Implementation Order (MVP → Launch)

### Before Launch (Week 1-2)
1. ✅ Finalize all launch infrastructure
2. 🎯 Product Detail Enhancement (6 hrs)
3. 🎯 Empty States (2 hrs)
4. 📊 Set up analytics
5. 🚀 Launch

### Launch Week (Week 3)
1. Monitor metrics
2. Fix critical bugs
3. Start Email Alerts development

### Post-Launch (Week 4-6)
1. Email Alerts System (primary focus)
2. Price History Charts
3. Advanced Sorting
4. Comparison Tool

---

## Decision: What's Actually Required?

### Reality Check

**Can we launch TODAY with current features?**
- ✅ YES - Site is functional, data is fresh, affiliate links work
- ⚠️ Users might leave without converting
- ⚠️ No way to capture returning visitors

**What would make us 10X better?**
- Email alerts (users get value even when not browsing)
- Price history (trust signal)

**What can wait?**
- Wizard (nice but not core)
- Reviews (build community first)
- Mobile app (responsive web works)

### Recommended Approach

**Soft Launch (Tomorrow):**
- Ship as-is
- Get real user feedback
- See what people actually ask for

**Ship These Week 1:**
1. Product detail enhancement (easy win)
2. Email capture modal (capture interest)

**Ship These Week 2-4:**
3. Email alerts system
4. Price history

**Then iterate based on data.**

---

## Key Metrics to Validate

After launch, track these to decide next features:

| Metric | If Low | Action Needed |
|--------|--------|---------------|
| Time on site < 1 min | People leaving fast | Better product details, related products |
| Affiliate CTR < 2% | Not clicking buy | Better CTAs, price history, trust signals |
| Bounce rate > 70% | Wrong traffic or bad UX | Better landing pages, filtering |
| Search usage < 20% | Hard to find products | Better search, autocomplete, categories |
| Email signups < 5% | No reason to return | Email alerts, wishlist, price drops |

---

## Feature Decision Matrix

### Immediate (This Week)
| Feature | Do It? | Why |
|---------|--------|-----|
| Product details | ✅ YES | Easy, high impact |
| Empty states | ✅ YES | Quick polish |
| Analytics | ✅ YES | Must have before launch |

### Next (Week 2-3)
| Feature | Do It? | Why |
|---------|--------|-----|
| Email alerts | ✅ YES | Core value prop, retention |
| Price history | ⚠️ Depends | If easy with existing infra |
| Comparison tool | ❌ NO | Nice to have, not MVP |

### Later (Month 2+)
| Feature | Do It? | Why |
|---------|--------|-----|
| Reviews | ❌ NO | Need users first |
| Wizard | ⚠️ Depends | High effort, validate demand |
| Mobile app | ❌ NO | PWA/responsive is enough |

---

## Conclusion

**MVP = Current State + Product Details + Email Capture**

This is launchable.

**Don't let perfect be the enemy of shipped.**

The goal is to get users, get feedback, iterate.

Ship now, add features based on what users ask for.

---

**Written:** 2026-02-21  
**Decision:** Soft launch this week, prioritize email alerts based on user feedback
