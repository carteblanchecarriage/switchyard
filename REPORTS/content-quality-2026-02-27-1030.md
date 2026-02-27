# Switchyard Content Quality Report
Generated: Friday, February 27, 2026 — 10:30 AM

## Executive Summary

| Metric | Status | Change from 7:30 AM |
|--------|--------|---------------------|
| Total Guides | 4 | No change |
| Avg Guide Length | 1,889 words | +14 words |
| Blog Posts | 2 | No change |
| Products Tracked | 1,432 | +504 new items |
| Critical Issues | 7 | No change |
| Content Gaps | 6 | No change |

---

## 1. Guide Completeness (Word Counts)

### Current Guides
| Guide | Words | Status | Grade |
|-------|-------|--------|-------|
| `/guides/complete/` (Complete Guide) | 2,275 | ✅ Good | B+ |
| `/guides/programming/` (Programming) | 1,819 | ✅ Good | B |
| `/guides/lubing/` (How to Lube) | 1,719 | ✅ Good | B |
| `/guides/switches/` (Switch Buying) | 1,742 | ✅ Good | B |

**Note:** Guide content stable. All meet minimum 1,500 word threshold.

### Blog Posts
| Post | Words | Status |
|------|-------|--------|
| `/blog/index.html` (Blog Home) | 788 | ⚠️ Thin (needs more content) |
| `/blog/what-are-group-buys.html` | 1,887 | ✅ Good |

**Blog Status:** Only 2 posts total. Recommend adding more content.

---

## 2. Product Descriptions Quality - CRITICAL FINDINGS

### Issues Summary
Found **1,432 products** in data.json with significant description quality issues:

**Critical Problems:**
1. **100% of descriptions truncated** - All vendor-scraped descriptions are incomplete
2. **HTML entities not decoded** - `&amp;`, `&gt;`, `&lt;` visible in descriptions
3. **Scraping artifacts** - "THIS KEYCAP DOES NOT INCLUDE THE KEYBOARD" repeated 300+ times
4. **Placeholder text** - "Please drop your email on 'Notify Me When Available'" appears in many

**Sample Issues:**
```json
"description": "THIS KEYCAP SET DOES NOT INCLUDE THE KEYBOARD.\n\n\n This keycap set has all the keycaps..."
"description": "Keychron K2 HE is a 75% layout... Now in a premium concrete body - a masterp" // CUT OFF
"description": "Each Switch Set comes with 35 switches... Please drop your email on \"Notify Me When Available\"..."
```

**Recommendation:** 
- Products need manual SEO descriptions (50-160 chars each)
- Top 100 products should be prioritized
- Current descriptions are unusable for SEO

---

## 3. Placeholder Text & Broken Elements - NO FIXES SINCE LAST CHECK

### Critical Issues (Still Unfixed from 7:30 AM)

1. **guides/switches/index.html**
   ```html
   <button class="theme-toggle">  <!-- Missing attributes -->
       <span id="themeIcon"></span>  <!-- EMPTY -->
   ```

2. **guides/lubing/index.html**
   ```html
   <div class="tool-icon"></div>    <!-- EMPTY - Missing icon -->
   ```

3. **guides/programming/index.html**
   ```html
   <div class="feature-icon"></div> <!-- Empty emoji/icon -->
   ```

4. **ALL GUIDES - Broken JavaScript**
   - Variables `isDark`, `savedTheme`, `prefersDark` used but **never declared**
   - Theme switching **will not work** on any guide page

5. **Dark mode CSS in `<style>` blocks is broken**
   ```css
   :root { /* colors */ }
       --paper: #1a1a1a;  /* This is OUTSIDE :root - INVALID CSS */
   ```

---

## 4. Content Gaps (Unchanged)

### High Priority Missing Guides
| Topic | Search Volume | Priority | Status |
|-------|---------------|----------|--------|
| Gaming Keyboards Guide | High | P0 | Not started |
| Keycap Profile Comparison | Medium-High | P1 | Not started |
| Best 60% Keyboards | Medium | P1 | Not started |
| Best 75% Keyboards | Medium | P1 | Not started |
| Best TKL Keyboards | Medium | P1 | Not started |
| Artisan Keycap Guide | Medium | P2 | Not started |

