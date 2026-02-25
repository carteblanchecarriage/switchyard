# Affiliate Links Audit Report
**Project:** Keyboard Tracker (Switchyard)  
**Date:** February 25, 2026  
**Time:** 6:45 AM EST  
**Cron ID:** 70c02ac4-aac9-40ce-8d2f-15bdb7c95546

---

## 1. Affiliate Link Counts by Vendor

### ✅ Active Products with Affiliate Tracking (data.json)

| Vendor | Products | Tracking Parameter | Commission | Status |
|--------|----------|-------------------|------------|--------|
| **Keychron** | 30 | `?ref=keyboardtracker` | ~5-8% | ✅ Active |
| **Total** | **30** | — | — | ✅ 100% coverage |

### 📊 Previous State (Feb 25 04:45)
- 93 products across 5 vendors (Keychron, Epomaker, NovelKeys, KBDfans, Drop)
- Current state shows 30 products (Keychron only)
- ⚠️ **Regression detected**: 63 products removed from data.json

---

## 2. Missing Tracking Codes (Critical)

### ❌ Guide Pages Links WITHOUT Affiliate Tracking

**Summary: 22 external links need tracking parameters added**

| Vendor | Links | Location | Issue |
|--------|-------|----------|-------|
| **amazon.com** | 10 | 4 guide files | ❌ No Amazon Associates tag |
| **keychron.com** | 9 | 5 guide files | ❌ Missing `?ref=keyboardtracker` |
| **aliexpress.com** | 1 | Best75PercentGuide.tsx | ❌ No affiliate program |
| **nuphy.com** | 1 | Best75PercentGuide.tsx | ❌ No affiliate program |
| **zsa.io** | 1 | BestProgrammingGuide.tsx | ❌ No affiliate program |

**Detailed Breakdown:**

| Guide File | Keychron Links | Amazon Links | Other | Total Missing |
|------------|----------------|--------------|-------|---------------|
| **Best60PercentGuide.tsx** | 1 | 4 | 0 | 5 |
| **Best75PercentGuide.tsx** | 1 | 2 | 2 (AliExpress, NuPhy) | 5 |
| **BestBudgetGuide.tsx** | 2 | 2 | 0 | 4 |
| **BestProgrammingGuide.tsx** | 3 | 1 | 1 (ZSA) | 5 |
| **BestTKLGuide.tsx** | 3 | 0 | 0 | 3 |
| **TOTAL** | **10** | **9** | **3** | **22** |

---

## 3. Broken/Malformed Links

### ✅ No Issues Found

Current guide links appear properly formatted (no 404s detected via pattern analysis):
- All URLs use HTTPS
- No duplicate query parameters
- No empty href attributes
- Link syntax is valid

---

## 4. Link Opportunities

### 🎯 Immediate Action Required

**1. Add tracking to 9 Keychron guide links**
   - Append `?ref=keyboardtracker` to all keychron.com URLs in guide pages
   - Affected files: All 5 Best*Guide.tsx files

**2. Apply for Amazon Associates** (HIGH PRIORITY)
   - 9 Amazon links currently untracked
   - Products: HHKB, Royal Kludge RK61/RK84, Glorious GMMK, Akko 3068B, Durgod HK Venus, GMMK Pro
   - Commission: 1-3% on electronics
   - Signup: https://affiliate-program.amazon.com/

**3. Research vendor affiliate programs**
   - **NuPhy** (Halo75 featured) - Low-profile keyboards, growing brand
   - **ZSA** (Moonlander) - High-value split keyboards ($365)
   - **AliExpress** (Feker IK75) - Budget options, requires AliPort
   - **Royal Kludge** - Direct manufacturer program
   - **Glorious** - Already researched, need to apply
   - **Akko** - Chinese brand, check for US affiliate
   - **Durgod** - Check for in-house program

### 🎯 Data Restoration

**Restore missing products (63 missing):**
- Epomaker products were present in 04:45 report (30 count)
- NovelKeys, KBDfans, Drop were configured
- Check scraper status or restore from backup

---

## 5. Tracking Code Consistency

### Current Configurations

| Vendor | Parameter | Value | Consistency |
|--------|-----------|-------|-------------|
| Keychron (data.json) | `ref` | `keyboardtracker` | ✅ Consistent |
| Keychron (guides) | — | None | ❌ Missing |
| Drop | `referer` | `keyboardtracker` | ✅ (if products restored) |

### ⚠️ Discrepancy Found

- data.json: All Keychron products use `?ref=keyboardtracker`
- Guide pages: 9 Keychron links have NO tracking

**Fix needed:** Sync guide pages with data.json tracking standard.

---

## 6. Compliance Status

| Requirement | Status |
|-------------|--------|
| FTC Disclosure | ❌ Missing from guide pages |
| Link transparency | ⚠️ No disclosure that links may earn commission |

**Action needed:** Add affiliate disclosure to all guide pages and privacy policy.

---

## Summary Statistics

| Metric | Count |
|--------|-------|
| Products in data.json | 30 (was 93) |
| Products with affiliate links | 30 (100%) |
| Guide page external links | 22 |
| Guide links with tracking | 0 |
| Links missing tracking | 22 |
| Vendors configured | 1 (Keychron) |
| Amazon links untracked | 9 |

---

## Action Items (Priority Order)

### 🔴 NOW (Critical)
1. **Add `?ref=keyboardtracker` to 9 Keychron links in guide pages**
2. **Investigate missing 63 products** (Epomaker, NovelKeys, KBDfans, Drop)

### 🟡 THIS WEEK
3. Apply for Amazon Associates program
4. Add affiliate disclosure to guide pages
5. Research NuPhy and ZSA affiliate programs

### 🟢 SOON
6. Contact Royal Kludge for direct partnership
7. Check Glorious affiliate application status
8. Review data.json backup or re-run vendor scrapers

---

*Report generated by Switchyard hourly cron - Affiliate Links check (:45)*
