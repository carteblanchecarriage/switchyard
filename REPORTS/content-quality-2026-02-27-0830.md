# Switchyard Content Quality Report
**Generated:** Friday, February 27, 2026 — 8:30 AM
**Type:** Hourly Quality Audit

---

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Guides | 4 | ✅ Active |
| Avg Guide Word Count | 1,876 | ✅ Good (min 1,500) |
| Blog Posts | 2 | ✅ Published |
| Products Tracked | 928 | ✅ Active |
| Critical Issues | 3 | ⚠️ Needs Fix |
| Content Gaps | 9 | ⚠️ Missing Pages |

---

## 1. Guide Completeness Analysis

### Word Counts

| Guide | File | Words | Status | Grade |
|-------|------|-------|--------|-------|
| Complete Guide | `guides/complete/index.html` | 2,275 | ✅ Strong | B+ |
| Programming | `guides/programming/index.html` | 1,819 | ✅ Good | B |
| Lubing | `guides/lubing/index.html` | 1,719 | ✅ Good | B |
| Switch Buying | `guides/switches/index.html` | 1,689 | ✅ Good | B |
| Beginner | `beginner/index.html` | 1,138 | ⚠️ Thin | C+ |
| Best Keyboards | `best/index.html` | 1,078 | ⚠️ Thin | C+ |
| Blog Index | `blog/index.html` | 788 | ⚠️ List Only | C |
| Group Buys Post | `blog/what-are-group-buys.html` | 1,887 | ✅ Good | B |

**Assessment:**
- Core guides (4 guides in /guides/) all meet 1,500+ word SEO threshold
- Supporting pages (beginner/, best/) are thinner but may be sufficient for their purpose
- Blog has 2 posts; room for more content

---

## 2. Placeholder & Broken Elements (CRITICAL)

### Issue #1: Broken Icon in guides/lubing/index.html
**Location:** Line ~142
**Problem:** 
```html
<div class="tool-icon">>/div>
```
- Missing opening `<`
- Wrong content (`>` instead of emoji)
- Should be: `<div class="tool-icon">📦</div>` or similar

**Impact:** Visual glitch, broken HTML structure

### Issue #2: Empty Icon in guides/lubing/index.html
**Location:** Line ~135
**Problem:**
```html
<div class="tool-icon"></div>
<div class="tool-name">Switch Opener</div>
```
- Missing emoji/icon entirely
- Should have: 🔧 or similar tool emoji

### Issue #3: Empty Icon in guides/programming/index.html
**Location:** Line ~133
**Problem:**
```html
<div class="feature-icon"></div>
<div class="feature-title">Clean Aesthetic</div>
```
- Missing emoji for "Clean Aesthetic" feature
- Suggested: 🧼 or ✨

---

## 3. Product Description Quality

### Issues Found in data.json (928 products)

**Critical Problems:**
1. **Truncated descriptions** - All descriptions cut off mid-sentence
   - Example: `"...a premium concrete body - a masterp"` (incomplete)
   - Example: `"...Gateron double-rail magnetic swit"` (cut off)

2. **HTML entities not decoded** - `&amp;`, `&gt;` appear raw instead of `&`, `>`

3. **Scraping artifacts** - Vendor-specific text pollutes descriptions:
   - `"Please drop your email on 'Notify Me When Available'..."`
   - `"No discount codes can be used for V1 8K."`
   - `"The Fully Assembled version includes:"` (list formatting issues)

4. **Excessive whitespace** - Multiple `\n\n\n` in descriptions

**Impact:** Poor SEO, bad UX, looks unprofessional

**Recommendation:**
- Add manual SEO descriptions for top 50 products (50-160 chars)
- Strip vendor promotional text
- Decode HTML entities
- Remove excessive line breaks

---

## 4. Content Gaps (Missing Pages)

### URLs in sitemap.xml that DON'T EXIST:

