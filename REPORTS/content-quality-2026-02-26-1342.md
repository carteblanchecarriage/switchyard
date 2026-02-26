# Switchyard Content Quality Report
**Date:** February 26, 2026 at 1:42 PM EST  
**Auditor:** Klondike  
**Scope:** /home/klondike/Desktop/keyboard-tracker/

---

## EXECUTIVE SUMMARY

Overall content quality is **GOOD** with targeted improvements needed. Site has strong SEO foundation (9.5/10) and comprehensive guide coverage. Main issues are technical HTML errors and some thin content areas that need expansion.

| Metric | Status | Score |
|--------|--------|-------|
| Guide Completeness | ✅ Good | 7.5/10 |
| Technical Quality | ⚠️ Issues Found | 6/10 |
| Cross-Sell Strategy | ⚠️ Partial | 5/10 |
| Affiliate Coverage | ✅ Excellent | 100% |

---

## 1. GUIDE COMPLETENESS - WORD COUNTS

### Current Guide Status

| Guide | Word Count | Target | Status |
|-------|-----------|--------|--------|
| guides/complete/index.html | 2,275 | 2,500+ | ✅ Near Target |
| guides/switches/index.html | 1,689 | 2,000+ | ⚠️ Slightly Thin |
| guides/programming/index.html | 1,819 | 2,000+ | ✅ Good |
| guides/lubing/index.html | 1,719 | 2,000+ | ⚠️ Slightly Thin |
| beginner/index.html | 1,148 | 2,500+ | ❌ **Needs Expansion** |
| best/index.html | 989 | 2,000+ | ❌ **Needs Expansion** |
| best-60-percent/index.html | 1,467 | 2,000+ | ⚠️ Acceptable |
| best-budget/index.html | 1,436 | 2,000+ | ⚠️ Acceptable |
| best-programming/index.html | 1,344 | 1,500+ | ✅ Good |
| gaming/index.html | 1,020 | 1,500+ | ❌ **Needs Expansion** |

### Analysis

**Strong Content (2,000+ words):**
- Complete Guide (2,275) - Comprehensive beginner resource
- Programming Guide (1,819) - Well-structured with specific picks

**Needs Expansion (Under 1,500 words):**
- **beginner/index.html (1,148 words)** - Flagship guide for new users, should be 2,500+
- **best/index.html (989 words)** - Only 3 keyboard reviews, should have 5-7 minimum
- **gaming/index.html (1,020 words)** - Missing specific gaming switch recommendations

---

## 2. PLACEHOLDER TEXT & BROKEN HTML

### 🔴 CRITICAL: Broken HTML Issues

1. **faq/index.html** - JavaScript tag unclosed
   - File ends with `<script>` without closing `</script>` tag
   - **Impact:** May break page functionality, JavaScript errors
   - **Fix:** Add closing `</script></body></html>`

2. **guides/programming/index.html** - Typo on line 207
   - `</hal4>` should be `</h4>`
   - **Impact:** Renders as broken HTML, display issues
   - **Fix:** Correct typo

3. **guides/lubing/index.html** - Broken theme toggle
   - Theme button outside `<body>` tag
   - **Impact:** Layout issues, possible rendering problems
   - **Fix:** Move button inside `<body>` after skip-link

### 🟡 MEDIUM: Content Placeholders

1. **best/index.html** - 3 instances of `[Image Placeholder]`
   - Lines 127, 149, 171 in keyboard cards
   - Royal Kludge RK61, Keychron Q3, Glorious GMMK Pro
   - **Fix:** Replace with actual product images or high-quality stock photos

---

## 3. PRODUCT DESCRIPTIONS QUALITY

### Database Status
- **Total Products:** 919 tracked
- **Affiliate Coverage:** 100% (919/919)
- **Vendors with Tracking:** Keychron, KBDfans, NovelKeys, Epomaker

### Issues Found

1. **Inconsistent Affiliate Tracking Codes**
   - Keychron: Uses both `ref=keyboardtracker` (correct) and `ref=switchyard` (legacy)
   - KBDfans: Uses `ref=switchyard` (should migrate to `ref=keyboardtracker`)
   - NovelKeys: Uses `ref=switchyard` (should migrate)
   - **Recommendation:** Normalize all to consistent `ref=keyboardtracker`

2. **Product Descriptions in Guides**
   - Most guides reference products but don't link to specific listings
   - Cross-linking between guides and product catalog is weak
   - **Opportunity:** Add "Find keyboards with these switches" CTAs throughout

---

## 4. CONTENT GAPS

### 🔴 HIGH PRIORITY Missing Content

1. **PCB/Kit Selection Guide** - Critical for custom builds (~2,000 words)
2. **Stabilizer Guide** - Every build needs this (~1,500 words)
3. **Keycap Profile Comparison** (SA, DSA, Cherry, OEM, MT3, XDA) (~1,500 words)
   - High search volume topic
   - Currently mentioned in guides/complete but not dedicated

### 🟡 MEDIUM PRIORITY Missing Content

4. **Switch Film Guide** - Popular mod, no coverage (~800 words)
5. **Spring Swapping Guide** - Undocumented (~800 words)
6. **Case Material Guide** (plastic vs aluminum vs polycarb) (~1,000 words)
7. **Tape Mod Guide** - Very popular, easy mod (~600 words)
8. **Foam Mod Guide** (case foam, PCB foam) (~800 words)

