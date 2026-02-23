# Keebshelf Keyboard Finder Wizard - Specification v2.0

## User Story
Help visitors find their perfect mechanical keyboard through an unobtrusive floating widget that filters the product grid in real-time.

## Why This Matters
- **Reduces choice paralysis** — Users don't know what they want
- **Educates beginners** — Explains switches, layouts, features inline
- **Increases conversions** — Real-time filtering shows relevant keyboards instantly
- **Stays out of the way** — Floating widget doesn't block content
- **No context switching** — Filter while browsing, no modals or page changes

---

## UI Design: Floating Widget

### Widget States

#### 1. Collapsed State (Default)
```
┌─────────────────┐
│  Find My Board   │  ← Fixed to bottom-right corner
│      ⌨️         │     64px circle button
└─────────────────┘
```
- Floating action button in bottom-right
- Subtle shadow, accent color border
- Hover: Lift + shadow grow
- Click/Hover: Expands to wizard panel

#### 2. Expanded State (Hover/Click)
```
┌──────────────────────────┐
│  Find My Perfect Board   │  ← Header, draggable?
│  Step 2 of 5            │     Progress dots
├──────────────────────────┤
│  What's your workspace? │  ← Question
│  Quiet/Medium/Loud      │     Subtitle
├──────────────────────────┤
│  [Shared]  [Home]       │  ← Option cards
│  [Private] [Unsure]     │     2x2 grid
├──────────────────────────┤
│  [← Back]        [Skip] │  ← Navigation
└──────────────────────────┘
     ↑ Overlays grid below
```
- **Position:** Bottom-right, max 400px width
- **Height:** Auto (expands with content), max 600px
- **Z-index:** Above cards but below modals (999)
- **Behavior:** 
  - Hover: Expand after 300ms delay
  - Click: Keep expanded
  - Click outside: Collapse
  - Escape key: Collapse

#### 3. Filter Applied State
```
┌──────────────────────────┐
│  Find My Board  ✓        │  ← Shows active filters count
│  12 boards match         │     Live count updates
├──────────────────────────┤
│  Active: Gaming, Quiet   │  ← Chip list of filters
│  [Clear All]             │
└──────────────────────────┘
```
- Shows number of matching products
- Lists active filters as removable chips
- One-click to clear all
- Click to re-open wizard

---

## Wizard Flow (5 Steps) - Real-Time Filtering

### How It Works
**As user makes selections, product grid filters immediately below.**

### Step 1: Primary Use
**Question:** "What will you use this for?"
**Real-time effect:** Filter by keyboard features
- Gaming → RGB, fast switches
- Office → Ergonomic, quiet
- Creative → Macro keys, media controls

### Step 2: Noise Level
**Question:** "Your workspace?"
**Real-time effect:** Filter by switch type
- Shared/Office → Linear, silent switches
- Home → Tactile OK
- Private → Clicky allowed

### Step 3: Size
**Question:** "Your desk space?"
**Real-time effect:** Filter by layout
- Compact → 60-65%
- Balanced → 75-80%
- Full → 100%

### Step 4: Hot-swap
**Question:** "Customize later?"
**Real-time effect:** Filter by PCB type
- Yes → Hot-swap PCBs only
- No → All PCBs

### Step 5: Budget
**Question:** "Your budget?"
**Real-time effect:** Filter by price
- Slider or tier buttons
- Real-time count: "23 keyboards match"

---

## Product Grid Behavior

### No Wizard Selections
- Show all 382 products
- Pagination or infinite scroll
- Normal filtering (vendor, category)

### Wizard Active
- Grid filters to matching products
- Sort by: relevance score (how well it matches)
- Show "X keyboards match your needs"
- Each card shows match badges:
  - ✓ Your use case
  - ✓ Right size
  - ✓ In budget
  - ✓ Hot-swap ready

### Empty State
```
┌──────────────────────────────┐
│  😕 No keyboards match     │
│  Try removing some filters? │
│  [Clear Filters]            │
└──────────────────────────────┘
```

---

## Scoring Algorithm

Each keyboard gets a relevance score (0-100):

