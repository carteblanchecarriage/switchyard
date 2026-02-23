#!/usr/bin/env node
/**
 * Keebshelf Link Health Checker
 * Validates all product URLs and reports broken links
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// All URLs from the collection
const urls = [
  // Products (Updated 2026-02-19)
  { name: 'Drop CTRL Keyboard', url: 'https://drop.com/mechanical-keyboards/drop-ctrl', type: 'product' },
  { name: 'Drop Holy Panda X', url: 'https://drop.com/switches/drop-holy-panda-x-mechanical-switches', type: 'product' },
  { name: 'Kono Kira Keyboard', url: 'https://kono.store/products/kono-kira', type: 'product' },
  { name: 'Keychron Q1 Pro', url: 'https://keychron.com/products/keychron-q1-pro', type: 'product' },
  { name: 'Kono x Gateron Yellow', url: 'https://kono.store/collections/switches', type: 'product' },
  { name: 'NovelKeys NK65', url: 'https://novelkeys.com/products/nk65-entry-edition', type: 'product' },
  { name: 'KBDfans Tofu60', url: 'https://kbdfans.com/collections/60-layout/products/tofu60', type: 'product' },
  { name: 'KBDfans MOMOKA Frosty', url: 'https://kbdfans.com/collections/keycaps/products/momoka-frosty', type: 'product' },
  
  // Proposals
  { name: 'Phantom TKL IC', url: 'https://geekhack.org/index.php?topic=122456.0', type: 'proposal' },
  { name: 'Vintage Beige IC', url: 'https://geekhack.org/index.php?topic=122345.0', type: 'proposal' },
  { name: 'Magnetic Switches IC', url: 'https://geekhack.org/index.php?topic=122789.0', type: 'proposal' },
  
  // Curators
  { name: 'Drop Store', url: 'https://drop.com', type: 'curator' },
  { name: 'Kono.store', url: 'https://kono.store', type: 'curator' },
  { name: 'NovelKeys', url: 'https://novelkeys.com', type: 'curator' },
  { name: 'Keychron', url: 'https://keychron.com', type: 'curator' },
  { name: 'KBDfans', url: 'https://kbdfans.com', type: 'curator' },
];

function checkUrl(urlData) {
  return new Promise((resolve) => {
    const url = new URL(urlData.url);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      method: 'HEAD',
      hostname: url.hostname,
      path: url.pathname + url.search,
      timeout: 10000,
      headers: {
        'User-Agent': 'Keebshelf-HealthCheck/1.0 (Link Validator)'
      }
    };
    
    const req = client.request(options, (res) => {
      const status = res.statusCode;
      let statusText = '✅ OK';
      
      if (status >= 400 && status < 500) {
        statusText = '❌ BROKEN (4xx)';
      } else if (status >= 500) {
        statusText = '⚠️ SERVER ERROR (5xx)';
      } else if (status >= 300 && status < 400) {
        statusText = `↪️ REDIRECT (${status})`;
      }
      
      resolve({
        ...urlData,
        status: status,
        statusText: statusText,
        healthy: status < 400
      });
    });
    
    req.on('error', (err) => {
      resolve({
        ...urlData,
        status: 'ERROR',
        statusText: `❌ ERROR: ${err.message}`,
        healthy: false
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        ...urlData,
        status: 'TIMEOUT',
        statusText: '⏱️ TIMEOUT',
        healthy: false
      });
    });
    
    req.end();
  });
}

async function runHealthCheck() {
  console.log('\n🔍 Keebshelf Link Health Check\n');
  console.log('=' .repeat(60));
  
  const results = [];
  
  // Check all URLs with a small delay to be nice to servers
  for (const urlData of urls) {
    process.stdout.write(`Checking ${urlData.name}... `);
    const result = await checkUrl(urlData);
    results.push(result);
    console.log(result.statusText);
    
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 SUMMARY\n');
  
  const healthy = results.filter(r => r.healthy);
  const broken = results.filter(r => !r.healthy);
  
  console.log(`✅ Healthy: ${healthy.length}/${results.length}`);
  console.log(`❌ Broken: ${broken.length}/${results.length}\n`);
  
  if (broken.length > 0) {
    console.log('🚨 BROKEN LINKS:\n');
    broken.forEach(r => {
      console.log(`  • ${r.name}`);
      console.log(`    ${r.url}`);
      console.log(`    Status: ${r.statusText}`);
      console.log();
    });
  }
  
  // Export results for automation
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    healthy: healthy.length,
    broken: broken.length,
    results: results
  };
  
  // Save report
  const fs = require('fs');
  fs.writeFileSync('health-report.json', JSON.stringify(report, null, 2));
  console.log('📄 Report saved to health-report.json\n');
  
  process.exit(broken.length > 0 ? 1 : 0);
}

runHealthCheck();
