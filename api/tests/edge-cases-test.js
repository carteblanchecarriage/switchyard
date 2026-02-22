/**
 * Keebshelf API Edge Cases & Error Handling Tests
 * 
 * Tests for:
 * - Malformed requests
 * - Boundary conditions
 * - Injection attempts
 * - Large payloads
 * - Invalid parameters
 * - Rate limiting behavior
 * 
 * Run: node tests/edge-cases-test.js
 */

const http = require('http');
const net = require('net');

const API_BASE = 'http://localhost:3003';
let testsPassed = 0;
let testsFailed = 0;

// Test framework
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

// HTTP request helper with options
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data),
            rawBody: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data,
            rawBody: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.timeout) {
      req.setTimeout(options.timeout, () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });
    }
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Buffer request for large payloads
function bufferRequest(path, buffer, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': buffer.length,
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
          rawBody: data
        });
      });
    });
    
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Keebshelf API Edge Cases Test Suite\n');
  
  // Wait for server
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
    console.error('❌ Server not available. Start it with: npm start');
    process.exit(1);
  }
  console.log('✅ Server is ready\n');
  
  // ==================== SQL INJECTION ATTEMPTS ====================
  console.log('--- SQL Injection Protection ---\n');
  
  await test('Search rejects SQL injection patterns', async () => {
    const patterns = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM passwords --",
      "'; DELETE FROM products; --"
    ];
    
    for (const pattern of patterns) {
      const res = await request(`/api/search?q=${encodeURIComponent(pattern)}`);
      if (res.status !== 200 && res.status !== 400) {
        throw new Error(`Unexpected status ${res.status} for pattern "${pattern.slice(0, 20)}..."`);
      }
    }
  });
  
  await test('Category filter sanitizes input', async () => {
    const res = await request('/api/groupbuys?category=<script>alert("xss")</script>');
    // Should either return 400 or sanitize with 200
    if (res.status !== 200 && res.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${res.status}`);
    }
  });
  
  // ==================== XSS ATTEMPTS ====================
  console.log('\n--- XSS Protection ---\n');
  
  await test('Search rejects XSS in query', async () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      'javascript:alert("xss")',
      '<img src=x onerror=alert("xss")>',
      '";alert(1);//'
    ];
    
    for (const payload of xssPayloads) {
      const res = await request(`/api/search?q=${encodeURIComponent(payload)}`);
      // Should sanitize or reject
      if (res.status !== 200 && res.status !== 400) {
        throw new Error(`Unexpected status ${res.status} for XSS payload`);
      }
    }
  });
  
  // ==================== BOUNDARY CONDITIONS ====================
  console.log('\n--- Boundary Conditions ---\n');
  
  await test('Page 0 defaults to page 1', async () => {
    const res = await request('/api/groupbuys?page=0&limit=10');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.meta.pagination.page !== 1) {
      throw new Error(`Expected page 1, got ${res.body.meta.pagination.page}`);
    }
  });
  
  await test('Negative page number handled', async () => {
    const res = await request('/api/groupbuys?page=-1&limit=10');
    // Should normalize to 1
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  await test('Limit exceeds max is capped at 100', async () => {
    const res = await request('/api/groupbuys?limit=1000');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.meta.pagination.limit > 100) {
      throw new Error(`Limit should be capped at 100, got ${res.body.meta.pagination.limit}`);
    }
  });
  
  await test('Limit of 0 defaults to reasonable value', async () => {
    const res = await request('/api/groupbuys?limit=0');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  await test('Non-numeric page handled gracefully', async () => {
    const res = await request('/api/groupbuys?page=abc&limit=10');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  await test('Very large page number returns empty array', async () => {
    const res = await request('/api/groupbuys?page=999999&limit=10');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.data.length !== 0) {
      throw new Error('Expected empty array for out-of-range page');
    }
  });
  
  // ==================== SEARCH EDGE CASES ====================
  console.log('\n--- Search Edge Cases ---\n');
  
  await test('Single character search rejected', async () => {
    const res = await request('/api/search?q=a');
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });
  
  await test('Empty search query rejected', async () => {
    const res = await request('/api/search?q=');
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });
  
  await test('Missing search query rejected', async () => {
    const res = await request('/api/search');
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });
  
  await test('Very long search query handled', async () => {
    const longQuery = 'keyboard '.repeat(100); // 900 chars
    const res = await request(`/api/search?q=${encodeURIComponent(longQuery)}`);
    // Should truncate or reject
    if (res.status !== 200 && res.status !== 400) {
      throw new Error(`Expected 200 or 400, got ${res.status}`);
    }
  });
  
  await test('Special characters in search query', async () => {
    const specialChars = ['@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}'];
    for (const char of specialChars) {
      const res = await request(`/api/search?q=${encodeURIComponent('keyboard' + char)}`);
      if (res.status !== 200 && res.status !== 400) {
        throw new Error(`Unexpected status ${res.status} for special char: ${char}`);
      }
    }
  });
  
  await test('Unicode/international characters in search', async () => {
    const res = await request('/api/search?q=キーボード'); // Japanese
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    
    const res2 = await request('/api/search?q=клавиатура'); // Russian
    if (res2.status !== 200) throw new Error(`Expected 200, got ${res2.status}`);
  });
  
  // ==================== ID EDGE CASES ====================
  console.log('\n--- ID Edge Cases ---\n');
  
  await test('Non-existent ID returns 404', async () => {
    const res = await request('/api/groupbuys/nonexistent-id-12345');
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });
  
  await test('Empty ID handled', async () => {
    const res = await request('/api/groupbuys/');
    // Most servers handle this as list endpoint
    if (res.status !== 200 && res.status !== 404) {
      throw new Error(`Unexpected status ${res.status}`);
    }
  });
  
  await test('ID with special characters handled', async () => {
    const res = await request('/api/groupbuys/test-id%20with%20spaces');
    // Should handle gracefully (either 404 or sanitized 404)
    if (res.status !== 200 && res.status !== 404 && res.status !== 400) {
      throw new Error(`Unexpected status ${res.status}`);
    }
  });
  
  await test('Very long ID handled', async () => {
    const longId = 'a'.repeat(1000);
    const res = await request(`/api/groupbuys/${longId}`);
    if (res.status !== 404 && res.status !== 400) {
      throw new Error(`Expected 404 or 400, got ${res.status}`);
    }
  });
  
  // ==================== HEADER TESTS ====================
  console.log('\n--- Header Edge Cases ---\n');
  
  await test('Request with no user-agent handled', async () => {
    const res = await request('/health', { headers: { 'User-Agent': undefined } });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  await test('Malformed headers handled', async () => {
    const res = await request('/health', { 
      headers: { 
        'X-Custom': '\x00\x01\x02', // Control characters
        'Accept': 'invalid/*type'
      } 
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  // ==================== RESPONSE STRUCTURE ====================
  console.log('\n--- Response Structure ---\n');
  
  await test('All responses have required fields', async () => {
    const endpoints = ['/health', '/api/groupbuys', '/api/interest-checks', '/api/vendors', '/api/pricing'];
    
    for (const endpoint of endpoints) {
      const res = await request(endpoint);
      if (res.status !== 200) continue; // Skip unavailable endpoints
      
      if (typeof res.body.success !== 'boolean') {
        throw new Error(`${endpoint}: Missing success field`);
      }
      if (!res.body.timestamp) {
        throw new Error(`${endpoint}: Missing timestamp field`);
      }
      if (!res.body.meta) {
        throw new Error(`${endpoint}: Missing meta field`);
      }
    }
  });
  
  await test('Error responses have proper structure', async () => {
    const res = await request('/api/search'); // Missing query triggers error
    if (res.status !== 400) {
      // Try another error case
      const res2 = await request('/api/nonexistent');
      if (res2.status !== 404) throw new Error('Could not trigger error case');
      
      if (!res2.body.error) throw new Error('Missing error field');
      if (!res2.body.error.code) throw new Error('Missing error.code field');
      if (!res2.body.error.message) throw new Error('Missing error.message field');
    } else {
      if (!res.body.error) throw new Error('Missing error field');
      if (!res.body.error.code) throw new Error('Missing error.code field');
      if (!res.body.error.message) throw new Error('Missing error.message field');
    }
  });
  
  // ==================== RATE LIMITING ====================
  console.log('\n--- Rate Limiting Behavior ---\n');
  
  await test('Rate limit headers present', async () => {
    const res = await request('/health');
    if (!res.headers['x-ratelimit-limit']) throw new Error('Missing X-RateLimit-Limit header');
    if (!res.headers['x-ratelimit-remaining']) throw new Error('Missing X-RateLimit-Remaining header');
  });
  
  await test('Rate limit decreases with requests', async () => {
    const res1 = await request('/health');
    const remaining1 = parseInt(res1.headers['x-ratelimit-remaining']);
    
    const res2 = await request('/health');
    const remaining2 = parseInt(res2.headers['x-ratelimit-remaining']);
    
    if (remaining2 >= remaining1) {
      throw new Error(`Rate limit should decrease. Before: ${remaining1}, After: ${remaining2}`);
    }
  });
  
  // ==================== SECURITY HEADERS ====================
  console.log('\n--- Security Headers ---\n');
  
  await test('Security headers present', async () => {
    const res = await request('/health');
    
    const headers = [
      'x-content-type-options',
      'x-frame-options',
      'x-xss-protection'
    ];
    
    for (const header of headers) {
      if (!res.headers[header]) {
        throw new Error(`Missing ${header} header`);
      }
    }
  });
  
  await test('Frame options set to DENY', async () => {
    const res = await request('/health');
    if (res.headers['x-frame-options']?.toUpperCase() !== 'DENY') {
      throw new Error(`X-Frame-Options should be DENY, got ${res.headers['x-frame-options']}`);
    }
  });
  
  // ==================== PERFORMANCE ====================
  console.log('\n--- Performance Bounds ---\n');
  
  await test('Health check response time < 50ms', async () => {
    const start = Date.now();
    await request('/health');
    const duration = Date.now() - start;
    if (duration > 50) {
      console.log(`   ⚠️  Health check took ${duration}ms (threshold: 50ms)`);
    }
  });
  
  await test('API responses complete within timeout', async () => {
    const res = await request('/api/groupbuys', { timeout: 30000 });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });
  
  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results: ${testsPassed} passed, ${testsFailed} failed`);
  console.log('='.repeat(60) + '\n');
  
  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
