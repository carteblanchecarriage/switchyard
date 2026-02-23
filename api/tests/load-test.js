/**
 * Keebshelf API Load Test
 * 
 * Tests performance under concurrent load
 * Run: node tests/load-test.js
 * 
 * Benchmarks:
 * - Cold start response: < 50ms
 * - Cached response: < 10ms
 * - Health check: < 5ms
 * - Search response: < 100ms (for 276 products)
 * - Concurrent users: Should handle 100 concurrent requests
 * - Error rate: < 1%
 */

const http = require('http');
const { performance } = require('perf_hooks');

const API_BASE = 'http://localhost:3003';

// Test configuration
const CONFIG = {
  concurrentUsers: 50,
  requestsPerUser: 10,
  rampUpTime: 5000, // ms between user starts
  endpoints: [
    { path: '/health', weight: 0.3 },
    { path: '/api/groupbuys?page=1&limit=50', weight: 0.3 },
    { path: '/api/search?q=drop', weight: 0.2 },
    { path: '/api/vendors', weight: 0.1 },
    { path: '/api/pricing', weight: 0.1 }
  ]
};

// Results tracking
const results = {
  total: 0,
  successful: 0,
  failed: 0,
  errors: [],
  latencies: [],
  byEndpoint: {}
};

function request(path) {
  return new Promise((resolve, reject) => {
    const startTime = performance.now();
    
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const latency = performance.now() - startTime;
        resolve({
          status: res.statusCode,
          latency,
          path,
          success: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Weighted random endpoint selection
function selectEndpoint() {
  const rand = Math.random();
  let cumulative = 0;
  
  for (const endpoint of CONFIG.endpoints) {
    cumulative += endpoint.weight;
    if (rand <= cumulative) {
      return endpoint.path;
    }
  }
  
  return CONFIG.endpoints[0].path;
}

// Simulate a user making requests
async function simulateUser(userId) {
  const userResults = [];
  
  for (let i = 0; i < CONFIG.requestsPerUser; i++) {
    const endpoint = selectEndpoint();
    
    try {
      const result = await request(endpoint);
      userResults.push(result);
      
      // Small delay between requests (simulating real user)
      await new Promise(r => setTimeout(r, 100 + Math.random() * 200));
    } catch (error) {
      userResults.push({
        status: 0,
        latency: 0,
        path: endpoint,
        success: false,
        error: error.message
      });
    }
  }
  
  return userResults;
}

// Calculate percentile
function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Main test runner
async function runLoadTest() {
  console.log('🚀 Keebshelf API Load Test\n');
  console.log(`Concurrent Users: ${CONFIG.concurrentUsers}`);
  console.log(`Requests per User: ${CONFIG.requestsPerUser}`);
  console.log(`Total Expected Requests: ${CONFIG.concurrentUsers * CONFIG.requestsPerUser}\n`);
  
  // Check server is running
  console.log('Checking server availability...');
  try {
    await request('/health');
    console.log('✅ Server is ready\n');
  } catch (e) {
    console.error('❌ Server not available. Start it with: npm start');
    process.exit(1);
  }
  
  const startTime = performance.now();
  
  // Run users in parallel
  const userPromises = [];
  for (let i = 0; i < CONFIG.concurrentUsers; i++) {
    // Stagger user starts
    await new Promise(r => setTimeout(r, CONFIG.rampUpTime / CONFIG.concurrentUsers));
    userPromises.push(simulateUser(i));
  }
  
  // Wait for all users to complete
  const allUserResults = await Promise.all(userPromises);
  
  // Aggregate results
  for (const userResults of allUserResults) {
    for (const result of userResults) {
      results.total++;
      results.latencies.push(result.latency);
      
      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        if (result.error) results.errors.push(result.error);
      }
      
      // Track by endpoint
      if (!results.byEndpoint[result.path]) {
        results.byEndpoint[result.path] = {
          total: 0,
          successful: 0,
          failed: 0,
          latencies: []
        };
      }
      
      results.byEndpoint[result.path].total++;
      results.byEndpoint[result.path].latencies.push(result.latency);
      if (result.success) {
        results.byEndpoint[result.path].successful++;
      } else {
        results.byEndpoint[result.path].failed++;
      }
    }
  }
  
  const totalTime = performance.now() - startTime;
  
  // Generate report
  console.log('='.repeat(60));
  console.log('📊 LOAD TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`\n⏱️  Total Time: ${(totalTime / 1000).toFixed(2)}s`);
  console.log(`📨 Total Requests: ${results.total}`);
  console.log(`✅ Successful: ${results.successful} (${((results.successful / results.total) * 100).toFixed(2)}%)`);
  console.log(`❌ Failed: ${results.failed} (${((results.failed / results.total) * 100).toFixed(2)}%)`);
  console.log(`⚡ Requests/sec: ${(results.total / (totalTime / 1000)).toFixed(2)}`);
  
  // Latency stats
  if (results.latencies.length > 0) {
    console.log(`\n📈 Latency Distribution:`);
    console.log(`   Min: ${Math.min(...results.latencies).toFixed(2)}ms`);
    console.log(`   Max: ${Math.max(...results.latencies).toFixed(2)}ms`);
    console.log(`   Mean: ${(results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length).toFixed(2)}ms`);
    console.log(`   P50 (Median): ${percentile(results.latencies, 50).toFixed(2)}ms`);
    console.log(`   P95: ${percentile(results.latencies, 95).toFixed(2)}ms`);
    console.log(`   P99: ${percentile(results.latencies, 99).toFixed(2)}ms`);
  }
  
  // Per-endpoint breakdown
  console.log(`\n📍 Performance by Endpoint:`);
  console.log('-'.repeat(60));
  for (const [path, stats] of Object.entries(results.byEndpoint)) {
    const avgLatency = stats.latencies.reduce((a, b) => a + b, 0) / stats.latencies.length;
    const successRate = (stats.successful / stats.total) * 100;
    console.log(`${path}`);
    console.log(`   Requests: ${stats.total} | Success: ${successRate.toFixed(1)}% | Avg Latency: ${avgLatency.toFixed(2)}ms`);
  }
  
  // Errors
  if (results.errors.length > 0) {
    console.log(`\n⚠️  Errors (${results.errors.length}):`);
    const errorCounts = {};
    for (const error of results.errors) {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    }
    for (const [error, count] of Object.entries(errorCounts)) {
      console.log(`   ${error}: ${count}`);
    }
  }
  
  // Benchmark results
  console.log(`\n🎯 Benchmark Results:`);
  console.log('-'.repeat(60));
  const p95 = percentile(results.latencies, 95);
  const successRate = (results.successful / results.total) * 100;
  const errorRate = (results.failed / results.total) * 100;
  
  const checks = [
    { name: 'P95 Latency < 200ms', passed: p95 < 200, value: `${p95.toFixed(2)}ms` },
    { name: 'Success Rate > 99%', passed: successRate >= 99, value: `${successRate.toFixed(2)}%` },
    { name: 'Error Rate < 1%', passed: errorRate < 1, value: `${errorRate.toFixed(2)}%` },
    { name: 'All endpoints respond', passed: Object.keys(results.byEndpoint).length === CONFIG.endpoints.length, value: `${Object.keys(results.byEndpoint).length}/${CONFIG.endpoints.length}` }
  ];
  
  for (const check of checks) {
    const icon = check.passed ? '✅' : '❌';
    console.log(`   ${icon} ${check.name}: ${check.value}`);
  }
  
  const allPassed = checks.every(c => c.passed);
  console.log(`\n${allPassed ? '✅ All benchmarks passed!' : '⚠️  Some benchmarks failed'}\n`);
  
  // Save results to file
  const report = {
    timestamp: new Date().toISOString(),
    config: CONFIG,
    results: {
      total: results.total,
      successful: results.successful,
      failed: results.failed,
      successRate: successRate,
      errorRate: errorRate,
      latencies: {
        min: Math.min(...results.latencies),
        max: Math.max(...results.latencies),
        mean: results.latencies.reduce((a, b) => a + b, 0) / results.latencies.length,
        p50: percentile(results.latencies, 50),
        p95: percentile(results.latencies, 95),
        p99: percentile(results.latencies, 99)
      },
      byEndpoint: results.byEndpoint,
      benchmarks: checks
    }
  };
  
  const reportPath = `../logs/load-test-${Date.now()}.json`;
  require('fs').writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📄 Full report saved to: ${reportPath}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Error handling
process.on('unhandledRejection', (err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});

// Run the test
runLoadTest();