| URL Path | Listed In | Exists? | Priority |
|----------|-----------|---------|----------|
| `/learn/beginners-guide` | Sitemap | ❌ NO | HIGH |
| `/learn/layout-sizes` | Sitemap | ❌ NO | HIGH |
| `/learn/glossary` | Sitemap | ❌ NO | MEDIUM |
| `/learn/keycap-profiles` | Sitemap | ❌ NO | HIGH |
| `/learn/artisan-guide` | Sitemap | ❌ NO | MEDIUM |
| `/learn/group-buys` | Sitemap | ❌ NO | MEDIUM |
| `/learn/best-gaming` | Sitemap | ❌ NO | HIGH |
| `/learn/best-60-percent` | Sitemap | ❌ NO | MEDIUM |
| `/learn/best-75-percent` | Sitemap | ❌ NO | MEDIUM |
| `/learn/best-tkl` | Sitemap | ❌ NO | MEDIUM |

### Existing Pages (Correct URL):
- `/beginner/` ✓ (should be `/learn/beginners-guide`)
- `/switches/` ✓ (should be `/learn/switch-guide`)
- `/glossary/` ✓ (should be `/learn/glossary`)
- `/faq/` ✓ (should be `/learn/faq`)

**Impact:** 404 errors, lost SEO value, confused users
**Fix:** Create `/learn/` directory with redirects or actual content

---

## 5. Cross-Sale Opportunities

### Current State
- ❌ No product cards within guides
- ❌ No "related products" sections
- ❌ No "frequently bought together"
- ❌ No guide-to-guide cross-links
- ✅ Basic text links to index.html present

### Recommendations

**1. Add Product Cards to Guides**
   - Add featured product sections at end of each guide
   - Example: Switch guide should link to switch testers

**2. Link Related Guides**
   - Switch Guide → Lubing Guide
   - Programming Guide → Switch Guide  
   - Complete Guide → All other guides

**3. Add "Complete Your Setup" Section**
   After keyboard recommendations:
   - Switch testers
   - Keycap sets
   - Cables, wrist rests

**4. Blog Cross-Links**
   - Group Buys post → Switch Guide
   - All posts → Beginner Guide

---

## 6. New Content Recommendations

### High Priority (Missing Guides)
| Topic | Search Volume | Status |
|-------|---------------|--------|
| Gaming Keyboards Guide | High | ❌ Missing |
| Keycap Profiles Comparison | Medium-High | ❌ Missing |
| Best 60% Keyboards | Medium | ❌ Missing |
| Best 75% Keyboards | Medium | ❌ Missing |
| Best TKL Keyboards | Medium | ❌ Missing |

### Medium Priority
- Switch sound comparison (audio embeds)
- Interactive switch selector tool
- "Build your first keyboard" step-by-step
- Stabilizer modding guide

### Lower Priority
- Historical group buy archive
- Artisan maker spotlights
- Community showcase gallery

---

## 7. Action Items

### 🚨 P0 - Fix ASAP
1. Fix broken `<div class="tool-icon">>/div>` in guides/lubing/index.html
2. Add missing emoji to Switch Opener tool card (guides/lubing)
3. Add missing emoji to Clean Aesthetic feature (guides/programming)

### ⚠️ P1 - This Week
4. Create `/learn/` directory with redirects to existing guides
5. Add manual SEO descriptions for top 50 products
6. Fix HTML entities in product descriptions
7. Create gaming keyboards guide

### 📋 P2 - This Month
8. Build keycap profiles guide
9. Create size-specific guides (60%, 75%, TKL)
10. Add cross-links between all guides
11. Implement related products sidebar

### 🔮 P3 - Backlog
12. Add audio samples to switch guide
13. Build interactive switch selector
14. Create "build your first" tutorial

---

## Files Examined
- `guides/complete/index.html` (2,275 words)
- `guides/lubing/index.html` (1,719 words)
- `guides/programming/index.html` (1,819 words)  
- `guides/switches/index.html` (1,689 words)
- `beginner/index.html` (1,138 words)
- `best/index.html` (1,078 words)
- `blog/index.html` (788 words)
- `blog/what-are-group-buys.html` (1,887 words)
- `data.json` (928 products)
- `sitemap.xml` (26 URLs, 9 broken)

---

*Report prepared by: Content Quality Bot*
*Next check: Hourly (:30)*
