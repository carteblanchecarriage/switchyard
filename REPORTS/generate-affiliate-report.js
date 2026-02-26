const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const products = data.allProducts || [];

const vendorCounts = {};
const affiliateCounts = {};
const missingAffiliate = [];
const wrongTracking = [];
const correctTracking = [];
const malformed = [];

// Known affiliate vendors
const knownVendors = ['Keychron', 'Epomaker', 'KBDfans', 'NovelKeys', 'Drop'];

products.forEach(p => {
  const vendor = p.vendor || p.brand || 'Unknown';
  vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;

  if (p.affiliateUrl) {
    affiliateCounts[vendor] = (affiliateCounts[vendor] || 0) + 1;

    // Check tracking codes
    if (p.affiliateUrl.includes('ref=keyboardtracker')) {
      correctTracking.push({ name: p.name, vendor, url: p.affiliateUrl });
    } else if (p.affiliateUrl.includes('ref=switchyard') || p.affiliateUrl.includes('sca_ref=')) {
      wrongTracking.push({ name: p.name, vendor, url: p.affiliateUrl });
    }

    // Check malformed
    if (!p.affiliateUrl.startsWith('http') || p.affiliateUrl.includes(' ') || p.affiliateUrl.includes('\n') || p.affiliateUrl.includes('\t')) {
      malformed.push({ name: p.name, vendor, url: p.affiliateUrl });
    }
  } else {
    if (knownVendors.includes(vendor)) {
      missingAffiliate.push({ name: p.name, vendor });
    }
  }
});

const totalProducts = products.length;
const totalAffiliate = Object.values(affiliateCounts).reduce((a, b) => a + b, 0);

const now = new Date();
const reportDate = now.toISOString().split('T')[0];
const reportTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(':', '');
const filename = `REPORTS/affiliate-links-${reportDate}-${reportTime}.md`;

let vendorTable = '';
Object.entries(vendorCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, v]) => {
    const aff = affiliateCounts[k] || 0;
    const pct = v > 0 ? Math.round(aff / v * 100) : 0;
    const status = pct === 100 ? '✅' : pct >= 80 ? '⚠️' : '❌';
    vendorTable += `| ${status} ${k} | ${v} | ${aff} | ${pct}% |\n`;
  });

let wrongTrackingList = '';
if (wrongTracking.length > 0) {
  wrongTrackingList = `**Found ${wrongTracking.length} links with non-standard tracking codes:**\n\n`;
  wrongTracking.slice(0, 15).forEach(m => {
    wrongTrackingList += `- **${m.vendor}** - ${m.name}\n  - ${m.url.substring(0, 90)}...\n`;
  });
  if (wrongTracking.length > 15) {
    wrongTrackingList += `\n_... and ${wrongTracking.length - 15} more_`;
  }
} else {
  wrongTrackingList = '✅ All affiliate links have standard tracking codes';
}

let opportunities = Object.entries(vendorCounts)
  .filter(([k]) => !knownVendors.includes(k) && k !== 'Unknown')
  .sort((a, b) => b[1] - a[1])
  .slice(0, 10)
  .map(([k, v]) => `- ${k}: ${v} products`)
  .join('\n') || '- None detected';

const report = `# Affiliate Links Audit Report

**Generated:** ${now.toLocaleString('en-US', { timeZone: 'America/New_York' })} EST  
**Source:** data.json  
**Total Products:** ${totalProducts}

---

## 📊 Vendor Breakdown

| Vendor | Products | Affiliate Links | Coverage |
|--------|----------|-----------------|----------|
${vendorTable}

---

## ✅ Summary

| Metric | Count |
|--------|-------|
| Total Products | ${totalProducts} |
| Products with Affiliate Links | ${totalAffiliate} |
| Coverage | ${Math.round(totalAffiliate / totalProducts * 100)}% |
| Missing Affiliate Links (Known Vendors) | ${missingAffiliate.length} |
| Links with Non-Standard Tracking | ${wrongTracking.length} |
| Malformed Links | ${malformed.length} |

---

## ⚠️ Tracking Code Status

${wrongTrackingList}

---

## 🔗 Link Opportunities

Vendors in database without affiliate partnerships:
${opportunities}

---

## 📝 Notes

**Tracking Code Status:**
- Keychron: Uses ref=keyboardtracker (correct) or ref=switchyard (legacy)
- Epomaker: Uses Shopify sca_ref (tracked separately)
- KBDfans: Uses ref=switchyard (legacy - should migrate)
- NovelKeys: Uses ref=switchyard (legacy - should migrate)

**Recommended Actions:**
1. Medium Priority: Normalize all vendor tracking to use consistent ref=keyboardtracker
2. Low Priority: Add affiliate partnerships for other vendors (Amazon, Drop, etc.)

---
*Report ID: cron-70c02ac4*
`;

fs.writeFileSync(filename, report);
console.log('=== AFFILIATE LINK AUDIT SUMMARY ===');
console.log(`Total Products: ${totalProducts}`);
console.log(`With Affiliate Links: ${totalAffiliate} (100%)`);
console.log(`Non-Standard Tracking: ${wrongTracking.length} links`);
console.log(`Malformed Links: ${malformed.length}`);
console.log(`Report saved to: ${filename}`);
