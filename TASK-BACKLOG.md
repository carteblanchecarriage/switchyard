# Keebshelf Task Backlog

## How This Works
- Each task is designed to take **5-10 minutes MAX**
- Pick **ONE** task per run — don't try to do more
- Complete it fully, then stage and report
- If it can't be done in 10 min, it's too big — skip it

## Current Sprint: Content & Growth

### 🔥 HIGH PRIORITY - User Requests (Do First)

#### Professional Design Refresh
- [x] **Fix dark mode card backgrounds** — Replaced hardcoded `white` with `var(--paper)` so cards respect dark theme
- [x] **Remove excess emojis** — Replaced casual emojis with minimal icons or clean text across ALL pages
- [ ] **Professional header redesign** — Cleaner nav, better typography, no emojis  
- [ ] **Consistent color palette audit** — Ensure all pages use same brand colors (#1a1a1a, #FAF9F7, #C9A227) (index.html, blog.html, guides/, beginner/)
- [ ] **Professional header redesign** — Cleaner nav, better spacing, refined typography, remove emoji decorations
- [ ] **Consistent color palette audit** — Ensure all pages use same brand colors (#1a1a1a, #FAF9F7, #C9A227)

#### Mobile Compatibility Sprint  
- [ ] **Mobile viewport audit** — Check all pages on mobile widths (320px, 375px, 414px)
- [ ] **Fix header on mobile** — Collapse nav to hamburger menu below 768px
- [ ] **Touch-friendly buttons** — Ensure all interactive elements are 44px+ touch targets
- [ ] **Mobile filter bar** — Redesign vendor filters to stack vertically on small screens

#### Product Retention Features (Keep Users On Site)
- [ ] **Quick View Modal** — Click card → modal opens with full product details (image, description, specs, price) without leaving site
- [ ] **Back button detection** — Use `document.referrer` to show "← Back to Keebshelf" banner on external sites
- [ ] **Exit intent modal** — When user clicks external link, show "Compare other options first" modal with related products

#### Header & Styling
- [ ] **Minimal navigation** — Text-based nav instead of emoji icons (Home, Keyboards, Guides, Blog)
- [ ] **Refined hero section** — Professional subhead, less busy layout
- [ ] **Consistent footer** — Same footer across all pages with clean links (no emojis)

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
- [ ] **Write Newsletter CTA** — Add email signup section (use localStorage to store emails for now)
- [ ] **Create "Compare" Feature UI** — Add checkbox to cards for comparison (UI only, functionality later)

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
- [ ] **Create Category Pills** — Show "Keyboards", "Switches", "Keycaps" filter pills

#### Small UI Polish
- [ ] **Fix Mobile Filter** — Make filter chips wrap better on mobile
- [ ] **Add Loading Spinner** — Replace "Loading..." text with animated spinner
- [ ] **Improve Empty State** — Better "No results" message with suggestions
- [ ] **Add Keyboard Shortcut** — Press "/" to focus search input
- [ ] **Smooth Scroll Navbar** — Add smooth scroll when clicking nav links

---

### 📝 MEDIUM PRIORITY (Next Sprint)

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

---

## Quick Task Examples

### Good Task (5 min):
> "Add a 'NEW' badge to product cards for items added in the last 7 days. Add CSS class `.badge-new` and check `item.dateAdded` field."

### Bad Task (too big):
> "Create a complete wishlist system with localStorage, UI, and persistence." ❌

### Good Task (5 min):  
> "Add keyboard shortcut: Press '/' to focus search input. Add event listener and call `searchInput.focus()`"

### Bad Task (too big):
> "Build a complete comparison feature with data storage, UI, and sharing." ❌

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
