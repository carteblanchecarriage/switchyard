// Cloudflare Workers API for Switchyard
// Simplified version of Express API

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    try {
      // Health check
      if (path === '/health') {
        return jsonResponse({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }, corsHeaders);
      }
      
      // Load data from KV or fallback to GitHub
      const data = await loadData(env);
      
      // API Routes
      if (path === '/api/products' || path === '/api/groupbuys') {
        return jsonResponse({
          data: data.allProducts || [],
          count: (data.allProducts || []).length,
          meta: { timestamp: new Date().toISOString() }
        }, corsHeaders);
      }
      
      if (path === '/api/search') {
        const query = url.searchParams.get('q')?.toLowerCase() || '';
        const products = data.allProducts || [];
        const results = products.filter(p => 
          p.name?.toLowerCase().includes(query) ||
          p.vendor?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
        );
        return jsonResponse({
          data: results,
          count: results.length,
          query
        }, corsHeaders);
      }
      
      // 404 for unknown routes
      return jsonResponse({ error: 'Not found' }, corsHeaders, 404);
      
    } catch (error) {
      return jsonResponse({ error: error.message }, corsHeaders, 500);
    }
  }
};

async function loadData(env) {
  // Try KV first (if configured)
  if (env.KEYBOARD_DATA) {
    const cached = await env.KEYBOARD_DATA.get('data');
    if (cached) return JSON.parse(cached);
  }
  
  // Fallback: fetch from static site
  const response = await fetch('https://switchyard-site.pages.dev/data.json');
  if (!response.ok) throw new Error('Failed to load data');
  
  const data = await response.json();
  
  // Cache in KV if available
  if (env.KEYBOARD_DATA) {
    await env.KEYBOARD_DATA.put('data', JSON.stringify(data), { expirationTtl: 3600 });
  }
  
  return data;
}

function jsonResponse(data, headers, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' }
  });
}