```javascript
function calculateScore(keyboard, wizardChoices) {
  let score = 0;
  
  // Use case match: +30 points
  if (matchesUseCase(keyboard, wizardChoices.useCase)) score += 30;
  
  // Switch type match: +25 points
  if (matchesSwitchType(keyboard, wizardChoices.noise)) score += 25;
  
  // Size match: +20 points
  if (matchesSize(keyboard, wizardChoices.size)) score += 20;
  
  // Hot-swap match: +15 points
  if (matchesHotSwap(keyboard, wizardChoices.hotSwap)) score += 15;
  
  // Budget match: +10 points
  if (matchesBudget(keyboard, wizardChoices.budget)) score += 10;
  
  return score;
}
```

Sort by: score desc → price asc → name

---

## Technical Implementation

### HTML Structure
```html
<!-- Floating Widget -->
<div id="keyboard-wizard" class="wizard-widget collapsed">
  <div class="wizard-toggle">
    <span class="wizard-icon">⌨️</span>
    <span class="wizard-label">Find My Board</span>
    <span class="match-count" style="display:none;">12</span>
  </div>
  
  <div class="wizard-panel">
    <!-- Steps render here -->
  </div>
</div>

<!-- Product Grid -->
<div id="product-grid">
  <!-- Cards filtered by wizard state -->
</div>
```

### JavaScript Logic
```javascript
const wizardState = {
  step: 1,
  expanded: false,
  filters: {
    useCase: null,
    noise: null,
    size: null,
    hotSwap: null,
    budget: null
  }
};

// Apply filters in real-time
function applyWizardFilters() {
  const filtered = allProducts.filter(p => {
    return matchesFilters(p, wizardState.filters);
  });
  
  // Sort by relevance score
  filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  renderGrid(filtered);
  updateMatchCount(filtered.length);
}

// Update on each selection
function selectOption(step, value) {
  wizardState.filters[step] = value;
  applyWizardFilters();
  
  if (step < 5) {
    showStep(step + 1);
  } else {
    showResults();
  }
}
```

### CSS (Key Parts)
```css
.wizard-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.wizard-widget.collapsed .wizard-toggle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  /* Floating action button style */
}

.wizard-widget:not(.collapsed) {
  width: 380px;
  max-height: 600px;
}

.wizard-panel {
  background: var(--paper);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
}

/* Don't block content when collapsed */
.wizard-widget.collapsed {
  pointer-events: auto;
}

/* Smooth expand */
.wizard-panel {
  transform: scale(0.95);
  opacity: 0;
  transition: all 0.2s;
}

.wizard-widget:not(.collapsed) .wizard-panel {
  transform: scale(1);
  opacity: 1;
}
```

---

## Small Tasks for Sub-Agent

### Phase 1: Widget Structure
- [ ] **Task 1: Create floating widget HTML** — Fixed position, toggle button, expand/collapse behavior
- [ ] **Task 2: Add widget styling** — FAB design, shadow, hover lift, dark mode support
- [ ] **Task 3: Expand/collapse logic** — Hover delay, click to pin, click outside to close

### Phase 2: Wizard Steps
- [ ] **Task 4: Step 1 (Use Case)** — Gaming/Office/Creative/General options
- [ ] **Task 5: Step 2 (Noise)** — Workspace environment, switch education
- [ ] **Task 6: Step 3 (Size)** — 60%/75%/Full-size options
- [ ] **Task 7: Step 4 (Hot-swap)** — Yes/Maybe/No
- [ ] **Task 8: Step 5 (Budget)** — Price tiers

### Phase 3: Filtering
- [ ] **Task 9: Real-time filter logic** — Score products, sort by relevance
- [ ] **Task 10: Match count badge** — Show "X boards match"
- [ ] **Task 11: Active filters UI** — Chips showing current filters
- [ ] **Task 12: Clear/reset** — One-click to remove all filters

### Phase 4: Polish
- [ ] **Task 13: Match badges on cards** — ✓ icons showing why it matched
- [ ] **Task 14: Empty state** — Friendly message when no matches
- [ ] **Task 15: Mobile adaptation** — Bottom sheet on small screens
- [ ] **Task 16: Launch** — Remove "beta" flag, add to all pages

---

## Success Metrics

- **Adoption:** 60% of users interact with widget
- **Completion:** 40% finish all 5 steps
- **Filtering:** Average 3-4 filters applied per completion
- **Conversion:** 50% higher click-through when wizard used
- **Engagement:** 2x longer session time

---

*Wizard Spec v2.0 — Floating Widget with Real-Time Filtering*
