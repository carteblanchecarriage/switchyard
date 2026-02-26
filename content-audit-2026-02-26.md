# Switchyard Content Quality Audit
**Date:** February 26, 2026  
**Location:** /home/klondike/Desktop/keyboard-tracker/

---

## 1. GUIDE COMPLETENESS - WORD COUNTS

| File | Word Count | Status | Notes |
|------|-----------|--------|-------|
| glossary/index.html | 2,350 | ✅ GOOD | Comprehensive glossary with good coverage |
| guides/complete/index.html | 2,275 | ✅ GOOD | Decent length, needs more detailed step-by-step |
| blog/what-are-group-buys.html | 1,887 | ✅ GOOD | Well-structured blog post |
| faq/index.html | 1,361 | ⚠️ THIN | 11 FAQ items - could expand to 20+ with sub-questions |
| guides/programming/index.html | 1,819 | ✅ GOOD | Good keyboard picks with details |
| beginner/index.html | 1,148 | ❌ THIN | Needs expansion to 2,500+ words for flagship guide |
| switches/index.html | 1,439 | ⚠️ THIN | Switch guide could be more comprehensive |
| best/index.html | 989 | ❌ THIN | Only 3 product reviews - needs 5+ with full details |
| blog/index.html | 788 | ⚠️ THIN | Blog landing page needs more content |
| gaming/index.html | 1,020 | ⚠️ THIN | Gaming guide could be expanded |

**Average Guide Length:** ~1,500 words (Target: 2,000+ for pillar content)

---

## 2. PLACEHOLDER TEXT FOUND

### Image Placeholders
- **best/index.html:** 3 instances of `[Image Placeholder]` in keyboard cards (RK61, Q3, GMMK Pro)
- **dashboard/index.html:** "No Image" fallback for missing product images

### Broken HTML
- **beginner/index.html:** Theme toggle button and script fragments exist OUTSIDE `<body>` tag (lines 35-45, line 168+)
- **faq/index.html:** JavaScript truncation at end - `<script>` tag is unclosed
- **guides/programming/index.html:** Closing `</h4>` typo on line 207 (`</h4>` appears as `</hal4>`)

### Incomplete Content
- **build/index.html:** Only 246 words - essentially empty shell
- **guides/complete/index.html:** Has structure but limited actual instructional content

---

## 3. CONTENT GAPS IDENTIFIED

### Missing Pillar Guides (High Impact)
1. ❌ **PCB/Kit Selection Guide** - Critical for custom builds
2. ❌ **Stabilizer Guide** - Every build needs this
3. ❌ **Keycap Profile Comparison** (SA, DSA, Cherry, OEM, MT3, XDA)
4. ❌ **Switch Film Guide** - Popular mod, no coverage
5. ❌ **Spring Swapping Guide** - Undocumented
6. ❌ **Case Material Guide** (plastic vs aluminum vs polycarb)

### Missing Modding Content
1. ❌ **Tape Mod Guide** (very popular, easy mod)
2. ❌ **Foam Mod Guide** (case foam, PCB foam)
3. ❌ **O-Ring Mod** for sound dampening
4. ❌ **PE Foam Mod** (trending in community)

### Missing Comparison Content
1. ❌ **Pre-built vs Custom Pros/Cons**
2. ❌ **Wired vs Wireless Comparison**
3. ❌ **South-facing vs North-facing RGB** (important for keycap compatibility)

### Best Of Pages Need Attention
- **best-60-percent/index.html:** (1,467 words) - Needs sound samples, video embeds
- **best-budget/index.html:** (1,436 words) - Could use more specific model comparisons  
- **gaming/index.html:** (1,020 words) - Needs specific gaming switch recommendations (speed silvers, etc.)

---

## 4. CROSS-SALE OPPORTUNITIES

### Existing Strong Links ✅
- Dashboard → All guides, best-of pages, vendor links
- FAQ → Links to beginner guide, switch guide
- Beginner → Links to programming guide, switch guide, lubing guide
- Footer navigation is comprehensive

### Missing Opportunities ❌

#### A. Switch Guide → Product Cross-Sell
- **Current:** No product embeds
- **Opportunity:** Add "Find keyboards with these switches" CTA after each switch section
- **Revenue Impact:** HIGH - users ready to buy after learning

#### B. Lubing Guide → Tool Affiliates  
- **Current:** Lists tools without links/prices
- **Opportunity:** 
  - Affiliate links to Amazon/KBDfans for switch openers, brushes, lube
  - "Starter Tool Kit" bundle recommendation ($35-50)
  - "Premium Setup" vs "Budget Setup" tool breakdowns
- **Revenue Impact:** MEDIUM

#### C. Beginner Guide → Complete Setup
- **Current:** Recommends boards but no accessories
- **Opportunity:**
  - "Complete Your First Setup" section with desk mat, wrist rest, cable
  - "Build Your First Custom" kit recommendations
- **Revenue Impact:** HIGH

#### D. Programming Guide → Desk Setup
- **Current:** Keyboard recommendations only
- **Opportunity:**
  - Wrist rest recommendations for long coding sessions
  - Desk mat recommendations
  - Coiled cable for clean aesthetic
- **Revenue Impact:** MEDIUM

#### E. Best Pages → Switch Upgrades
- **Current:** No switch modification content
- **Opportunity:**
  - "Not happy with stock switches?" section on each review
  - "Upgrade your switches" CTA linking to switch guide
  - "Hot-swap your way to better feel" messaging
- **Revenue Impact:** MEDIUM

---

## 5. SUMMARY & PRIORITY ACTIONS

### 🔴 HIGH PRIORITY (Critical Issues)
1. **Fix broken HTML** in beginner/index.html (theme toggle outside body)
2. **Replace [Image Placeholder]** in best/index.html with real images
3. **Fix** `<script>` tag truncation in faq/index.html
4. **Fix typo** `</hal4>` in guides/programming/index.html line 207
5. **Create PCB/Kit Selection Guide** - Major content gap

### 🟡 MEDIUM PRIORITY (Content Expansion)
1. Expand beginner guide: 1,148 → 2,500+ words
2. Create Keycap Profile Comparison Guide (high search volume)
3. Expand best/index.html with 2 more keyboard reviews
4. Add Stabilizer Guide with tuning walkthrough
5. Add affiliate links to lubing guide tool section

### 🟢 LOW PRIORITY (Nice to Have)
1. Add sound samples to switch guide
2. Create visual layout comparison chart
3. Expand FAQ from 11 → 20 questions
4. Add modding guides (tape, foam, films)

---

## QUICK WINS (Can Implement Today)

1. ✅ Fix the beginner/index.html broken HTML
2. ✅ Add 2 more keyboard reviews to best/index.html (could pull from programming guide)
3. ✅ Add affiliate IDs to existing vendor links
4. ✅ Add "Complete Your Setup" section to beginner guide with desk mat/wrist rest links

## CONTENT CALENDAR SUGGESTION

**Week 1:** Fix broken HTML, expand best/ page to 5 keyboards  
**Week 2:** Write PCB/Kit Selection Guide (~2000 words)  
**Week 3:** Write Keycap Profile Guide (~1500 words)  
**Week 4:** Write Stabilizer Guide with tuning steps (~1500 words)
