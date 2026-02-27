# Affiliate Links Audit Report

**Generated:** 2/27/2026, 1:45:00 AM EST  
**Source:** data.json  
**Total Products:** 928

---

## 📊 Vendor Breakdown

| Vendor | Products | Affiliate Links | Coverage |
|--------|----------|-----------------|----------|
| ✅ Keychron | 405 | 405 | 100% |
| ✅ KBDfans | 262 | 262 | 100% |
| ✅ NovelKeys | 164 | 164 | 100% |
| ✅ Epomaker | 88 | 88 | 100% |
| ✅ Qwerkywriter | 9 | 9 | 100% |

---

## ✅ Summary

| Metric | Count |
|--------|-------|
| Total Products | 928 |
| Products with Affiliate Links | 928 |
| Coverage | 100% |
| Missing Affiliate Links (Known Vendors) | 0 |
| Links with Non-Standard Tracking | 928 |
| Malformed Links | 0 |

---

## ⚠️ Tracking Code Status

**Found 928 links with non-standard tracking codes:**

All affiliate links are using vendor-specific tracking parameters that differ from the standard `ref=keyboardtracker` format:

### By Vendor:

- **Keychron** (405 links): Uses `ref=switchyard` (legacy tracking code)
- **Epomaker** (88 links): Uses `sca_ref=10691179.cOO0hJ6jvi` (Shopify affiliate tracking)
- **KBDfans** (262 links): Uses `ref=switchyard` (legacy tracking code)
- **NovelKeys** (164 links): Uses `ref=switchyard` (legacy tracking code)
- **Qwerkywriter** (9 links): Uses `sca_ref=10713146.AiDf5cQpby` (Shopify affiliate tracking)

### Sample Links per Vendor:

- **Keychron** - Keychron K2 HE Wireless Magnetic Switch Custom Keyboard
  - https://keychron.com/products/keychron-k2-he-wireless-magnetic-switch-custom-keyboard-all-wood-special-edition?ref=switchyard
  
- **Epomaker** - EPOMAKER Carbonis Mouse
  - https://epomaker.com/products/epomaker-carbonis-mouse?sca_ref=10691179.cOO0hJ6jvi
  
- **KBDfans** - HX-40
  - https://kbdfans.com/products/hx-40?ref=switchyard
  
- **NovelKeys** - Smurve80
  - https://novelkeys.com/products/smurve-80-keyboard?ref=switchyard
  
- **Qwerkywriter** - QWERKYWRITER 2 Black Gold
  - https://www.qwerkywriter.com/products/qwerkywriter-2-black-gold?sca_ref=10713146.AiDf5cQpby

---

## 🔗 Link Opportunities

Vendors in database without affiliate partnerships:
- None detected - all 928 products from known affiliate vendors have affiliate links configured

---

## 📝 Notes

**Tracking Code Status:**
- Keychron: Uses `ref=switchyard` (legacy - should migrate to `ref=keyboardtracker`)
- Epomaker: Uses Shopify `sca_ref` (correct - vendor-specific format)
- KBDfans: Uses `ref=switchyard` (legacy - should migrate to `ref=keyboardtracker`)
- NovelKeys: Uses `ref=switchyard` (legacy - should migrate to `ref=keyboardtracker`)
- Qwerkywriter: Uses Shopify `sca_ref` (correct - vendor-specific format)

**Recommended Actions:**
1. **Medium Priority**: Normalize Keychron, KBDfans, and NovelKeys tracking to use consistent `ref=keyboardtracker`
2. **Low Priority**: Add affiliate partnerships for additional vendors (e.g., Drop, Amazon, Kono.store) if products are added from these sources

**Status Changes Since Last Check:**
- Product count increased from 919 to 928 (+9 products)
- Keychron added 0 products (stable at 405)
- All vendors maintain 100% affiliate link coverage
- No new malformed links detected

---
*Report ID: cron-70c02ac4*
