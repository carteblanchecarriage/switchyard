# Switchyard Site Production Tasks

**Mission:** Get the site stable, fast, and revenue-generating

---

## P0 - CRITICAL (Fix First)

### Task 1: Data Loading Fix
**Status:** 🟡 In Progress
**Goal:** Products load 100% of the time, never fail

- [ ] Debug why data.json sometimes doesn't load on GitHub Pages
- [ ] Add visible error messages for users
- [ ] Implement data caching/fallback strategy
- [ ] Test with cache disabled in browser
- [ ] Verify 381 products display consistently

**Success:** Load site 10 times, products appear every time

---

### Task 2: Migrate to Cloudflare Pages
**Status:** ⏳ Blocked (waiting on Cloudflare account)
**Goal:** Faster deploys, better caching, no GitHub Pages headaches

- [ ] Create Cloudflare account
- [ ] Set up Cloudflare Pages project
- [ ] Connect GitHub repo
- [ ] Configure build settings (static site)
- [ ] Update DNS/custom domain
- [ ] Test deploy speed (< 30 seconds)
- [ ] Verify cache purging works

**Success:** Site deploys in under 1 minute, cache clears instantly

---

### Task 3: API to Cloudflare Workers (Optional)
**Status:** ⏳ After Task 2
**Goal:** Replace localhost:3003 with edge API

- [ ] Convert API to Worker-compatible format
- [ ] Deploy to Cloudflare Workers
- [ ] Update frontend to use Worker URL
- [ ] Add rate limiting in Workers
- [ ] Test performance

**Success:** API runs on edge, < 50ms response globally

---

## P1 - HIGH PRIORITY (Revenue Impact)

### Task 4: Product Display Improvements
**Goal:** More products, better presentation

- [ ] Expand vendor scraping (add more keyboard vendors)
- [ ] Import artisan keycap data from artisan/index.html
- [ ] Ensure all 400 products load (381 + 19 artisans)
- [ ] Add product images for items missing them
- [ ] Fix broken image URLs

**Success:** 400+ products visible, 95% have images

---

### Task 5: Mobile Responsiveness
**Goal:** Perfect experience on all devices

- [ ] Test wizard on mobile (< 768px width)
- [ ] Fix hamburger menu issues
- [ ] Ensure product cards look good on small screens
- [ ] Test FAB positioning on mobile
- [ ] Verify checkout flow on mobile

**Success:** Passes Google Mobile-Friendly Test

---

### Task 6: Affiliate Integration
**Goal:** Start generating revenue

- [ ] Apply for Glorious affiliate (15%)
- [ ] Apply for Prevail affiliate (10%)
- [ ] Apply for Boardsource affiliate (10%)
- [ ] Apply for Drop affiliate (via Impact)
- [ ] Apply for Keychron affiliate
- [ ] Update all product URLs with affiliate links
- [ ] Add affiliate UTM tracking

**Success:** First affiliate click/conversion tracked

---

### Task 7: Uptime Monitoring
**Goal:** Know immediately if site goes down

- [ ] Create UptimeRobot account (free)
- [ ] Add monitor for carteb…github.io/keebshelf
- [ ] Add monitor for API (when migrated)
- [ ] Configure alerts to Telegram/Email
- [ ] Test alert by temporarily taking site down

**Success:** Get alert within 5 minutes of downtime

---

## P2 - MEDIUM PRIORITY (Growth)

### Task 8: SEO Improvements
**Goal:** Rank higher on Google

- [ ] Add meta descriptions to all pages
- [ ] Create sitemap.xml
- [ ] Add schema.org structured data (Product, Review)
- [ ] Optimize page load speed (< 2s)
- [ ] Add Open Graph tags for social sharing
- [ ] Create robots.txt with proper directives

**Success:** Google Search Console shows no errors

---

### Task 9: Analytics Setup
**Goal:** Understand user behavior

- [ ] Add Google Analytics 4
- [ ] Set up conversion goals (clicks to vendors)
- [ ] Track wizard completion rates
- [ ] Monitor bounce rate
- [ ] Create weekly analytics report

**Success:** Can see which products get most clicks

---

### Task 10: Performance Optimization
**Goal:** Fast site everywhere

- [ ] Compress all images (WebP format)
- [ ] Lazy load images below fold
- [ ] Minify CSS/JS
- [ ] Add resource hints (preconnect, preload)
- [ ] Test with Lighthouse (target: 90+ score)

**Success:** Lighthouse Performance score > 90

---

## P3 - BACKLOG (Nice to Have)

### Task 11: Content Marketing
**Goal:** Drive organic traffic

- [ ] Write "Best Mechanical Keyboards 2025" guide
- [ ] Write "What Are Group Buys?" blog post
- [ ] Create beginner's guide to mechanical keyboards
- [ ] Set up automatic social sharing

---

### Task 12: User Features
**Goal:** Increase engagement

- [ ] Price drop alerts
- [ ] Stock alerts
- [ ] Keyboard comparison tool
- [ ] Wishlist/watchlist
- [ ] User reviews/ratings

---

## Current Sprint Focus

**This Week:**
1. ✅ Task 1: Debug data loading (in progress)
2. ⏳ Task 2: Cloudflare migration (waiting on account)
3. 🔄 Task 6: Apply for affiliates (can do in parallel)

**Next Week:**
4. Task 4: Product expansion
5. Task 5: Mobile fixes
6. Task 7: Uptime monitoring

---

## Quick Wins (30 min each)

- [ ] Add meta description to homepage
- [ ] Fix any console errors
- [ ] Test on iPhone/Android
- [ ] Verify all footer links work
- [ ] Check for broken product images

---

**Last Updated:** 2026-02-22
**Next Review:** Weekly
