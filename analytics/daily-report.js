#!/usr/bin/env node
/**
 * Daily Analytics Report
 * Generates a summary of traffic and affiliate performance
 */

const fs = require('fs');
const path = require('path');
const { getSummary } = require('./dashboard');

const REPORTS_DIR = path.join(__dirname, '..', 'REPORTS');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

function generateDailyReport() {
  const summary = getSummary(1); // Last 24 hours
  const today = new Date().toISOString().split('T')[0];
  
  let report = `# Daily Analytics Report - ${today}\n\n`;
  report += `Generated: ${new Date().toLocaleString()}\n\n`;
  
  report += `## 📊 Key Metrics\n\n`;
  report += `- **Total Clicks:** ${summary.summary.totalClicks.toLocaleString()}\n`;
  report += `- **Total Views:** ${summary.summary.totalViews.toLocaleString()}\n`;
  report += `- **Conversion Rate:** ${summary.summary.conversionRate}\n`;
  report += `- **Clicks (24h):** ${summary.recentClicks}\n\n`;
  
  report += `## 🏆 Top Performers\n\n`;
  report += `- **Top Vendor:** ${summary.topVendor}\n`;
  report += `- **Top Category:** ${summary.topCategory}\n\n`;
  
  report += `## 📈 Top 10 Products Today\n\n`;
  report += `| Product | Vendor | Category | Clicks |\n`;
  report += `|---------|--------|----------|--------|\n`;
  
  summary.topProducts.slice(0, 10).forEach(p => {
    report += `| ${p.name.substring(0, 40)} | ${p.vendor} | ${p.category} | ${p.clicks} |\n`;
  });
  
  report += `\n## 📊 Clicks by Vendor\n\n`;
  const vendors = Object.entries(summary.clicksByVendor)
    .sort((a, b) => b[1] - a[1]);
  vendors.forEach(([vendor, clicks]) => {
    report += `- ${vendor}: ${clicks} clicks\n`;
  });
  
  report += `\n## 📦 Clicks by Category\n\n`;
  const categories = Object.entries(summary.clicksByCategory)
    .sort((a, b) => b[1] - a[1]);
  categories.forEach(([category, clicks]) => {
    report += `- ${category}: ${clicks} clicks\n`;
  });
  
  report += `\n## 💡 Optimization Recommendations\n\n`;
  
  // Generate suggestions based on data
  const topProduct = summary.topProducts[0];
  if (topProduct) {
    report += `1. **Feature on Homepage:** \`${topProduct.name}\` is getting the most clicks\n`;
  }
  
  const vendorsWithClicks = vendors.filter(([_, clicks]) => clicks > 0);
  if (vendorsWithClicks.length > 0) {
    report += `2. **Top Vendor:** ${summary.topVendor} - ensure their products are prominently displayed\n`;
  }
  
  if (summary.summary.conversionRate < '1%') {
    report += `3. **Low Conversion:** Consider A/B testing affiliate link placements\n`;
  }
  
  if (summary.clicksByCategory['keyboard'] < summary.clicksByCategory['keycaps']) {
    report += `4. **Keycaps Popular:** Add more keycap products or create keycap guides\n`;
  }
  
  return report;
}

// Save report
const report = generateDailyReport();
const reportFile = path.join(REPORTS_DIR, `analytics-${new Date().toISOString().split('T')[0]}.md`);
fs.writeFileSync(reportFile, report);

console.log('📊 Daily analytics report generated:', reportFile);
console.log('\n' + report);

module.exports = { generateDailyReport };