### 🟢 NICE TO HAVE

9. **O-Ring Mod** for sound dampening
10. **PE Foam Mod** (trending in community)
11. **Pre-built vs Custom Pros/Cons** comparison
12. **South-facing vs North-facing RGB** guide (important for keycap compatibility)

---

## 5. CROSS-SALE OPPORTUNITIES

### Current Strengths ✅
- Dashboard → All guides, best-of pages, vendor links ✓
- FAQ → Links to beginner guide, switch guide ✓
- Beginner → Links to programming guide, switch guide, lubing guide ✓
- Footer navigation comprehensive ✓
- Wizard widget on most pages ✓

### Missing Opportunities ❌

| Location | Current | Opportunity | Revenue Impact |
|----------|---------|-------------|----------------|
| **Switch Guide** | No product embeds | Add "Find keyboards with these switches" CTA after each switch section | HIGH |
| **Lubing Guide** | Lists tools without links | Add Amazon/KBDfans affiliate links for switch openers, brushes, lube; "Starter Tool Kit" bundle ($35-50) | MEDIUM |
| **Beginner Guide** | Recommends boards but no accessories | "Complete Your First Setup" section with desk mat, wrist rest, cable | HIGH |
| **Programming Guide** | Keyboard recommendations only | Wrist rest for coding, desk mat recommendations, coiled cable | MEDIUM |
| **Best Pages** | No switch modification content | "Not happy with stock switches?" upgrade section linking to switch guide | MEDIUM |

### Specific Recommendations

1. **Add to guides/switches/index.html:**
   - After each switch type section, add: "Browse keyboards with [Switch Type] →"
   - Link to filtered dashboard view

2. **Add to guides/lubing/index.html:**
   - Tool section should link to:
     - Amazon (switch opener $10-15)
     - KBDfans (Krytox 205g0 $12)
     - NovelKeys (brush set $8)
   - "Complete Lubing Kit" bundle recommendation

3. **Add to beginner/index.html:**
   - "Complete Your Setup" section:
     - Desk mat: $15-30 (Glorious, AUKEY)
     - Wrist rest: $20-40 (Glorious, 3D printed options)
     - Coiled cable: $25-50 (custom cable makers)

---

## 6. QUICK WINS (Can Implement Today)

### Technical Fixes (15 minutes each)
1. ✅ Fix `<script>` tag truncation in faq/index.html
2. ✅ Fix `</hal4>` typo in guides/programming/index.html
3. ✅ Fix theme toggle placement in guides/lubing/index.html
4. ✅ Replace `[Image Placeholder]` in best/index.html with real images or remove placeholders

### Content Expansion (1-2 hours each)
5. ✅ Add 2 more keyboard reviews to best/index.html (pull from programming guide picks)
6. ✅ Add "Complete Your Setup" section to beginner guide
7. ✅ Add "Find keyboards with these switches" CTAs to switch guide

---

## 7. CONTENT CALENDAR SUGGESTION

**Week 1:** Fix all HTML errors, expand best/ page to 5 keyboards, add tool affiliate links to lubing guide

**Week 2:** Write PCB/Kit Selection Guide (~2,000 words) - addresses critical content gap

**Week 3:** Write Keycap Profile Guide (~1,500 words) - high search volume topic

**Week 4:** Write Stabilizer Guide with tuning steps (~1,500 words)

---

## 8. PRIORITY MATRIX

| Priority | Task | Effort | Impact |
|----------|------|--------|--------|
| 🔴 **CRITICAL** | Fix unclosed script tag in faq/index.html | 5 min | HIGH |
| 🔴 **CRITICAL** | Fix theme toggle in lubing/index.html | 10 min | HIGH |
| 🔴 **CRITICAL** | Fix typo in programming/index.html | 2 min | MEDIUM |
| 🟡 **HIGH** | Expand beginner guide to 2,500+ words | 4 hours | HIGH |
| 🟡 **HIGH** | Add 2 more reviews to best/index.html | 2 hours | HIGH |
| 🟡 **HIGH** | Replace image placeholders in best/index.html | 30 min | MEDIUM |
| 🟡 **HIGH** | Create PCB/Kit Selection Guide | 6 hours | HIGH |
| 🟢 **MEDIUM** | Create Keycap Profile Comparison Guide | 4 hours | MEDIUM |
| 🟢 **MEDIUM** | Add affiliate links to lubing guide tools | 1 hour | MEDIUM |
| 🟢 **MEDIUM** | Create Stabilizer Guide | 4 hours | MEDIUM |

---

## SUMMARY

Switchyard has solid content coverage with good guide variety. The main issues are:

1. **Technical debt:** 3 HTML errors need immediate fixing
2. **Content depth:** 2-3 guides need expansion (beginner, best, gaming)
3. **Monetization gaps:** Cross-sell opportunities not fully exploited
4. **Missing pillars:** PCB guide and keycap profile guide would fill critical gaps

**Estimated effort to address all issues:** ~20-25 hours of focused work  
**Estimated impact:** Improved SEO rankings, better user engagement, increased affiliate revenue

---

*Report generated by Klondike | Switchyard Content Quality Cron*  
*Next audit scheduled: February 26, 2026 at 2:30 PM*
