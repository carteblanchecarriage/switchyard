/**
 * Switchyard Analytics Worker
 * Cloudflare Worker for tracking and dashboard
 * 
 * Routes:
 *   POST /track - Record click/view/search events
 *   GET /dashboard - View analytics dashboard
 *   GET /api/summary - JSON summary data
 *   GET /api/events - Raw event data (paginated)
 */

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

// KV namespace binding (set in wrangler.toml)
// ANALYTICS_KV = { binding = "ANALYTICS_KV" }

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route: Track events
      if (path === '/track' && request.method === 'POST') {
        return await handleTrack(request, env);
      }

      // Route: Dashboard HTML
      if (path === '/dashboard' || path === '/') {
        return await handleDashboard(env);
      }

      // Route: API Summary
      if (path === '/api/summary') {
        return await handleSummary(env, url);
      }

      // Route: API Events (paginated)
      if (path === '/api/events') {
        return await handleEvents(env, url);
      }

      // Route: Health check
      if (path === '/health') {
        return jsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ error: error.message }, { status: 500 });
    }
  }
};

// Handle tracking endpoint
async function handleTrack(request, env) {
  // Rate limiting - check CF-Connecting-IP
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const rateKey = `rate:${ip}:${Math.floor(Date.now() / 60000)}`; // per minute
  
  const currentRequests = parseInt(await env.ANALYTICS_KV.get(rateKey) || '0');
  if (currentRequests > 100) {
    return jsonResponse({ error: 'Rate limit exceeded' }, { status: 429 });
  }
  
  await env.ANALYTICS_KV.put(rateKey, (currentRequests + 1).toString(), { expirationTtl: 120 });

  // Parse request body
  let data;
  try {
    data = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Validate required fields
  if (!data.type || !['click', 'view', 'search', 'affiliate_click'].includes(data.type)) {
    return jsonResponse({ error: 'Invalid or missing event type' }, { status: 400 });
  }

  // Create event record
  const event = {
    id: crypto.randomUUID(),
    type: data.type,
    product: data.product || null,
    vendor: data.vendor || null,
    category: data.category || null,
    price: data.price || null,
    query: data.query || null,
    result_count: data.result_count || null,
    page: data.page || '/',
    referrer: data.referrer || null,
    user_agent: request.headers.get('User-Agent') || null,
    ip: ip,
    country: request.cf?.country || null,
    timestamp: new Date().toISOString()
  };

  // Store in KV with day-based key for easy aggregation
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const hour = new Date().getHours();
  
  // Store raw event
  const eventKey = `event:${date}:${hour}:${event.id}`;
  await env.ANALYTICS_KV.put(eventKey, JSON.stringify(event), { expirationTtl: 2592000 }); // 30 days

  // Update daily counters
  await incrementCounter(env, `clicks:${date}`, event.type === 'click' || event.type === 'affiliate_click');
  await incrementCounter(env, `views:${date}`, event.type === 'view');
  await incrementCounter(env, `searches:${date}`, event.type === 'search');
  
  // Track top vendors
  if (event.vendor) {
    await incrementCounter(env, `vendor:${date}:${event.vendor}`, true);
  }
  
  // Track top products
  if (event.product) {
    const productKey = event.product.substring(0, 50); // Limit key length
    await incrementCounter(env, `product:${date}:${productKey}`, true);
  }

  return jsonResponse({ success: true, event_id: event.id });
}

// Handle dashboard
async function handleDashboard(env) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Switchyard Analytics</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a1a; 
      color: #fff; 
      line-height: 1.6;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; color: #c4a35a; }
    .subtitle { color: #888; margin-bottom: 2rem; }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: #2a2a2a;
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #333;
      transition: transform 0.2s;
    }
    
    .stat-card:hover { transform: translateY(-2px); border-color: #c4a35a; }
    .stat-value { font-size: 2.5rem; font-weight: bold; color: #c4a35a; }
    .stat-label { color: #888; font-size: 0.875rem; margin-top: 5px; }
    .stat-change { font-size: 0.75rem; margin-top: 5px; }
    .stat-change.up { color: #4ade80; }
    .stat-change.down { color: #f87171; }
    
    .section {
      background: #2a2a2a;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid #333;
    }
    
    h2 { font-size: 1.25rem; margin-bottom: 1rem; color: #fff; }
    
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #333; }
    th { color: #888; font-weight: 500; font-size: 0.75rem; text-transform: uppercase; }
    tr:hover { background: rgba(196, 163, 90, 0.05); }
    
    .bar-container { 
      display: flex; 
      align-items: center; 
      gap: 10px; 
      margin: 8px 0; 
    }
    .bar-label { width: 120px; font-size: 0.875rem; }
    .bar-wrapper { flex: 1; height: 8px; background: #333; border-radius: 4px; overflow: hidden; }
    .bar { height: 100%; background: #c4a35a; border-radius: 4px; transition: width 0.3s; }
    .bar-value { width: 50px; text-align: right; font-size: 0.875rem; color: #888; }
    
    .loading { text-align: center; padding: 40px; color: #888; }
    .error { background: rgba(248, 113, 113, 0.1); border: 1px solid #f87171; color: #f87171; padding: 15px; border-radius: 8px; }
    
    .refresh-btn {
      background: #c4a35a;
      color: #1a1a1a;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      margin-bottom: 20px;
    }
    .refresh-btn:hover { background: #d4b36a; }
    
    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .bar-label { width: 80px; font-size: 0.75rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📊 Switchyard Analytics</h1>
    <p class="subtitle">Real-time tracking dashboard</p>
    
    <button class="refresh-btn" onclick="loadData()">🔄 Refresh</button>
    
    <div id="loading" class="loading">Loading analytics data...</div>
    <div id="error" class="error" style="display: none;"></div>
    
    <div id="content" style="display: none;">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value" id="totalClicks">-</div>
          <div class="stat-label">Total Clicks</div>
          <div class="stat-change" id="clicksChange">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="totalViews">-</div>
          <div class="stat-label">Product Views</div>
          <div class="stat-change" id="viewsChange">-</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="conversionRate">-</div>
          <div class="stat-label">Conversion Rate</div>
        </div>
        <div class="stat-card">
          <div class="stat-value" id="totalSearches">-</div>
          <div class="stat-label">Searches</div>
          <div class="stat-change" id="searchesChange">-</div>
        </div>
      </div>
      
      <div class="section">
        <h2>🏆 Top Vendors</h2>
        <div id="vendorsList"></div>
      </div>
      
      <div class="section">
        <h2>🔥 Top Products</h2>
        <div id="productsList"></div>
      </div>
      
      <div class="section">
        <h2>⏰ Recent Activity</h2>
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Vendor</th>
              <th>Product/Query</th>
            </tr>
          </thead>
          <tbody id="recentActivity"></tbody>
        </table>
      </div>
    </div>
  </div>
  
  <script>
    async function loadData() {
      document.getElementById('loading').style.display = 'block';
      document.getElementById('error').style.display = 'none';
      document.getElementById('content').style.display = 'none';
      
      try {
        const response = await fetch('/api/summary?days=7');
        if (!response.ok) throw new Error('Failed to load data');
        
        const data = await response.json();
        renderDashboard(data);
      } catch (err) {
        document.getElementById('error').textContent = 'Error: ' + err.message;
        document.getElementById('error').style.display = 'block';
        document.getElementById('loading').style.display = 'none';
      }
    }
    
    function renderDashboard(data) {
      document.getElementById('loading').style.display = 'none';
      document.getElementById('content').style.display = 'block';
      
      // Update stats
      document.getElementById('totalClicks').textContent = data.totalClicks.toLocaleString();
      document.getElementById('totalViews').textContent = data.totalViews.toLocaleString();
      document.getElementById('conversionRate').textContent = data.conversionRate + '%';
      document.getElementById('totalSearches').textContent = data.totalSearches.toLocaleString();
      
      // Update changes
      document.getElementById('clicksChange').textContent = (data.clicksChange >= 0 ? '+' : '') + data.clicksChange + '% vs last period';
      document.getElementById('clicksChange').className = 'stat-change ' + (data.clicksChange >= 0 ? 'up' : 'down');
      
      // Render vendors
      const vendorsHtml = data.topVendors.map((v, i) => {
        const percent = (v.count / data.maxVendorCount * 100).toFixed(1);
        return \`
          <div class="bar-container">
            <div class="bar-label">\${v.name}</div>
            <div class="bar-wrapper"><div class="bar" style="width: \${percent}%"></div></div>
            <div class="bar-value">\${v.count}</div>
          </div>
        \`;
      }).join('');
      document.getElementById('vendorsList').innerHTML = vendorsHtml || '<p style="color: #888;">No data yet</p>';
      
      // Render products
      const productsHtml = data.topProducts.map((p, i) => {
        const percent = (p.count / data.maxProductCount * 100).toFixed(1);
        return \`
          <div class="bar-container">
            <div class="bar-label" title="\${p.name}">\${p.name.substring(0, 25)}\${p.name.length > 25 ? '...' : ''}</div>
            <div class="bar-wrapper"><div class="bar" style="width: \${percent}%"></div></div>
            <div class="bar-value">\${p.count}</div>
          </div>
        \`;
      }).join('');
      document.getElementById('productsList').innerHTML = productsHtml || '<p style="color: #888;">No data yet</p>';
      
      // Render recent activity
      const activityHtml = data.recentEvents.map(e => {
        const time = new Date(e.timestamp).toLocaleTimeString();
        const display = e.product || e.query || '-';
        return \`
          <tr>
            <td>\${time}</td>
            <td>\${e.type}</td>
            <td>\${e.vendor || '-'}</td>
            <td>\${display.substring(0, 40)}</td>
          </tr>
        \`;
      }).join('');
      document.getElementById('recentActivity').innerHTML = activityHtml || '<tr><td colspan="4" style="text-align: center; color: #888;">No recent activity</td></tr>';
    }
    
    // Load on page load
    loadData();
    
    // Auto-refresh every 30 seconds
    setInterval(loadData, 30000);
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html', ...corsHeaders }
  });
}

// Handle API summary
async function handleSummary(env, url) {
  const days = parseInt(url.searchParams.get('days') || '7');
  const today = new Date().toISOString().split('T')[0];
  
  // Get all dates in range
  const dates = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  
  // Aggregate data
  let totalClicks = 0, totalViews = 0, totalSearches = 0;
  let prevClicks = 0, prevViews = 0, prevSearches = 0;
  
  const vendorCounts = {};
  const productCounts = {};
  
  for (const date of dates) {
    const clicks = parseInt(await env.ANALYTICS_KV.get(`clicks:${date}`) || '0');
    const views = parseInt(await env.ANALYTICS_KV.get(`views:${date}`) || '0');
    const searches = parseInt(await env.ANALYTICS_KV.get(`searches:${date}`) || '0');
    
    totalClicks += clicks;
    totalViews += views;
    totalSearches += searches;
    
    // Get vendors for this date
    const vendorKeys = await env.ANALYTICS_KV.list({ prefix: `vendor:${date}:` });
    for (const key of vendorKeys.keys) {
      const vendor = key.name.split(':')[2];
      const count = parseInt(await env.ANALYTICS_KV.get(key.name) || '0');
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + count;
    }
    
    // Get products for this date
    const productKeys = await env.ANALYTICS_KV.list({ prefix: `product:${date}:` });
    for (const key of productKeys.keys) {
      const product = key.name.split(':').slice(2).join(':');
      const count = parseInt(await env.ANALYTICS_KV.get(key.name) || '0');
      productCounts[product] = (productCounts[product] || 0) + count;
    }
  }
  
  // Calculate previous period for comparison
  for (let i = days; i < days * 2; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split('T')[0];
    prevClicks += parseInt(await env.ANALYTICS_KV.get(`clicks:${date}`) || '0');
    prevViews += parseInt(await env.ANALYTICS_KV.get(`views:${date}`) || '0');
    prevSearches += parseInt(await env.ANALYTICS_KV.get(`searches:${date}`) || '0');
  }
  
  const clicksChange = prevClicks > 0 ? Math.round(((totalClicks - prevClicks) / prevClicks) * 100) : 0;
  const viewsChange = prevViews > 0 ? Math.round(((totalViews - prevViews) / prevViews) * 100) : 0;
  
  const conversionRate = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(2) : '0.00';
  
  // Get recent events
  const recentEvents = [];
  for (const date of dates.slice(0, 2)) { // Last 2 days
    const eventKeys = await env.ANALYTICS_KV.list({ prefix: `event:${date}:` });
    for (const key of eventKeys.keys.slice(0, 20)) {
      const event = JSON.parse(await env.ANALYTICS_KV.get(key.name));
      recentEvents.push(event);
    }
  }
  
  recentEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  const topVendors = Object.entries(vendorCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const topProducts = Object.entries(productCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return jsonResponse({
    totalClicks,
    totalViews,
    totalSearches,
    conversionRate,
    clicksChange,
    viewsChange,
    topVendors,
    topProducts,
    maxVendorCount: Math.max(...topVendors.map(v => v.count), 1),
    maxProductCount: Math.max(...topProducts.map(p => p.count), 1),
    recentEvents: recentEvents.slice(0, 20)
  });
}

// Handle API events
async function handleEvents(env, url) {
  const cursor = url.searchParams.get('cursor');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  
  const options = { prefix: 'event:', limit };
  if (cursor) options.cursor = cursor;
  
  const list = await env.ANALYTICS_KV.list(options);
  const events = [];
  
  for (const key of list.keys) {
    const event = JSON.parse(await env.ANALYTICS_KV.get(key.name));
    events.push(event);
  }
  
  return jsonResponse({
    events,
    cursor: list.cursor,
    complete: !list.cursor
  });
}

// Helper: JSON response with CORS
function jsonResponse(data, init = {}) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
      ...(init.headers || {})
    },
    ...init
  });
}

// Helper: Increment counter in KV
async function incrementCounter(env, key, shouldIncrement) {
  if (!shouldIncrement) return;
  
  try {
    const current = parseInt(await env.ANALYTICS_KV.get(key) || '0');
    await env.ANALYTICS_KV.put(key, (current + 1).toString(), { expirationTtl: 2592000 });
  } catch (e) {
    console.error('Failed to increment counter:', e);
  }
}