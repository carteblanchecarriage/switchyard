// Simple Express server for analytics API
// This can be run locally to collect tracking data

const express = require('express');
const cors = require('cors');
const path = require('path');
const { recordClick, recordView, getSummary, generateReport } = require('./dashboard');

const app = express();
const PORT = process.env.PORT || 3456;

app.use(cors());
app.use(express.json());

// Track affiliate click
app.post('/track/click', (req, res) => {
  const { vendor, product, category, price } = req.body;
  
  if (!vendor || !product) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  recordClick(vendor, product, category, price);
  res.json({ success: true, message: 'Click recorded' });
});

// Track product view
app.post('/track/view', (req, res) => {
  const { vendor, product, category } = req.body;
  recordView(vendor, product, category);
  res.json({ success: true, message: 'View recorded' });
});

// Get analytics summary
app.get('/api/summary', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const summary = getSummary(days);
  res.json(summary);
});

// Serve dashboard HTML
app.get('/', (req, res) => {
  const summary = getSummary(30);
  const html = generateDashboardHTML(summary);
  res.send(html);
});

function generateDashboardHTML(summary) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Switchyard Analytics</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #1a1a1a; color: #fff; }
    h1, h2 { color: #fff; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat-card { background: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center; }
    .stat-value { font-size: 2em; font-weight: bold; color: #4CAF50; }
    .stat-label { color: #999; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
    th { background: #2a2a2a; color: #fff; }
    tr:hover { background: #333; }
    .chart { background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .bar { height: 20px; background: #4CAF50; margin: 2px 0; border-radius: 3px; }
    .vendor-bar { background: #2196F3; }
    .category-bar { background: #FF9800; }
  </style>
</head>
<body>
  <h1>📊 Switchyard Analytics</h1>
  <p>Last updated: ${new Date(summary.summary.lastUpdated).toLocaleString()}</p>
  
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${summary.summary.totalClicks.toLocaleString()}</div>
      <div class="stat-label">Total Clicks</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.summary.totalViews.toLocaleString()}</div>
      <div class="stat-label">Total Views</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.summary.conversionRate}</div>
      <div class="stat-label">Conversion Rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${summary.topVendor}</div>
      <div class="stat-label">Top Vendor</div>
    </div>
  </div>
  
  <h2>🏆 Top Products</h2>
  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Vendor</th>
        <th>Category</th>
        <th>Clicks</th>
      </tr>
    </thead>
    <tbody>
      ${summary.topProducts.map(p => `
        <tr>
          <td>${p.name}</td>
          <td>${p.vendor}</td>
          <td>${p.category}</td>
          <td>${p.clicks}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
    <div>
      <h2>📊 Clicks by Vendor</h2>
      ${Object.entries(summary.clicksByVendor)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([vendor, clicks]) => `
          <div class="chart">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>${vendor}</span>
              <span>${clicks} clicks</span>
            </div>
            <div class="bar vendor-bar" style="width: ${Math.min(100, (clicks / Math.max(...Object.values(summary.clicksByVendor))) * 100)}%"></div>
          </div>
        `).join('')}
    </div>
    
    <div>
      <h2>📦 Clicks by Category</h2>
      ${Object.entries(summary.clicksByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category, clicks]) => `
          <div class="chart">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span>${category}</span>
              <span>${clicks} clicks</span>
            </div>
            <div class="bar category-bar" style="width: ${Math.min(100, (clicks / Math.max(...Object.values(summary.clicksByCategory))) * 100)}%"></div>
          </div>
        `).join('')}
    </div>
  </div>
</body>
</html>
  `;
}

app.listen(PORT, () => {
  console.log(`📊 Analytics server running at http://localhost:${PORT}`);
});