### Missing Pages (Listed in sitemap but don't exist)
- `/learn/beginners-guide` → 404 expected
- `/learn/layout-sizes` → 404 expected
- `/learn/glossary` → 404 expected
- `/learn/keycap-profiles` → 404 expected
- `/learn/artisan-guide` → 404 expected
- `/learn/best-gaming` → 404 expected
- `/learn/best-60-percent` → 404 expected
- `/learn/best-75-percent` → 404 expected
- `/learn/best-tkl` → 404 expected

---

## 5. Cross-Sale Opportunities Assessment

### Current State (No Changes)
- ✅ Text links to products exist in guides
- ❌ No visual product cards in guides
- ❌ No "Frequently bought together" sections
- ❌ No related guides sidebar
- ❌ No "Complete Your Setup" recommendations

### Blog Post Cross-Linking
- `what-are-group-buys.html` links to homepage - **Good**
- No internal links to switch guide or programming guide - **Gap**
- No CTA to browse current group buys - **Missed opportunity**

---

## 6. New Findings Since 7:30 AM Check

### Data File Analysis
- **data.json**: 7,551 lines, 1,432 products
- **Scraped at**: 2026-02-27T14:25:46.076Z (fresh data)
- **New items**: 504 since last scrape
- **In stock**: 1,813 items (appears inflated - group buys counted?)

### Vendor Distribution (Top 5)
| Vendor | Commission | Products | Active Group Buys |
|--------|------------|----------|-------------------|
| Keychron | 8% | ~500 | 149 |
| Epomaker | 6% | ~300 | 102 |
| Drop | 5% | ~200 | 5 |
| KBDfans | 8% | ~150 | 80 |
| NovelKeys | 10% | ~100 | 45 |

---

## 7. Action Items (Priority Order)

### P0 - Critical (Fix Today)
1. [ ] **Fix ALL guide theme toggles** - JavaScript broken in all 4 guides
   - Add missing `const` declarations for `isDark`, `savedTheme`, `prefersDark`
   - Fix CSS syntax error (dark mode code outside :root)
   
2. [ ] **Fill empty emoji icons** in guides/lubing and guides/programming
3. [ ] **Remove or create missing /learn/* pages** - Currently 404s from sitemap

### P1 - High Priority (This Week)
4. [ ] **Write SEO descriptions for top 50 products** in data.json
5. [ ] **Add cross-links** between existing guides
6. [ ] **Add product cards** to bottom of every guide
7. [ ] **Create gaming keyboard guide** (highest search volume gap)

### P2 - Medium Priority (This Month)
8. [ ] **Create size-specific guides** (60%, 75%, TKL)
9. [ ] **Build keycap profiles guide**
10. [ ] **Add "Related Products" sidebar** to guides
11. [ ] **Create switch sound comparison** page

### P3 - Backlog
12. [ ] **Build interactive switch selector** tool
13. [ ] **Add video embeds** to lubing guide
14. [ ] **Create "build your first"** step-by-step tutorial
15. [ ] **Add community showcase** section

---

## 8. Content Opportunities by Search Intent

### Informational (High Traffic Potential)
- "How to lube switches" - ✅ COVERED
- "What are group buys" - ✅ COVERED
- "Best keyboards for programming" - ✅ COVERED
- "Mechanical switch types" - ✅ COVERED
- "Best gaming keyboards" - ❌ MISSING (high volume)
- "Keyboard size comparison" - ❌ MISSING
- "Keycap profile guide" - ❌ MISSING

### Transactional (Revenue Potential)
- Product pages need better descriptions
- Cross-sale sections in guides
- "Complete the setup" recommendations

---

## Files Modified in This Report
- `REPORTS/content-quality-2026-02-27-1030.md` (this file)

---

Report prepared by: Content Quality Cron
Previous check: 2026-02-27 05:30 AM
Next check scheduled: Hourly (:30)
