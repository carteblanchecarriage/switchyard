#!/usr/bin/env node
/**
 * Keebshelf Production Health Dashboard
 * Run: node tools/health-dashboard.js
 * Shows real-time status of all production components
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m'
};

function color(text, c) {
  return `${COLORS[c]}${text}${COLORS.reset}`;
}

function statusIcon(healthy) {
  return healthy ? color('✅', 'green') : color('❌', 'red');
}

function warnIcon(warning) {
  return warning ? color('⚠️', 'yellow') : color('✅', 'green');
}

// Check if file exists and is readable
function checkFile(filepath) {
  try {
    fs.accessSync(filepath, fs.constants.R_OK);
    return { exists: true, size: fs.statSync(filepath).size };
  } catch {
    return { exists: false, size: 0 };
  }
}

// Check if process is running
function checkProcess(name) {
  try {
    const result = execSync(`pgrep -f "${name}" | head -1`, { encoding: 'utf8' });
    return { running: true, pid: result.trim() };
  } catch {
    return { running: false, pid: null };
  }
}

// Check API endpoint
async function checkApiEndpoint(path, expectedStatus = 200) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({
            status: res.statusCode,
            healthy: res.statusCode === expectedStatus,
            responseTime: Date.now(), // Would need to track start time
            body: body.success !== undefined ? { success: body.success } : { error: body.error?.code }
          });
        } catch {
          resolve({ status: res.statusCode, healthy: res.statusCode === expectedStatus, body: null });
        }
      });
    });
    req.on('error', () => resolve({ status: 0, healthy: false, error: 'Connection refused' }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, healthy: false, error: 'Timeout' }); });
    req.end();
  });
}

// Check disk space
function checkDiskSpace() {
  try {
    const output = execSync('df -h / | tail -1', { encoding: 'utf8' });
    const parts = output.trim().split(/\s+/);
    const usage = parts[4]; // e.g., "45%"
    return {
      total: parts[1],
      used: parts[2],
      available: parts[3],
      usage: usage,
      healthy: parseInt(usage) < 90
    };
  } catch {
    return { healthy: false, error: 'Cannot check disk space' };
  }
}

// Check memory usage
function checkMemory() {
  try {
    const output = execSync('free -h | grep Mem', { encoding: 'utf8' });
    const parts = output.trim().split(/\s+/);
    return {
      total: parts[1],
      used: parts[2],
      free: parts[3],
      available: parts[6]
    };
  } catch {
    return null;
  }
}

// Check data freshness
function checkDataFreshness() {
  const dataFile = path.join(__dirname, '..', 'data', 'keyboard-data.json');
  const fileCheck = checkFile(dataFile);
  
  if (!fileCheck.exists) {
    return { healthy: false, age: null, error: 'Data file not found' };
  }
  
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    const data = JSON.parse(raw);
    const scrapedAt = data.metadata?.scrapedAt;
    
    if (!scrapedAt) {
      return { healthy: false, age: null, error: 'No scrapedAt timestamp' };
    }
    
    const scrapedTime = new Date(scrapedAt).getTime();
    const now = Date.now();
    const ageHours = (now - scrapedTime) / (1000 * 60 * 60);
    
    return {
      healthy: ageHours < 4, // Should be fresher than 4 hours
      age: `${ageHours.toFixed(1)} hours`,
      lastScraped: scrapedAt,
      productCount: data.allProducts?.length || data.groupBuys?.length || 0
    };
  } catch (e) {
    return { healthy: false, age: null, error: e.message };
  }
}

// Check recent logs for errors
function checkRecentErrors() {
  const logDir = path.join(__dirname, '..', 'logs');
  const logFiles = ['keebshelf-error.log', 'scraper-cron.log', 'cron.log'];
  
  const errors = [];
  for (const file of logFiles) {
    const filepath = path.join(logDir, file);
    if (checkFile(filepath).exists) {
      try {
        const content = fs.readFileSync(filepath, 'utf8');
        const recentLines = content.split('\n').slice(-20).join('\n');
        if (recentLines.includes('error') || recentLines.includes('Error')) {
          errors.push(`${file}: Recent errors detected`);
        }
      } catch {}
    }
  }
  
  return {
    healthy: errors.length === 0,
    warnings: errors
  };
}

// Main dashboard
async function showDashboard() {
  console.clear();
  console.log(color('\n╔═══════════════════════════════════════════════════════════════╗', 'bold'));
  console.log(color('║           KEEBSHELF PRODUCTION HEALTH DASHBOARD              ║', 'bold'));
  console.log(color('╚═══════════════════════════════════════════════════════════════╝\n', 'bold'));
  
  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  console.log(`Last updated: ${timestamp}\n`);
  
  // 1. API Status
  console.log(color('━━ API STATUS ━━', 'blue'));
  const apiCheck = await checkApiEndpoint('/health');
  const apiProcess = checkProcess('node.*api/index.js');
  
  console.log(`${statusIcon(apiCheck.healthy)} Health endpoint: ${apiCheck.healthy ? '200 OK' : 'Failed'}`);
  console.log(`${statusIcon(apiProcess.running)} API process: ${apiProcess.running ? `Running (PID: ${apiProcess.pid})` : 'Stopped'}`);
  
  // 2. Data Status
  console.log(`\n${color('━━ DATA STATUS ━━', 'blue')}`);
  const dataCheck = checkDataFreshness();
  console.log(`${statusIcon(dataCheck.healthy)} Data freshness: ${dataCheck.age || 'N/A'}`);
  console.log(`${statusIcon(dataCheck.healthy)} Products loaded: ${dataCheck.productCount || 0}`);
  if (dataCheck.error) {
    console.log(`   ${color(dataCheck.error, 'red')}`);
  }
  
  // 3. System Status
  console.log(`\n${color('━━ SYSTEM STATUS ━━', 'blue')}`);
  const disk = checkDiskSpace();
  const memory = checkMemory();
  
  console.log(`${statusIcon(disk.healthy)} Disk usage: ${disk.usage || 'N/A'} (${disk.available || 'N/A'} available)`);
  if (memory) {
    console.log(`${warnIcon(false)} Memory: ${memory.used} / ${memory.total}`);
  }
  
  // 4. Critical Files
  console.log(`\n${color('━━ FILE STATUS ━━', 'blue')}`);
  
  const criticalFiles = [
    ['.env', path.join(__dirname, '..', '.env')],
    ['Data file', path.join(__dirname, '..', 'data', 'keyboard-data.json')],
    ['API index', path.join(__dirname, '..', 'api', 'index.js')]
  ];
  
  for (const [name, filepath] of criticalFiles) {
    const check = checkFile(filepath);
    console.log(`${statusIcon(check.exists)} ${name}: ${check.exists ? (check.size / 1024).toFixed(1) + 'KB' : 'Missing'}`);
  }
  
  // 5. Recent Errors
  console.log(`\n${color('━━ ERROR MONITORING ━━', 'blue')}`);
  const errorCheck = checkRecentErrors();
  if (errorCheck.healthy) {
    console.log(`${color('✅', 'green')} No recent errors detected`);
  } else {
    console.log(`${color('⚠️', 'yellow')} Recent errors found:`);
    for (const warning of errorCheck.warnings) {
      console.log(`   ${color('-', 'yellow')} ${warning}`);
    }
  }
  
  // 6. Configuration
  console.log(`\n${color('━━ CONFIGURATION ━━', 'blue')}`);
  const envFile = checkFile(path.join(__dirname, '..', '.env'));
  const gitignore = checkFile(path.join(__dirname, '..', '.gitignore'));
  
  console.log(`${statusIcon(envFile.exists)} Environment file (.env)`);
  console.log(`${statusIcon(gitignore.exists)} Git ignore file`);
  
  // Summary
  console.log(`\n${color('━━ OVERALL STATUS ━━', 'bold')}`);
  const allHealthy = apiCheck.healthy && dataCheck.healthy && disk.healthy && apiProcess.running;
  
  if (allHealthy) {
    console.log(color('\n✅ ALL SYSTEMS OPERATIONAL', 'green'));
    console.log(color('   Ready for production traffic\n', 'green'));
  } else {
    console.log(color('\n⚠️  ISSUES DETECTED', 'yellow'));
    console.log(color('   Review issues above before deploying\n', 'yellow'));
  }
  
  console.log(color('Press Ctrl+C to exit\n', 'bold'));
}

// Run once or continuously
const args = process.argv.slice(2);
const continuous = args.includes('--watch');

async function main() {
  if (continuous) {
    console.log(color('🔄 Monitoring mode - refreshing every 30 seconds', 'blue'));
    console.log(color('Press Ctrl+C to stop\n', 'yellow'));
    
    setInterval(showDashboard, 30000);
    await showDashboard();
  } else {
    await showDashboard();
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Dashboard error:', err);
  process.exit(1);
});
