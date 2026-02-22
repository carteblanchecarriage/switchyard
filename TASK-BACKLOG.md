# Keebshelf Task Backlog

## How This Works
- Each task is designed to take **5-10 minutes MAX**
- Pick **ONE** task per run — don't try to do more
- Complete it fully, then stage and report
- If it can't be done in 10 min, it's too big — skip it

## 🔥 NEW PRIORITY: Keyboard Finder Wizard (Floating Widget)

**Goal:** Floating widget in corner that filters products in real-time as users make selections
**Read full spec:** `~/Desktop/keyboard-tracker/WIZARD-SPEC.md` ← UPDATED v2.0

### Phase 1: Widget Structure
- [x] **Task 1: Create floating widget HTML** — COMPLETED: Fixed position bottom-right, 64px toggle button, expandable panel, click/hover/escape interactions
- [x] **Task 2: Widget styling** — COMPLETED: FAB design, pulsing glow animation, keyboard SVG icon, dark mode shadows, hover lift effects
- [x] **Task 3: Expand/collapse logic** — COMPLETED: Hover expand (300ms delay), click to pin/unpin, click outside to close, Escape key support, isPinned state management

### Phase 2: Wizard Steps
- [ ] **Task 4: Step 1 (Use Case)** — "What will you use this for?" Gaming/Office/Creative/General
- [ ] **Task 5: Step 2 (Noise)** — "Your workspace?" with switch education
- [ ] **Task 6: Step 3 (Size)** — "Your desk space?" 60%/75%/Full-size
- [ ] **Task 7: Step 4 (Hot-swap)** — "Customize later?" Yes/Maybe/No
- [ ] **Task 8: Step 5 (Budget)** — Price tiers with live count "X keyboards match"

### Phase 3: Real-Time Filtering
- [ ] **Task 9: Filter logic** — Score products 0-100, sort by relevance
- [ ] **Task 10: Grid updates** — Product grid filters instantly as selections made
- [ ] **Task 11: Match count badge** — Show "12 boards match" on toggle button
- [ ] **Task 12: Filter chips** — Show active filters as removable chips
- [ ] **Task 13: Clear/reset** — One-click to remove all filters

### Phase 4: Polish
- [ ] **Task 14: Match badges on cards** — ✓ icons showing why each keyboard matched
- [ ] **Task 15: Empty state** — Friendly "No matches" message with clear option
- [ ] **Task 16: Mobile adaptation** — Bottom sheet instead of floating widget
- [ ] **Task 17: Launch** — Add to all pages, test thoroughly

---

## 🔥 HIGH PRIORITY - User Requests

#### Professional Design Refresh
- [x] **Fix dark mode card backgrounds** — Replaced hardcoded `white` with `var(--paper)`
- [x] **Remove excess emojis** — Replaced casual emojis with clean text across ALL pages
- [x] **Professional header redesign** — Clean navigation, theme toggle text labels
- [x] **Improve dark mode toggle** — Modern sliding toggle with animation

#### Analytics (After Domain)
- [ ] **Set up web analytics** — Plausible Analytics (privacy-focused, 1KB script)
- [ ] **Add tracking** — Page views, popular products, wizard completion rate
- [ ] **Dashboard** — Daily visitors, top products, conversion funnel

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
- [x] Emoji removal (all pages)
- [x] Fix dark mode card backgrounds
- [x] Professional header redesign
- [x] Improve dark mode toggle
- [x] Vendor filter functionality
- [x] Epomaker products added

---

## Report Format

```
## Task Complete: [Task Name]

✅ Done: [What you did]
📁 Files: [list]
⏱️ Duration: ~[X] minutes
📊 Staged/Pushed: [Yes/No]

### Next Task Suggestion:
[Which to do next]
```
