#!/usr/bin/env node
/**
 * Quick API validation test
 * Tests basic functionality and response structure
 */

const http = require('http');

const PORT = 3003;
let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   ${error.message}`);
    testsFailed++;
  }
}

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Timeout')));
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 API Quality & Reliability Tests\n');
  
  // Wait for server
  let ready = false;
  for (let i = 0; i < 10; i++) {
    try {
      await request('/health');
      ready = true;
      break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  if (!ready) {
    console.error('❌ Server not available on port', PORT);
    process.exit(1);
  }
  console.log('✅ Server ready\n');
  
  // Test 1: Health endpoint
  await test('Health check returns 200', async () => {
    const res = await request('/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  // Test 2: Response structure
  await test('Response has success field', async () => {
    const res = await request('/health');
    if (typeof res.body.success !== 'boolean') {
      throw new Error('Missing success field');
    }
  });
  
  // Test 3: Rate limit headers
  await test('Rate limit headers present', async () => {
    const res = await request('/health');
    const headers = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset'];
    for (const h of headers) {
      if (!res.headers[h]) throw new Error(`Missing ${h}`);
    }
  });
  
  // Test 4: Security headers
  await test('Security headers present', async () => {
    const res = await request('/health');
    if (!res.headers['x-frame-options']) throw new Error('Missing X-Frame-Options');
    if (!res.headers['x-content-type-options']) throw new Error('Missing X-Content-Type-Options');
  });
  
  // Test 5: X-Frame-Options is DENY
  await test('X-Frame-Options is DENY', async () => {
    const res = await request('/health');
    if (res.headers['x-frame-options'] !== 'DENY') {
      throw new Error(`Expected DENY, got ${res.headers['x-frame-options']}`);
    }
  });
  
  // Test 6: Search validation
  await test('Single char search rejected (400)', async () => {
    const res = await request('/api/search?q=a');
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });
  
  // Test 7: Search with valid query
  await test('Search works with 2+ chars', async () => {
    const res = await request('/api/search?q=key');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  // Test 8: Pagination
  await test('Pagination returns correct structure', async () => {
    const res = await request('/api/groupbuys?page=1&limit=10');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.meta?.pagination) throw new Error('Missing pagination');
  });
  
  // Test 9: 404 for non-existent ID
  await test('404 for invalid ID', async () => {
    const res = await request('/api/groupbuys/nonexistent-id-123456');
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });
  
  // Test 10: 404 for unknown route
  await test('404 for unknown route', async () => {
    const res = await request('/api/unknown-route');
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });
  
  // Test 11: Error structure
  await test('Error responses have code and message', async () => {
    const res = await request('/api/search');
    if (!res.body.error?.code) throw new Error('Missing error.code');
    if (!res.body.error?.message) throw new Error('Missing error.message');
  });
  
  // Test 12: Response time
  await test('Response time < 100ms', async () => {
    const start = Date.now();
    await request('/health');
    const duration = Date.now() - start;
    if (duration > 100) throw new Error(`Took ${duration}ms`);
  });
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('='.repeat(50) + '\n');
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
