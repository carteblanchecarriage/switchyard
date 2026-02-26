#!/usr/bin/env node
/**
 * Quick analytics check - View results without dashboard
 * Usage: node view-results.js
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'tracking.json');

function loadData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return { clicks: [], views: [], searches: [] };
  }
}

function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function viewResults() {
  const data = loadData();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SWITCHYARD ANALYTICS - QUICK VIEW');
  console.log('='.repeat(60));
  console.log(`Last checked: ${new Date().toLocaleString()}`);
  console.log(`Data file: ${DATA_FILE}`);
  
  // Check if data exists
  const hasData = data.clicks.length > 0 || data.views.length > 0;
  
  if (!hasData) {
    console.log('\n⚠️  No data yet!');
    console.log('   Start clicking products to generate data.\n');
    console.log('   To see dashboard:');
    console.log('   ./start-analytics.sh');
    console.log('   open http://localhost:3456/analytics\n');
    return;
  }
  
  console.log('\n📈 OVERVIEW');
  console.log('-'.repeat(40));
  console.log(`Total Clicks:    ${data.clicks.length.toLocaleString()}`);
  console.log(`Product Views:   ${data.views.length.toLocaleString()}`);
  console.log(`Searches:        ${data.searches.length.toLocaleString()}`);
  
  if (data.clicks.length > 0 && data.views.length > 0) {
    const conversion = ((data.clicks.length / data.views.length) * 100).toFixed(2);
    console.log(`Conversion Rate: ${conversion}%`);
  }
  
  // Calculate tracking duration
  const allTimestamps = [
    ...data.clicks.map(c => new Date(c.timestamp)),
    ...data.views.map(v => new Date(v.timestamp))
  ].filter(t => !isNaN(t));
  
  if (allTimestamps.length > 0) {
    const earliest = new Date(Math.min(...allTimestamps));
    const duration = Date.now() - earliest.getTime();
    console.log(`Tracking for:    ${formatDuration(duration)}`);
  }
  
  // Group by vendor
  if (data.clicks.length > 0) {
    const byVendor = {};
    data.clicks.forEach(c => {
      byVendor[c.vendor] = (byVendor[c.vendor] || 0) + 1;
    });
    
    console.log('\n🏆 TOP VENDORS');
    console.log('-'.repeat(40));
    Object.entries(byVendor)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([vendor, count], i) => {
        const bar = '█'.repeat(Math.min(20, count));
        console.log(`${(i + 1).toString().padStart(2)}. ${vendor.padEnd(15)} ${count.toString().padStart(3)} ${bar}`);
      });
  }
  
  // Top products
  if (data.clicks.length > 0) {
    const byProduct = {};
    data.clicks.forEach(c => {
      const key = c.product.length > 30 ? c.product.substring(0, 30) + '...' : c.product;
      byProduct[key] = (byProduct[key] || 0) + 1;
    });
    
    console.log('\n🔥 TOP PRODUCTS');
    console.log('-'.repeat(60));
    Object.entries(byProduct)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([product, count], i) => {
        const bar = '█'.repeat(Math.min(20, count));
        console.log(`${(i + 1).toString().padStart(2)}. ${product.substring(0, 40).padEnd(42)} ${count.toString().padStart(3)} ${bar}`);
      });
  }
  
  // Recent searches
  if (data.searches.length > 0) {
    const byQuery = {};
    data.searches.forEach(s => {
      byQuery[s.query] = (byQuery[s.query] || 0) + 1;
    });
    
    console.log('\n🔍 RECENT SEARCHES');
    console.log('-'.repeat(40));
    Object.entries(byQuery)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .forEach(([query, count], i) => {
        console.log(`${(i + 1).toString().padStart(2)}. "${query}" ${count}×`);
      });
  }
  
  // Recent activity (last 5 clicks)
  if (data.clicks.length > 0) {
    console.log('\n⏰ RECENT ACTIVITY (Last 5 Clicks)');
    console.log('-'.repeat(60));
    const recent = [...data.clicks]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);
    
    recent.forEach(c => {
      const time = new Date(c.timestamp).toLocaleTimeString();
      const product = (c.product || 'Unknown').substring(0, 35);
      console.log(`${time} | ${c.vendor?.padEnd(12) || 'N/A'} | ${product}`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 What to do with this data:');
  console.log('   1. Feature top products on homepage');
  console.log('   2. Add more products from top vendors');
  console.log('   3. Create content for popular searches');
  console.log('   4. Check if high-click products are in stock');
  console.log('');
  console.log('📊 For full dashboard:');
  console.log('   ./start-analytics.sh');
  console.log('   http://localhost:3456/analytics');
  console.log('');
}

viewResults();
