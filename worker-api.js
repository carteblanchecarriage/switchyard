// Cloudflare Workers Edge API
// Fetches fresh data from vendors in real-time

const VENDOR_ENDPOINTS = {
  'drop': 'https://drop.com/api/search?query=mechanical+keyboard',
  'keychron': 'https://www.keychron.com/collections/all/products.json',
  'cannonkeys': 'https://cannonkeys.com/collections/all/products.json',
  'divinikey': 'https://divinikey.com/collections/all/products.json',
  'novelkeys': 'https://novelkeys.com/products.json'
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    
    try {
      // Health check
      if (url.pathname === '/health') {
        return jsonResponse({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          source: 'edge-api'
        });
      }
      
      // Get cached data from KV or fetch fresh
      const products = await getProducts(env, ctx);
      
      // Routes
      if (url.pathname === '/api/products') {
        return jsonResponse({
          data: products,
          count: products.length,
          cached: false,
          timestamp: new Date().toISOString()
        });
      }
      
      if (url.pathname === '/api/search') {
        const query = url.searchParams.get('q')?.toLowerCase() || '';
        const results = products.filter(p => 
          p.name?.toLowerCase().includes(query) ||
          p.vendor?.toLowerCase().includes(query)
        );
        return jsonResponse({
          data: results,
          count: results.length,
          query
        });
      }
      
      if (url.pathname === '/api/vendors') {
        const vendors = [...new Set(products.map(p => p.vendor))].sort();
        return jsonResponse({ vendors, count: vendors.length });
      }
      
      // Static file fallback
      return env.ASSETS ? env.ASSETS.fetch(request) : jsonResponse({ error: 'Not found' }, 404);
      
    } catch (error) {
      return jsonResponse({ error: error.message, stack: error.stack }, 500);
    }
  }
};

async function getProducts(env, ctx) {
  // Try KV cache first (5 minute TTL)
  const cached = env.PRODUCTS_KV ? await env.PRODUCTS_KV.get('products', 'json') : null;
  
  if (cached && cached.timestamp) {
    const age = Date.now() - new Date(cached.timestamp).getTime();
    if (age < 5 * 60 * 1000) { // 5 minutes
      return cached.products;
    }
  }
  
  // Fallback to static data.json stored in worker
  const staticData = await fetch('https://raw.githubusercontent.com/carteblanchecarriage/keebshelf/master/data.json');
  if (staticData.ok) {
    const data = await staticData.json();
    const products = data.allProducts || [];
    
    // Store in KV if available
    if (env.PRODUCTS_KV) {
      ctx.waitUntil(
        env.PRODUCTS_KV.put('products', JSON.stringify({
          products,
          timestamp: new Date().toISOString()
        }), { expirationTtl: 300 })
      );
    }
    
    return products;
  }
  
  return [];
}

async function scrapeVendor(vendor, url) {
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 300 }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    // Parse based on vendor format
    return parseProducts(data, vendor);
  } catch (e) {
    console.error(`Failed to scrape ${vendor}:`, e.message);
    return [];
  }
}

function parseProducts(data, vendor) {
  // Basic parsing - customize per vendor
  const products = [];
  
  if (data.products) {
    products.push(...data.products.map(p => ({
      id: p.id || p.handle,
      name: p.title || p.name,
      vendor: vendor,
      price: p.variants?.[0]?.price || p.price,
      url: p.url || p.handle,
      image: p.images?.[0]?.src || p.image,
      category: 'keyboard'
    })));
  }
  
  return products;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
