# Affiliate Links Report
**Generated:** 2026-02-25 16:45 EST  
**Location:** /home/klondike/Desktop/keyboard-tracker/

---

## Executive Summary

| Metric | Count | Status |
|--------|-------|--------|
| Tracked Affiliate Links (data.json) | 2,214 | ✅ Good |
| Guide Links Missing Tracking | 10 | ⚠️ Fix Needed |
| Amazon Links (no tag) | 9 | ❌ No Revenue |
| Other Vendor Opportunities | 3 | ⏳ Pending Programs |

---

## 1. Affiliate Links by Vendor (Data File)

Tracked links in `public/data.json` with `?ref=keyboardtracker`:

| Vendor | Links | Commission | Status |
|--------|-------|------------|--------|
| Keychron | 959 | ~5-8% | ✅ 100% Tracked |
| KBDfans | 604 | ~5-8% | ✅ 100% Tracked |
| NovelKeys | 373 | ~10% | ✅ 100% Tracked |
| Epomaker | 278 | ~6% | ✅ 100% Tracked |
| Drop | 5 | 5% | ⚠️ 0% Tracked (Missing ref) |

**Total Tracked:** 2,214 product links

**Note:** Drop links in data.json appear to be missing `?ref=keyboardtracker` tracking parameter.

---

## 2. Missing Tracking Codes (CRITICAL)

### Guide Files - Keychron Links Without `?ref=keyboardtracker`

These links are sending traffic WITHOUT attribution:

| File | Line | URL |
|------|------|-----|
| Best60PercentGuide.tsx | 45 | `keychron.com/products/keychron-q4-pro` |
| BestBudgetGuide.tsx | 14 | `keychron.com/products/keychron-v1` |
| BestBudgetGuide.tsx | 32 | `keychron.com/products/keychron-k8` |
| BestProgrammingGuide.tsx | 12 | `keychron.com/products/keychron-q1-pro` |
| BestProgrammingGuide.tsx | 28 | `keychron.com/products/keychron-k3-pro` |
| BestProgrammingGuide.tsx | 44 | `keychron.com/products/keychron-k8-pro` |
| Best75PercentGuide.tsx | 12 | `keychron.com/products/keychron-q1-pro` |
| BestTKLGuide.tsx | 43 | `keychron.com/products/keychron-q3` |
| BestTKLGuide.tsx | 57 | `keychron.com/products/keychron-c3-pro` |
| BestTKLGuide.tsx | 71 | `keychron.com/products/keychron-q3-he` |

**Total:** 10 untracked Keychron links

### Impact
- Average order: $100-150
- Commission: ~5-8%
- **Estimated monthly lost revenue: $50-120**

---

## 3. Amazon Links Without Associates Tag

**CRITICAL:** 9 Amazon search links have NO affiliate tracking. These generate ZERO commission.

| File | Product Search |
|------|----------------|
| Best60PercentGuide.tsx | akko 3068b plus |
| Best60PercentGuide.tsx | rk61 royal kludge |
| Best60PercentGuide.tsx | glorious gmmk compact |
| Best60PercentGuide.tsx | durgod hk venus |
| Best75PercentGuide.tsx | rk84 royal kludge |
| Best75PercentGuide.tsx | gmmk pro |
| BestBudgetGuide.tsx | royal kludge rk61 |
| BestBudgetGuide.tsx | glorious gmmk compact |
| BestProgrammingGuide.tsx | hhkb professional hybrid |

**Action Required:** Sign up for Amazon Associates and add `&tag=YOUR_TAG-20` to all URLs.

---

## 4. Other Vendors Without Affiliate Programs

| Vendor | File | Product | Opportunity |
|--------|------|---------|-------------|
| AliExpress | Best75PercentGuide.tsx | Feker IK75 | Via ShareASale or AliExpress portal |
| Nuphy | Best75PercentGuide.tsx | Halo75 | In-house program possible |
| ZSA | BestProgrammingGuide.tsx | Moonlander | Has referral program - apply |

---

## 5. Link Opportunities (From AFFILIATE-VENDORS.md)

### High Priority Applications Pending

| Vendor | Commission | Products | Action |
|--------|------------|----------|--------|
| CannonKeys | 5-8% | Premium kits, keycaps | ⏳ Apply pending |
| Glorious | 5-10% | GMMK keyboards, switches | ⏳ Impact platform |
| The Key Company | 10% | Keycaps, switches | ⏳ Contact for partnership |
| Prevail Key Co | ~5-10% | Stabilizers, switches | ⏳ Email info@prevailkeyco.com |
| DiviniKey | Unknown | Entry/mid-range boards | ⏳ Contact via website |

### Product Categories Missing Coverage

- **Switches:** No dedicated switch vendor affiliate (Gateron, Kailh, Cherry)
- **Keycaps:** Drop only - Missing CannonKeys, The Key Company
- **DIY Kits:** Boardsource, RNDKBD opportunity for hobbyist segment

---

## 6. Recommendations

### Immediate Actions (This Week)

1. **Fix 10 untracked Keychron links** - Add `?ref=keyboardtracker`
   - Files: Best60PercentGuide.tsx, BestBudgetGuide.tsx, BestProgrammingGuide.tsx, Best75PercentGuide.tsx, BestTKLGuide.tsx

2. **Apply for Amazon Associates** - Critical revenue opportunity (9 links affected)

3. **Fix Drop links** - Add `?ref=keyboardtracker` to the 5 Drop links in data.json

### Medium-Term (This Month)

1. Submit CannonKeys affiliate application
2. Reach out to Nuphy for partnership
3. Add ZSA Moonlander referral tracking
4. Investigate Logitech affiliate program for gaming keyboards
5. Consider AliExpress portal for Feker IK75

### Revenue Estimate

| Scenario | Monthly Estimate |
|----------|------------------|
| Current (tracked only) | $150-400/month |
| After fixing missing ref codes | $200-520/month (+$50-120) |
| With Amazon Associates | $300-700/month (+$100-180) |
| Full integration (5 new vendors) | $600-1,200/month |

---

## 7. Files Requiring Updates

```
src/pages/learn/Best60PercentGuide.tsx    (1 link to fix)
src/pages/learn/BestBudgetGuide.tsx         (2 links to fix)
src/pages/learn/BestProgrammingGuide.tsx    (3 links to fix)
src/pages/learn/Best75PercentGuide.tsx      (1 link to fix)
src/pages/learn/BestTKLGuide.tsx            (3 links to fix)
```

---

## Appendix: Vendor Contact Info

| Vendor | Contact | Method |
|--------|---------|--------|
| CannonKeys | support@cannonkeys.com | Email |
| Glorious | affiliates.gloriousgaming.com | Impact platform |
| The Key Company | Contact via website | Form |
| Prevail Key Co | info@prevailkeyco.com | Email |
| DiviniKey | Contact via website | Form |
| Amazon Associates | affiliate-program.amazon.com | Signup |
| ZSA Moonlander | zsa.io/voice | Referral program |

---

*Report generated by Switchyard Affiliate Links Check*  
*Next check: 2026-02-25 17:45*
