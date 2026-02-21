# Keebshelf Task Backlog

## How This Works
- Each task is designed to take **5-10 minutes MAX**
- Pick **ONE** task per run — don't try to do more
- Complete it fully, then stage and report
- If it can't be done in 10 min, it's too big — skip it

## 🔥 NEW PRIORITY: Keyboard Finder Wizard

**Goal:** Build a guided wizard to help users find their perfect keyboard
**Read full spec:** `~/Desktop/keyboard-tracker/WIZARD-SPEC.md`

### Wizard Tasks (Do These First)

- [x] **Task 1: Create wizard HTML container** — Added modal/section to index.html with step containers, nav buttons, progress indicator
- [x] **Task 2: Add wizard styling** — Large option cards with hover effects, selected states (✓ badge, gradient), fade-in animations, responsive grid
- [x] **Task 3: Step 1 - Use Case** — COMPLETED: "What will you use this keyboard for?" with Gaming/Office/Creative/General options, icon placeholders, auto-advance after 400ms
- [x] **Task 4: Step 2 - Noise Level** — COMPLETED: "What's your workspace?" with switch education (Linear reds for quiet, Tactile browns for medium, Clicky blues for loud)
- [x] **Task 5: Step 3 - Size** — COMPLETED: "What's your desk space?" with 60%/75%/Full-size options and size indicators [60%], [75%], [100%], [?]
- [x] **Task 6: Step 4 - Hot-swap** — COMPLETED: "Want to customize switches later?" with educational explanations (hot-swap = no soldering)
- [ ] **Task 7: Step 5 - Budget** — "What's your budget?" Under $100/$100-200/$200-300/$300+ segments
- [ ] **Task 8: Results algorithm** — Score keyboards 0-100 based on wizard answers, show top 5-8 matches
- [ ] **Task 9: Results UI** — Display matches with "✓ Why this fits" badges, learn more links
- [ ] **Task 10: Launch trigger** — Add "Find My Keyboard" CTA button to hero section

### Analytics & Tracking Tasks (NEW)
- [ ] **Set up web analytics** — Research and implement free analytics tool (Plausible, Google Analytics 4, Cloudflare Analytics, or privacy-focused alternative)
- [ ] **Add basic tracking** — Page views, popular products, wizard completion rate, click-through rates
- [ ] **Set up dashboard** — Simple view of: daily visitors, top products, conversion funnel, which vendors get most clicks
- [ ] **Track wizard performance** — How many start vs complete, drop-off points, most common paths

---

## Current Sprint: Content & Growth

### 🔥 HIGH PRIORITY - User Requests

