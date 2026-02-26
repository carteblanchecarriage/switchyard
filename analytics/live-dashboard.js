const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3456;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Track clicks
app.post('/analytics/track', (req, res) => {
  const dataFile = path.join(__dirname, 'data', 'tracking.json');
  
  // Load existing data
  let data = { clicks: [], views: [], searches: [] };
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {}
  
  // Add new data
  const entry = {
    timestamp: new Date().toISOString(),
    ...req.body
  };
  
  if (req.body.type === 'click') data.clicks.push(entry);
  if (req.body.type === 'view') data.views.push(entry);
  if (req.body.type === 'search') data.searches.push(entry);
  
  // Save
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  
  res.json({ success: true });
});

// Dashboard
app.get('/analytics', (req, res) => {
  const dataFile = path.join(__dirname, 'data', 'tracking.json');
  let data = { clicks: [], views: [], searches: [] };
  try {
    data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  } catch (e) {}
  
  // Summary
  const clicksByVendor = {};
  const clicksByProduct = {};
  const searches = {};
  
  data.clicks.forEach(c => {
    clicksByVendor[c.vendor] = (clicksByVendor[c.vendor] || 0) + 1;
    clicksByProduct[c.product] = (clicksByProduct[c.product] || 0) + 1;
  });
  
  data.searches.forEach(s => {
    searches[s.query] = (searches[s.query] || 0) + 1;
  });
  
  const topProducts = Object.entries(clicksByProduct)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Switchyard Analytics - LIVE</title>
  <meta http-equiv="refresh" content="10">
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: system-ui, -apple-system, sans-serif; 
      background: #0f0f0f; 
      color: #fff; 
      margin: 0;
      padding: 20px;
    }
    h1 { color: #4CAF50; margin: 0 0 10px 0; }
    .timestamp { color: #666; font-size: 14px; margin-bottom: 20px; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
    .stat { 
      background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
      padding: 25px; 
      border-radius: 12px; 
      text-align: center;
      border: 1px solid #333;
    }
    .stat-value { 
      font-size: 3em; 
      font-weight: 700; 
      color: #4CAF50;
      text-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    }
    .stat-label { color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 5px; }
    .tables { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      background: #1a1a1a;
      border-radius: 8px;
      overflow: hidden;
    }
    th { 
      background: #2a2a2a; 
      color: #4CAF50; 
      padding: 15px; 
      text-align: left;
      font-weight: 600;
    }
    td { 
      padding: 12px 15px; 
      border-bottom: 1px solid #333; 
      color: #ccc;
    }
    tr:hover td { background: #252525; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-green { background: rgba(76, 175, 80, 0.2); color: #4CAF50; }
    .badge-blue { background: rgba(33, 150, 243, 0.2); color: #2196F3; }
    .live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #4CAF50;
      font-size: 14px;
    }
    .live-dot {
      width: 8px;
      height: 8px;
      background: #4CAF50;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(1.2); }
    }
  </style>
</head>
<body>
  <h1>📊 Switchyard Analytics Dashboard</h1>
  <div class="timestamp">
    <span class="live-indicator">
      <span class="live-dot"></span>
      LIVE - Auto-refreshing every 10 seconds
    </span>
    <span style="margin-left: 20px; color: #666;">Last updated: ${new Date().toLocaleString()}</span>
  </div>
  
  <div class="grid">
    <div class="stat">
      <div class="stat-value">${data.clicks.length}</div>
      <div class="stat-label">Total Clicks</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.views.length}</div>
      <div class="stat-label">Product Views</div>
    </div>
    <div class="stat">
      <div class="stat-value">${data.searches.length}</div>
      <div class="stat-label">Searches</div>
    </div>
    <div class="stat">
      <div class="stat-value">${Object.keys(clicksByVendor).length}</div>
      <div class="stat-label">Active Vendors</div>
    </div>
  </div>
  
  <div class="tables">
    <div>
      <h2>🏆 Top Products</h2>
      <table>
        <thead>
          <tr><th>Product</th><th>Clicks</th></tr>
        </thead>
        <tbody>
          ${topProducts.length === 0 ? '<tr><td colspan="2" style="text-align:center;color:#666;">No clicks yet</td></tr>' : ''}
          ${topProducts.map(([product, clicks]) => `
            <tr>
              <td>${product.substring(0, 40)}${product.length > 40 ? '...' : ''}</td>
              <td><span class="badge badge-green">${clicks}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div>
      <h2>📊 Top Vendors</h2>
      <table>
        <thead>
          <tr><th>Vendor</th><th>Clicks</th></tr>
        </thead>
        <tbody>
          ${Object.entries(clicksByVendor).length === 0 ? '<tr><td colspan="2" style="text-align:center;color:#666;">No clicks yet</td></tr>' : ''}
          ${Object.entries(clicksByVendor).sort((a, b) => b[1] - a[1]).map(([vendor, clicks]) => `
            <tr>
              <td>${vendor}</td>
              <td><span class="badge badge-blue">${clicks}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
  
  <div style="margin-top: 30px;">
    <h2>🔍 Recent Searches</h2>
    <table>
      <thead>
        <tr><th>Search Term</th><th>Count</th></tr>
      </thead>
      <tbody>
        ${Object.entries(searches).length === 0 ? '<tr><td colspan="2" style="text-align:center;color:#666;">No searches yet</td></tr>' : ''}
        ${Object.entries(searches).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([query, count]) => `
          <tr>
            <td>${query}</td>
            <td><span class="badge badge-blue">${count}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
  
  <div style="margin-top: 30px; padding: 20px; background: #1a1a1a; border-radius: 8px;">
    <h3>🚀 Quick Setup</h3>
    <ol style="color: #888; line-height: 2;">
      <li>Visit your site: <a href="https://switchyard.club" style="color: #4CAF50;">https://switchyard.club</a></li>
      <li>Click on any product affiliate links</li>
      <li>This dashboard updates automatically every 10 seconds</li>
      <li>For Google Analytics: Add your GA4 ID to index.html</li>
    </ol>
  </div>
</body>
</html>
  `;
  
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(60));
  console.log('📊 SWITCHYARD ANALYTICS SERVER');
  console.log('='.repeat(60));
  console.log(`\nDashboard: http://localhost:${PORT}/analytics`);
  console.log(`Tracking Endpoint: http://localhost:${PORT}/analytics/track`);
  console.log(`\nThe dashboard auto-refreshes every 10 seconds.`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
