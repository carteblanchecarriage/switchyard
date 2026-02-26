/**
 * Switchyard Analytics Dashboard
 * Simple tracking for affiliate clicks, product views, and traffic
 */

const fs = require('fs');
const path = require('path');

const ANALYTICS_DIR = path.join(__dirname, '..', 'analytics');
const DATA_FILE = path.join(ANALYTICS_DIR, 'tracking-data.json');
const DAILY_DIR = path.join(ANALYTICS_DIR, 'daily');

// Ensure directories exist
if (!fs.existsSync(ANALYTICS_DIR)) {
  fs.mkdirSync(ANALYTICS_DIR, { recursive: true });
}
if (!fs.existsSync(DAILY_DIR)) {
  fs.mkdirSync(DAILY_DIR, { recursive: true });
}

// Load or initialize data
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.log('Error loading analytics data:', e.message);
  }
  return {
    totalClicks: 0,
    totalViews: 0,
    clicksByVendor: {},
    clicksByCategory: {},
    topProducts: [],
    dailyStats: {},
    lastUpdated: new Date().toISOString()
  };
}

// Save data
function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Record a click
function recordClick(vendor, product, category, price) {
  const data = loadData();
  
  data.totalClicks++;
  data.lastUpdated = new Date().toISOString();
  
  // Track by vendor
  data.clicksByVendor[vendor] = (data.clicksByVendor[vendor] || 0) + 1;
  
  // Track by category
  data.clicksByCategory[category] = (data.clicksByCategory[category] || 0) + 1;
  
  // Track top products
  const existingProduct = data.topProducts.find(p => p.name === product);
  if (existingProduct) {
    existingProduct.clicks++;
  } else {
    data.topProducts.push({ name: product, vendor, category, price, clicks: 1 });
  }
  
  // Sort and keep top 50
  data.topProducts.sort((a, b) => b.clicks - a.clicks);
  data.topProducts = data.topProducts.slice(0, 50);
  
  // Daily stats
  const today = new Date().toISOString().split('T')[0];
  if (!data.dailyStats[today]) {
    data.dailyStats[today] = { clicks: 0, uniqueProducts: new Set() };
  }
  data.dailyStats[today].clicks++;
  saveData(data);
  
  return true;
}

// Record a view
function recordView(vendor, product, category) {
  const data = loadData();
  data.totalViews++;
  data.lastUpdated = new Date().toISOString();
  saveData(data);
  return true;
}

// Get analytics summary
function getSummary(days = 30) {
  const data = loadData();
  
  // Calculate recent stats
  const now = new Date();
  let recentClicks = 0;
  const recentTopProducts = [...data.topProducts].slice(0, 10);
  
  // Get last N days
  const dates = Object.keys(data.dailyStats).sort().slice(-days);
  const dailyChart = dates.map(date => ({
    date,
    clicks: data.dailyStats[date]?.clicks || 0
  }));
  
  dates.forEach(date => {
    recentClicks += data.dailyStats[date]?.clicks || 0;
  });
  
  return {
    summary: {
      totalClicks: data.totalClicks,
      totalViews: data.totalViews,
      conversionRate: data.totalViews > 0 ? ((data.totalClicks / data.totalViews) * 100).toFixed(2) + '%' : '0%',
      lastUpdated: data.lastUpdated
    },
    recentClicks,
    recentPeriod: days,
    clicksByVendor: data.clicksByVendor,
    clicksByCategory: data.clicksByCategory,
    topProducts: recentTopProducts,
    dailyChart,
    topVendor: Object.entries(data.clicksByVendor)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None',
    topCategory: Object.entries(data.clicksByCategory)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'
  };
}

// Generate report
function generateReport() {
  const summary = getSummary();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SWITCHYARD ANALYTICS REPORT');
  console.log('='.repeat(60));
  console.log(`\nGenerated: ${new Date().toLocaleString()}`);
  
  console.log('\n📈 OVERALL STATS');
  console.log('-'.repeat(40));
  console.log(`Total Clicks:   ${summary.summary.totalClicks.toLocaleString()}`);
  console.log(`Total Views:    ${summary.summary.totalViews.toLocaleString()}`);
  console.log(`Conversion:     ${summary.summary.conversionRate}`);
  console.log(`Last 30 Days:   ${summary.recentClicks} clicks`);
  
  console.log('\n🏆 TOP PERFORMERS');
  console.log('-'.repeat(40));
  console.log(`Top Vendor:     ${summary.topVendor}`);
  console.log(`Top Category:   ${summary.topCategory}`);
  
  console.log('\n📊 CLICKS BY VENDOR');
  console.log('-'.repeat(40));
  const vendors = Object.entries(summary.clicksByVendor)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  vendors.forEach(([vendor, clicks]) => {
    console.log(`${vendor.padEnd(20)} ${clicks.toString().padStart(5)} clicks`);
  });
  
  console.log('\n📦 CLICKS BY CATEGORY');
  console.log('-'.repeat(40));
  const categories = Object.entries(summary.clicksByCategory)
    .sort((a, b) => b[1] - a[1]);
  categories.forEach(([category, clicks]) => {
    console.log(`${category.padEnd(20)} ${clicks.toString().padStart(5)} clicks`);
  });
  
  console.log('\n🔥 TOP 10 PRODUCTS');
  console.log('-'.repeat(60));
  summary.topProducts.forEach((product, i) => {
    console.log(`${(i + 1).toString().padStart(2)}. ${product.name.substring(0, 40)}`);
    console.log(`    ${product.vendor} | ${product.category} | ${product.clicks} clicks`);
  });
  
  console.log('\n' + '='.repeat(60));
  
  return summary;
}

// Export for use in other scripts
module.exports = {
  recordClick,
  recordView,
  getSummary,
  generateReport,
  loadData
};

// Run report if called directly
if (require.main === module) {
  generateReport();
}
