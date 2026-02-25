# Switchyard Content Quality Report
**Date:** February 25, 2026 — 6:30 AM  
**Reporter:** Switchyard Cron - Content Quality Check

---

## Executive Summary

**Status:** ✅ GOOD - Guides are well-developed, though some gaps remain in product data and cross-linking.

- **12 active guides** across learn/ directory
- **Product catalog:** 20 items (concerning - should be monitoring 276 from launch copy)
- **Content quality:** Generally high for guides, mixed for products

---

## 1. Guide Completeness Analysis

### Word Count Summary

| Guide | Words | Rating | Notes |
|-------|-------|--------|-------|
| ArtisanGuide.tsx | ~1,207 | ✅ Excellent | Most complete, multiple sections |
| KeycapProfilesGuide.tsx | ~1,013 | ✅ Excellent | Comprehensive tables |
| BestBudgetGuide.tsx | ~820 | ✅ Good | Detailed recommendations |
| GroupBuysGuide.tsx | ~810 | ✅ Good | Rich with timelines/tables |
| BestTKLGuide.tsx | ~797 | ⚠️ Mixed | Uses old Helmet pattern, different format |
| Best60PercentGuide.tsx | ~773 | ✅ Good | Good picks, visual layout |
| BestProgrammingGuide.tsx | ~665 | ✅ Good | Targeted content |
| LayoutSizesGuide.tsx | ~681 | ✅ Good | Comparison tables |
| FAQ.tsx | ~706 | ✅ Good | Covers common questions |
| BestGamingGuide.tsx | ~620 | ✅ Good | Strong picks, specs focus |
| Best75PercentGuide.tsx | ~629 | ✅ Good | Solid overview |
| BeginnersGuide.tsx | ~469 | ⚠️ Needs Work | Too short for entry point |
| SwitchGuide.tsx | ~330 | ❌ Incomplete | Critical gap - needs expansion |

**Findings:**
- ✅ **7 guides** meet quality threshold (600+ words)
- ⚠️ **3 guides** need expansion (Beginners, TKL format inconsistency)
- ❌ **1 guide** requires major rewrite (SwitchGuide)

---

## 2. Product Description Quality

### Current Dataset Analysis (data.json)

**Total Products Tracked:** 20

| Metric | Count | % |
|--------|-------|---|
| **Empty descriptions** | 4 | 20% |
| **Short (1-50 chars)** | 0 | 0% |
| **Short-Medium (50-150)** | 5 | 25% |
| **Medium (150-300 chars)** | 11 | 55% |
| **Long (300+ chars)** | 0 | 0% |

### Products With Empty Descriptions (CRITICAL)

1. **EPOMAKER Galaxy100 Lite + Sorane Silent Switch Set Bundle** - `$107.93`
2. **EPOMAKER TH108 PRO + Glintrix Keycap Bundle** - `$105.40`
3. **Epomaker Galaxy100 QMA/VIA + Nude Rosa Silent Switch Set Bundle** - `$106.23`
4. **EPOMAKER X AULA F75 (LEOBOG Reaper Switch) + Epomaker Zebra Switch Set Bundle** - `$84.98`

**Note:** All are **bundles** - scraper may be failing to extract bundle descriptions.

### Description Truncation Examples

| Product | Current Description | Length | Issue |
|---------|---------------------|--------|-------|
| EPOMAKER Custom Switch Odyssey Deskmat | "Exceptional Materiality Fabricated with a harmonious blend..." | ~157 | Cut off mid-sentence |
| EPOMAKER RT82 | "Detachable LCD Screen Experience the revolutionary PC peripheral..." | ~161 | Cut off mid-sentence |
| Epomaker Lusterfly Jelly Keycaps | "Translucent Jelly-Like Appearance for Stunning Backlit Effects..." | ~170 | Cut off mid-sentence |

**Pattern:** Product descriptions >160 characters are being truncated.

### Missing Product Data Fields

The following structured fields are NOT present in current data:
- ❌ Layout size (60%, 65%, 75%, TKL)
- ❌ Switch type (Gateron, Cherry, proprietary)
- ❌ Hot-swap capability (yes/no)
- ❌ Connectivity (wired/wireless/Bluetooth)
- ❌ Case material (plastic/aluminum)
- ❌ Weight

---

## 3. Content Gaps

### Critical Gaps

1. **SwitchGuide.tsx** (~330 words)
   - Only covers 3 Cherry MX switches
   - Missing: Gateron, Kailh, Akko, Epomaker switches
   - Missing: Actuation force explanation
   - Missing: Sound profiles
   - Missing: Gaming vs typing recommendations
   - **Recommendation:** Expand to 800+ words with comparison tables

