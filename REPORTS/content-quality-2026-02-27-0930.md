# Switchyard Content Quality Report
Generated: Friday, February 27, 2026 — 9:30 AM

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| Total Guides | 10 | ✅ |
| Guides Below 1,500 Words | 2 | ⚠️ |
| Blog Posts | 2 | ✅ |
| Products Tracked | 1,816 | ✅ |
| Product Description Issues | 512 | 🔴 |
| Critical Broken Elements | 4 | 🔴 |
| Content Gaps | 6 | ⚠️ |
| Internal Cross-Links | Minimal | ⚠️ |

---

## 1. Guide Completeness (Word Counts)

### Primary Guides (Good Quality ✅)
| Guide | Words | Grade | Notes |
|-------|-------|-------|-------|
| `/guides/complete/index.html` | 2,275 | B+ | Comprehensive, well-structured |
| `/guides/programming/index.html` | 1,819 | B | Good coverage |
| `/guides/lubing/index.html` | 1,719 | B | Step-by-step format |
| `/guides/switches/index.html` | 1,689 | B | Switch comparison tables |
| `/glossary/index.html` | 2,350 | A- | Extensive definitions |
| `/blog/what-are-group-buys.html` | 1,887 | B+ | Strong informational content |

### Secondary Pages (Needs Improvement ⚠️)
| Page | Words | Issue |
|------|-------|-------|
| `/beginner/index.html` | 1,138 | Below 1,500 word SEO threshold |
| `/gaming/index.html` | 1,020 | Thin content - needs expansion |
| `/best-60-percent/index.html` | 1,467 | Just under threshold |
| `/best-budget/index.html` | 1,436 | Just under threshold |
| `/best-programming/index.html` | 1,344 | Below threshold |
| `/faq/index.html` | 1,361 | Below threshold |
| `/blog/index.html` | 788 | Acceptable for blog landing |

**Analysis:**
- 6 out of 10 content pages are below the recommended 1,500-word threshold
- Gaming guide needs significant expansion for competitive keywords
- Beginner guide should merge with complete guide or be beefed up

---

## 2. Product Descriptions Quality

### Critical Issues Found

**Low-Quality Descriptions:**
- **283 products** (15.6%) have "THIS KEYCAP DOES NOT INCLUDE THE KEYBOARD" warnings
- **229 products** (12.6%) contain "Notify Me When Available" promotional text
- Many descriptions are **truncated mid-sentence** from scraping
- **HTML entities** not decoded (`&amp;`, `&gt;`, `&lt;` appear as text)

**Example Issues:**
```json
"description": "Keychron K2 HE is a 75% layout... Now in a premium concrete body - a masterp"  // TRUNCATED
"description": "Please drop your email on \"Notify Me When Available\"..."  // PROMOTIONAL
"description": "The Black Transparent Low Profile LSA..."  // GENERIC
```

### Impact
- Poor SEO - search engines see incomplete/duplicate content
- Poor UX - customers see vendor disclaimers instead of value props
- Missed opportunity for keyword-rich product descriptions

---

## 3. Placeholder Text & Broken Elements

### Critical Issues (Need Immediate Fix)

1. **`/guides/lubing/index.html` Line 139**
   - Empty tool icon: `<div class="tool-icon"></div>`
   - Should have emoji (suggested: 🔧 for switch opener)

2. **`/guides/lubing/index.html` Line 154**  
   - Broken HTML: `<div class="tool-icon">>/div>`
   - Missing opening bracket for closing tag
   - Should be: `<div class="tool-icon">🗂️</div>` (for containers)

3. **`/guides/programming/index.html` Line 142**
   - Empty feature icon: `<div class="feature-icon"></div>`
   - Missing emoji for a feature box

4. **`/guides/switches/index.html` JavaScript**
   - Variables used but never declared: `isDark`, `savedTheme`, `prefersDark`
   - Theme toggle button broken (no icon appears)
   - Code at lines 393-400 has undeclared constants

### Internal Linking (Cross-Sale Opportunities)

**Current State:**
- `/guides/complete/index.html` has only 9 internal links
- No "Related Guides" sidebar
- No product cards embedded in guides
- No "Complete Your Setup" recommendations

**Missing Cross-Links:**
- Switch Guide → Lubing Guide (natural flow: buy switches → lube them)
- Programming Guide → Switch Guide (programmers need specific switches)
- Complete Guide → All other guides
- Gaming Guide → Switch Guide (gaming switches section)

---

## 4. Content Gaps

### High Priority Missing Content

