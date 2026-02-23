const http = require('http');

// Test configuration
const API_BASE = 'http://localhost:3003';
const TESTS = [];

// Simple HTTP request helper
function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3003,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test framework
function test(name, fn) {
  TESTS.push({ name, fn });
}

async function runTests() {
  console.log('\n🧪 Keebshelf API Test Suite\n');
  let passed = 0;
  let failed = 0;
  
  // Wait for server to be ready
  console.log('Waiting for server...');
  let serverReady = false;
  for (let i = 0; i < 10; i++) {
    try {
      await request('/health');
      serverReady = true;
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  if (!serverReady) {
    console.error('❌ Server not available. Start it with: node api/index-v2.js');
    process.exit(1);
  }
  console.log('✅ Server is ready\n');
  
  // Run all tests
  for (const { name, fn } of TESTS) {
    try {
      await fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}`);
      console.log(`   ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  console.log(failed > 0 ? '\n⚠️ Some tests failed' : '\n🎉 All tests passed!');
  process.exit(failed > 0 ? 1 : 0);
}

// ===================== TESTS =====================

// Health endpoint
test('Health endpoint returns 200', async () => {
  const res = await request('/health');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!res.body.success) throw new Error('Expected success: true');
});

test('Health endpoint has required fields', async () => {
  const res = await request('/health');
  const data = res.body.data;
  if (!data.status) throw new Error('Missing status field');
  if (!data.uptime) throw new Error('Missing uptime field');
  if (!data.timestamp) throw new Error('Missing timestamp field');
  if (!data.version) throw new Error('Missing version field');
});

// Rate limiting
test('Rate limit headers are present', async () => {
  const res = await request('/health');
  if (!res.headers['x-ratelimit-limit']) throw new Error('Missing X-RateLimit-Limit header');
  if (!res.headers['x-ratelimit-remaining']) throw new Error('Missing X-RateLimit-Remaining header');
  if (!res.headers['x-ratelimit-reset']) throw new Error('Missing X-RateLimit-Reset header');
});

test('Security headers are present', async () => {
  const res = await request('/health');
  if (!res.headers['x-content-type-options']) throw new Error('Missing X-Content-Type-Options header');
  if (!res.headers['x-frame-options']) throw new Error('Missing X-Frame-Options header');
});

// Group buys endpoint
test('Group buys endpoint returns paginated data', async () => {
  const res = await request('/api/groupbuys');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!res.body.success) throw new Error('Expected success: true');
  if (!res.body.meta.pagination) throw new Error('Missing pagination metadata');
  if (!Array.isArray(res.body.data)) throw new Error('Data should be an array');
});

test('Group buys pagination works', async () => {
  const res = await request('/api/groupbuys?page=1&limit=10');
  const meta = res.body.meta.pagination;
  if (meta.page !== 1) throw new Error(`Page should be 1, got ${meta.page}`);
  if (meta.limit !== 10) throw new Error(`Limit should be 10, got ${meta.limit}`);
});

test('Group buys filtering by category works', async () => {
  const res = await request('/api/groupbuys?category=keyboard');
  const data = res.body.data;
  // All results should have category containing 'keyboard'
  const nonKeyboards = data.filter(item => !item.category?.toLowerCase().includes('keyboard'));
  if (nonKeyboards.length > 0) {
    throw new Error(`Found ${nonKeyboards.length} items not matching category filter`);
  }
});

// Search endpoint
test('Search requires query parameter', async () => {
  const res = await request('/api/search');
  if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  if (res.body.success !== false) throw new Error('Expected success: false');
});

test('Search requires minimum query length', async () => {
  const res = await request('/api/search?q=a');
  if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
});

test('Search returns results for valid query', async () => {
  const res = await request('/api/search?q=keyboard');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!res.body.data) throw new Error('Missing data in response');
  if (typeof res.body.data.total !== 'number') throw new Error('Missing total count');
});

// Interest checks
test('Interest checks endpoint works', async () => {
  const res = await request('/api/interest-checks');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!Array.isArray(res.body.data)) throw new Error('Data should be an array');
});

// Vendors
test('Vendors endpoint returns data', async () => {
  const res = await request('/api/vendors');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

// Pricing
test('Pricing endpoint returns tiers', async () => {
  const res = await request('/api/pricing');
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  if (!Array.isArray(res.body.data)) throw new Error('Data should be an array');
  if (res.body.data.length < 4) throw new Error('Expected at least 4 pricing tiers');
});

// 404 handling
test('Undefined routes return 404 with error response', async () => {
  const res = await request('/api/nonexistent');
  if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  if (res.body.success !== false) throw new Error('Expected success: false');
  if (!res.body.error.code) throw new Error('Error should have a code');
});

// Response structure
test('All successful responses have standardized format', async () => {
  const res = await request('/api/groupbuys');
  if (typeof res.body.success !== 'boolean') throw new Error('Missing success field');
  if (!res.body.timestamp) throw new Error('Missing timestamp field');
  if (!res.body.meta) throw new Error('Missing meta field');
  if (res.body.meta.apiVersion !== '2.0.0') throw new Error('Wrong API version');
});

// Error responses
test('Error responses have standardized format', async () => {
  const res = await request('/api/search?q=');
  if (!res.body.error) throw new Error('Missing error field');
  if (!res.body.error.code) throw new Error('Missing error.code field');
  if (!res.body.error.message) throw new Error('Missing error.message field');
});

test('404 responses include available routes', async () => {
  const res = await request('/api/nonexistent');
  if (!res.body.meta.availableRoutes) throw new Error('Missing availableRoutes in error response');
  if (!Array.isArray(res.body.meta.availableRoutes)) throw new Error('Available routes should be an array');
});

console.log('\n🚀 Starting test suite...');
console.log('Make sure the API server is running on port 3003\n');
runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