2. **BeginnersGuide.tsx** (~469 words)
   - Entry point for new users
   - Missing: "first purchase" recommendations
   - Missing: Step-by-step buying guide
   - **Recommendation:** Expand to 700+ words

3. **Product Catalog Size Discrepancy**
   - Currently tracking: **20 products**
   - Claimed in launch: **276+ products**
   - **Likely cause:** Scraper not running or data.json subset

### Moderate Gaps

4. **Cross-Guide Linking**
   - Guides reference each other manually (good)
   - No automated "Related Guides" section
   - Missing: "Complete your build" bundles

5. **Missing Guide Topics**
   - Switch lubing guide (referenced in QUICK-WINS)
   - Keyboard building guide
   - Switch modding guide
   - Troubleshooting guide

---

## 4. Cross-Sale Opportunities

### Current State

Guides include product links at:
- ✅ Top picks/recommendations (all guides)
- ✅ CTA sections at end
- ✅ Comparison tables

### Missing Opportunities

| Opportunity | Impact | Implementation |
|-------------|--------|----------------|
| "Complete Your Build" bundles | HIGH | Suggest keyboard + switches + keycaps |
| Related products in guides | MEDIUM | Link switches from SwitchGuide to products |
| "Often Bought Together" | HIGH | Cart-style suggestions |
| Guide-to-guide navigation | MEDIUM | "Next: Switch Guide →" links |
| Price alerts per category | MEDIUM | "Alert me when 75% keyboards drop" |

### Specific Recommendations

**Add to BeginnersGuide.tsx:**
- "Complete starter bundles" section
- Budget: RK61 + Gateron Yellows + PBT keycap set
- Mid: Keychron K8 + Brown switches
- Premium: Keychron Q1 Pro + custom switches

**Add to SwitchGuide.tsx:**
- "Buy switches" section with in-stock products
- Link to data.json products filtered by switch category

**Add to all Guides:**
- "Related Products" widget (3-4 items)
- "Complete your setup" section (bundle suggestions)

---

## 5. Recommendations by Priority

### 🔴 Critical (Do This Week)

1. **Fix SwitchGuide.tsx** - Expand to comprehensive 800+ word guide
2. **Investigate data.json** - Why only 20 products? Scraper issue?
3. **Fix empty descriptions** - 4 products with no descriptions
4. **Truncate fix** - Scraper cutting descriptions mid-sentence

### 🟡 High (Do This Month)

5. **Expand BeginnersGuide.tsx** - Add first purchase recommendations
6. **Add structured product fields** - Layout, switch type, hot-swap, connectivity
7. **Implement cross-sale sections** - "Complete your build" widgets
8. **Review BestTKLGuide.tsx** - Convert to consistent format

### 🟢 Medium (Do Next Month)

9. **Create missing guides:**
   - Switch lubing guide
   - Build guide for first-time buyers
   - Troubleshooting common issues
10. **Add price history to products** - Show "lowest in 30 days"
11. **Bundle recommendations engine** - Dynamic suggestions

---

## 6. Quick Wins Available Now

### Can Implement Immediately:

1. **Add product description fallbacks**
   - If description empty, use category + vendor + price template

2. **Manual description fixes**
   - Write descriptions for 4 empty bundle products

3. **Expand BeginnersGuide.tsx intro**
   - Add 200 words on "What to buy first"

4. **Add Related Guides footer**
   - Static links between related guides

---

## 7. Content Quality Score

| Category | Score | Notes |
|----------|-------|-------|
| Guide Completeness | 7/10 | Most are good, SwitchGuide is weak |
| Product Data Quality | 5/10 | Only 20 products tracked, truncation issues |
| SEO Optimization | 8/10 | Good meta, titles, keywords |
| Cross-Linking | 4/10 | Manual only, no automated suggestions |
| Visual Content | 6/10 | No images in guides yet (placeholders noted in QUICK-WINS) |
| **Overall** | **6/10** | Solid foundation, needs product data fixes |

---

## 8. Next Actions

**For Product Team:**
- [ ] Debug scraper - why 20 products vs 276?
- [ ] Fix description truncation (160+ char cutoff)
- [ ] Add extractable fields: layout, switch type, hot-swap, connectivity

**For Content Team:**
- [ ] Rewrite SwitchGuide.tsx (target: 800 words)
- [ ] Expand BeginnersGuide.tsx (target: 700 words)
- [ ] Write descriptions for 4 empty bundle products

**For Dev Team:**
- [ ] Add "Related Products" component
- [ ] Add "Complete Your Build" bundle suggestions
- [ ] Fix BestTKLGuide.tsx format consistency

---

*Report generated by Switchyard Content Quality Cron*  
*Next check: February 25, 2026 - 7:30 AM*