| URL in Sitemap | Actual Location | Status |
|----------------|-----------------|--------|
| `/learn/best-gaming` | `/gaming/` | ⚠️ URL mismatch |
| `/learn/best-60-percent` | `/best-60-percent/` | ⚠️ URL mismatch |
| `/learn/best-75-percent` | Does not exist | 🔴 MISSING |
| `/learn/best-tkl` | Does not exist | 🔴 MISSING |
| `/learn/keycap-profiles` | Does not exist | 🔴 MISSING |
| `/learn/artisan-guide` | Does not exist | 🔴 MISSING |
| `/learn/layout-sizes` | Does not exist | 🔴 MISSING |

**Recommendation:**
The sitemap references `/learn/*` URLs but content lives at root level. Either:
1. Create redirect pages at `/learn/*` → actual locations
2. Update sitemap to reflect actual URLs
3. Move content to `/learn/*` structure

### Size-Specific Guide Gap
No dedicated guides for:
- 75% keyboards (high search volume)
- TKL/80% keyboards (high search volume)
- Full-size keyboards
- 40%/ortholinear formats

---

## 5. Cross-Sale Opportunities

### Current State: Underutilized
- Text-only product mentions (no cards/visuals)
- No "Frequently Bought Together" sections
- No related products at end of guides
- No guide-to-guide connections

### Recommended Additions

**A. Product Cards in Guides**
Add to `/guides/switches/index.html` after each switch type:
```html
<div class="product-cta">
  <h4>Ready to try linear switches?</h4>
  <div class="product-grid">
    <!-- Featured linear switches from data.json -->
  </div>
</div>
```

**B. "Complete Your Setup" Section**
After keyboard recommendations in `/gaming/` and `/best-*` guides:
- Switch tester recommendations
- Keycap upgrade suggestions
- Cable/cleaning accessories

**C. Guide Interlinking**
Add sidebar to all guides:
- "Next: How to Lube Your Switches"
- "Related: Switch Buying Guide"
- "First-time builder? Read Beginner's Guide"

---

## 6. SEO & Metadata Quality

### Good ✅
- All pages have unique `<title>` tags
- Meta descriptions present (140-160 chars)
- Schema.org Article markup on complete guide
- Canonical URLs properly set
- Sitemap.xml comprehensive (27 URLs)

### Needs Improvement ⚠️
- Open Graph images missing for most pages
- Twitter card images reference generic `og-home.svg`
- Article schema missing on `/gaming/`, `/beginner/`
- No FAQ schema on `/faq/` (missed opportunity)
- Breadcrumbs not implemented sitewide

---

## 7. Fix Priority Matrix

### P0 - Fix Today (Broken Elements)
1. Fix broken HTML in `/guides/lubing/index.html` line 154 (`>/div>` → `</div>`)
2. Add missing emoji to `/guides/lubing/index.html` line 139 (🔧)
3. Add missing emoji to `/guides/programming/index.html` line 142
4. Fix JavaScript in `/guides/switches/index.html` - declare `const isDark`, `savedTheme`, `prefersDark`

### P1 - This Week (Content Quality)
5. Expand `/gaming/index.html` to 1,500+ words (add switch recommendations for gaming)
6. Expand `/beginner/index.html` or redirect to `/guides/complete/`
7. Create missing `/learn/*` redirects or update sitemap
8. Add 50-word SEO descriptions to top 50 products in data.json

### P2 - This Month (Content Gaps)
9. Create `/best-75-percent/` guide
10. Create `/best-tkl/` guide  
11. Create `/learn/keycap-profiles.html` guide
12. Add cross-links between all guides

### P3 - Backlog (Enhancement)
13. Implement product cards in guides (pull from data.json)
14. Add "Complete Your Setup" sections
15. Create interactive switch selector tool
16. Add FAQ schema markup

---

## 8. Quick Wins

These can be done in 30 minutes:

1. **Add emojis to empty tool icons:**
   - Line 139 lubing: `🔧` (switch opener)
   - Line 154 lubing: `🗂️` (containers)
   - Line 142 programming: `💡` (missing feature)

2. **Fix broken HTML tag:**
   - Line 154: Change `>/div>` to `>🗂️</div>`

3. **Add JavaScript declarations:**
   ```javascript
   const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
   const savedTheme = localStorage.getItem('switchyard-theme');
   const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark.matches);
   ```

4. **Add 3-4 sentences to gaming guide** to hit 1,500 words

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Total Content Pages | 12 |
| Pages Meeting Word Count | 6 (50%) |
| Products with Quality Descriptions | ~1,300 (72%) |
| Products with Poor Descriptions | ~512 (28%) |
| Broken Elements | 4 |
| Missing Content Pages | 6 |
| Internal Cross-Links | < 10 |

**Overall Grade: C+**
- Solid guide content where it exists
- Significant product description issues
- Technical bugs affecting UX
- Underutilized cross-selling potential

---

Report prepared by: Content Quality Bot
Next check scheduled: Hourly (:30)