#### Professional Design Refresh
- [x] **Fix dark mode card backgrounds** — Replaced hardcoded `white` with `var(--paper)` so cards respect dark theme
- [x] **Remove excess emojis** — Replaced casual emojis with minimal icons or clean text across ALL pages
- [x] **Professional header redesign - Remove theme toggle emojis** — Theme toggle now shows clean "Dark"/"Light" text labels only
- [x] **Improve dark mode toggle** — Created modern sliding toggle with cubic-bezier animation, accent colors, and accessibility
- [x] **Professional header redesign - Clean navigation** — Added text-based nav with Home, Keyboards, Guides, Blog links with hover states and active indicators
- [ ] **Consistent color palette audit** — Ensure all pages use same brand colors (#1a1a1a, #FAF9F7, #C9A227) (index.html, blog.html, guides/, beginner/)

#### Mobile Compatibility Sprint  
- [ ] **Mobile viewport audit** — Check all pages on mobile widths (320px, 375px, 414px)
- [ ] **Fix header on mobile** — Collapse nav to hamburger menu below 768px
- [ ] **Touch-friendly buttons** — Ensure all interactive elements are 44px+ touch targets
- [ ] **Mobile filter bar** — Redesign vendor filters to stack vertically on small screens

#### Product Retention Features (Keep Users On Site)
- [ ] **Quick View Modal** — Click card → modal opens with full product details (image, description, specs, price) without leaving site
- [ ] **Back button detection** — Use `document.referrer` to show "← Back to Keebshelf" banner on external sites
- [ ] **Exit intent modal** — When user clicks external link, show "Compare other options first" modal with related products

### 🔥 HIGH PRIORITY (Original Sprint)

#### Data Source Tasks
- [x] **Add Epomaker to scraper** — Add https://epomaker.com as scrapeable source  
- [x] **Add Epomaker products** — Added TH66 Pro, RT100, SK61, Galaxy80
- [x] **Update vendor filters** — Add Epomaker checkbox to filter bar
- [x] **Fix item counts** — Updated 276→12, chip counts to match actual data

#### Content Tasks
- [ ] **Create FAQ Section** — Add 5 Q&As to homepage (What is a mechanical keyboard? Why custom? Switches explained? Etc.)
- [ ] **Write "Best Keyboards 2025" Section** — Add to homepage: "Top 5 Mechanical Keyboards This Year" with quick picks
- [ ] **Add "Buying Guide" Card** — Create visual card linking to guides section

#### SEO Tasks  
- [ ] **Optimize Homepage Title** — Change to "Best Mechanical Keyboards 2025 | Compare Prices | Keebshelf"
- [ ] **Add Meta Description to Guides** — Update each guide page with 150-char SEO description
- [ ] **Add Structured Data** — Add JSON-LD Product schema to one item as test
- [ ] **Create Robots.txt** — Add sitemap reference and crawl rules
- [ ] **Add Canonical URLs** — Ensure all pages have canonical tags

#### Feature Tasks
- [ ] **Add "New" Badge** — Show "NEW" badge on products added in last 7 days
- [ ] **Add Price Range Filter** — Add min/max price inputs to filter bar
- [ ] **Create "Recently Viewed"** — Store last 6 viewed items in localStorage, show in sidebar
- [ ] **Add "Share" Button** — Add share button to product cards (copy link)

#### Small UI Polish
- [x] **Fix Mobile Filter** — Make filter chips wrap better on mobile
- [x] **Add Loading Spinner** — Replace "Loading..." text with animated spinner
- [ ] **Improve Empty State** — Better "No results" message with suggestions
- [x] **Add Keyboard Shortcut** — Press "/" to focus search input
- [ ] **Smooth Scroll Navbar** — Add smooth scroll when clicking nav links

---

### 📝 MEDIUM PRIORITY (Next Sprint)

- [ ] **Add Miscellaneous category** — Include gaskets, hardware packs, lubricants, tools, desk mats, and other accessories that don't fit keyboards/switches/keycaps
- [ ] **Update scraper for misc items** — Scrape vendors for gaskets, lube, hardware from KBDfans, NovelKeys, etc.
- [ ] **Add filter chips** — "Misc" or "Accessories" category alongside Keyboards/Switches/Keycaps
- [ ] Add "Sort by Price" dropdown
- [ ] Create "Sale" badge for discounted items  
- [ ] Add product ratings (fake data for now)
- [ ] Create comparison table component
- [ ] Add "Expert Pick" badge to recommended items
- [ ] Write blog post: "Linear vs Tactile vs Clicky Guide"
- [ ] Add "What's New" changelog section
- [ ] Create email signup modal
- [ ] Add "Quick View" modal for products
- [ ] Create "Similar Items" section

---

### 🎨 DESIGN QUEUE

- [ ] Create mobile hamburger menu
- [ ] Add micro-interaction to heart/favorite button
- [ ] Create toast notifications for actions
- [ ] Add animated number counters (280+ products, etc.)
- [ ] Create floating action button (mobile)
- [ ] Add scroll progress bar at top
- [ ] Create dark mode toggle animation
- [ ] Add page transition animations

---

## Completed ✅

- [x] Lazy loading for images
- [x] Back-to-top button
- [x] Card hover animations
- [x] Staggered fade-in entrance
- [x] Search input enhancements
- [x] Skeleton loading states
- [x] Favicon & OG images
- [x] Dark mode toggle
- [x] Accessibility improvements
- [x] 3 new guide pages
- [x] Remove excess emojis from all pages
- [x] Fix dark mode card backgrounds
- [x] Professional header redesign
- [x] Improve dark mode toggle

---

## Report Format

```
## Task Complete: [Task Name]

✅ What I did: [1-2 sentences]
📁 Files: [list]
📊 Status: [Staged/Pushed]
⏱️ Time: ~[X] minutes

### Next Task Suggestion:
[Which to do next]
```
