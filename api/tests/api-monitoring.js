#!/usr/bin/env node
/**
 * Keebshelf API Health Monitor
 * 
 * Continuously monitors the API for:
 * - Response times
 * - Error rates
 * - Data freshness
 * - Endpoint availability
 * 
 * Usage:
 *   node tests/api-monitoring.js [--interval=60] [--webhook=URL]
 * 
 * Can be run as a cron job or background process
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  apiBase: 'http://localhost:3003',
  checkInterval: parseInt(process.env.CHECK_INTERVAL) || 60, // seconds
  alertThreshold: {
    responseTime: 500, // ms - warn if slower
    errorRate: 0.05,   // 5% error rate threshold
    failedRequests: 3  // Alert after 3 consecutive failures
  },
  logFile: path.join(__dirname, '../../logs/api-monitor.log'),
  maxLogSize: 10 * 1024 * 1024 // 10MB
};

// State tracking
const state = {
  consecutiveFailures: 0,
  totalChecks: 0,
  failedChecks: 0,
  lastAlertTime: 0,
  responseTimes: [], // Rolling window
  lastStatus: 'unknown'
};

// Ensure log directory exists
const logDir = path.dirname(CONFIG.logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// HTTP request helper
function request(path) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = http.request({
      hostname: 'localhost',
      port: 3003,
      path,
      method: 'GET',
      timeout: 10000 // 10 second timeout
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const responseTime = Date.now() - startTime;
        
        try {
          const body = JSON.parse(data);
          resolve({
            status: res.statusCode,
            responseTime,
            body,
            success: res.statusCode >= 200 && res.statusCode < 300
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            responseTime,
            body: data,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Log rotation
function rotateLogFile() {
  try {
    const stats = fs.statSync(CONFIG.logFile);
    if (stats.size > CONFIG.maxLogSize) {
      const rotatedPath = `${CONFIG.logFile}.${Date.now()}`;
      fs.renameSync(CONFIG.logFile, rotatedPath);
      console.log(`Rotated log file to: ${rotatedPath}`);
    }
  } catch (e) {
    // File doesn't exist, ignore
  }
}

// Logging
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  // Console output
  const colorCode = {
    'INFO': '\x1b[32m',  // Green
    'WARN': '\x1b[33m',  // Yellow
    'ERROR': '\x1b[31m', // Red
    'DEBUG': '\x1b[36m'  // Cyan
  }[level] || '\x1b[0m';
  
  console.log(`${colorCode}[${level}]${'\x1b[0m'} ${message}`);
  
  // File output
  try {
    fs.appendFileSync(CONFIG.logFile, logLine);
  } catch (e) {
    console.error('Failed to write to log file:', e.message);
  }
}

// Send alert (can be extended for Slack, Discord, PagerDuty, etc.)
async function sendAlert(type, message, data = {}) {
  // Prevent alert spam
  const now = Date.now();
  if (now - state.lastAlertTime < 5 * 60 * 1000) { // 5 minute cooldown
    log('DEBUG', 'Alert suppressed (cooldown period)');
    return;
  }
  
  state.lastAlertTime = now;
  
  const alert = {
    type,
    message,
    timestamp: new Date().toISOString(),
    data: {
      consecutiveFailures: state.consecutiveFailures,
      totalChecks: state.totalChecks,
      failedChecks: state.failedChecks,
      errorRate: state.totalChecks > 0 ? (state.failedChecks / state.totalChecks) : 0,
      avgResponseTime: state.responseTimes.length > 0 
        ? state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length 
        : 0,
      ...data
    }
  };
  
  log('ERROR', `ALERT: ${type}`, alert);
  
  // TODO: Add webhook notification here
  // Example for webhook:
  /*
  if (CONFIG.webhookUrl) {
    await fetch(CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert)
    });
  }
  */
  
  // Write to alerts file
  const alertFile = path.join(__dirname, '../../logs/alerts.json');
  try {
    const alerts = fs.existsSync(alertFile) 
      ? JSON.parse(fs.readFileSync(alertFile, 'utf8')) 
      : [];
    alerts.push(alert);
    // Keep last 100 alerts
    if (alerts.length > 100) alerts.shift();
    fs.writeFileSync(alertFile, JSON.stringify(alerts, null, 2));
  } catch (e) {
    log('ERROR', 'Failed to write alert to file', { error: e.message });
  }
}

// Health check
async function checkHealth() {
  try {
    const result = await request('/health');
    
    state.totalChecks++;
    state.responseTimes.push(result.responseTime);
    
    // Keep only last 100 response times
    if (state.responseTimes.length > 100) {
      state.responseTimes.shift();
    }
    
    // Check response time
    if (result.responseTime > CONFIG.alertThreshold.responseTime) {
      log('WARN', 'High response time detected', {
        responseTime: result.responseTime,
        threshold: CONFIG.alertThreshold.responseTime
      });
    }
    
    if (result.success) {
      // Reset failure counter
      if (state.consecutiveFailures >= CONFIG.alertThreshold.failedRequests) {
        log('INFO', 'Service recovered after failures', {
          consecutiveFailures: state.consecutiveFailures
        });
      }
      state.consecutiveFailures = 0;
      state.lastStatus = 'healthy';
      
      // Check data freshness
      const dataAge = result.body?.data?.data?.lastUpdated 
        ? Date.now() - new Date(result.body.data.data.lastUpdated).getTime()
        : null;
      
      if (dataAge && dataAge > 24 * 60 * 60 * 1000) { // > 24 hours
        log('WARN', 'Data may be stale', { dataAge: Math.round(dataAge / 1000 / 60) + ' minutes' });
      }
      
      return {
        healthy: true,
        responseTime: result.responseTime,
        status: result.status,
        uptime: result.body?.data?.uptime
      };
    } else {
      throw new Error(`HTTP ${result.status}`);
    }
    
  } catch (error) {
    state.totalChecks++;
    state.failedChecks++;
    state.consecutiveFailures++;
    state.lastStatus = 'unhealthy';
    
    // Check if we should alert
    if (state.consecutiveFailures >= CONFIG.alertThreshold.failedRequests) {
      await sendAlert('HEALTH_CHECK_FAILED', `Health check failed ${state.consecutiveFailures} times`, {
        error: error.message,
        consecutiveFailures: state.consecutiveFailures
      });
    }
    
    return {
      healthy: false,
      error: error.message,
      consecutiveFailures: state.consecutiveFailures
    };
  }
}

// Full API check
async function checkAllEndpoints() {
  const endpoints = [
    { path: '/health', required: true },
    { path: '/api/groupbuys', required: true },
    { path: '/api/search?q=keyboard', required: true },
    { path: '/api/vendors', required: false },
    { path: '/api/pricing', required: false },
    { path: '/api/interest-checks', required: false }
  ];
  
  const results = [];
  
  for (const endpoint of endpoints) {
    try {
      const result = await request(endpoint.path);
      results.push({
        endpoint: endpoint.path,
        status: result.status,
        success: result.success,
        required: endpoint.required
      });
      
      if (!result.success && endpoint.required) {
        log('WARN', `Required endpoint failing: ${endpoint.path}`, { status: result.status });
      }
    } catch (error) {
      results.push({
        endpoint: endpoint.path,
        status: 0,
        success: false,
        error: error.message,
        required: endpoint.required
      });
    }
  }
  
  return results;
}

// Status summary
function getStatusSummary() {
  const errorRate = state.totalChecks > 0 
    ? (state.failedChecks / state.totalChecks).toFixed(4)
    : 0;
  
  const avgResponseTime = state.responseTimes.length > 0
    ? (state.responseTimes.reduce((a, b) => a + b, 0) / state.responseTimes.length).toFixed(2)
    : 0;
  
  return {
    status: state.lastStatus,
    totalChecks: state.totalChecks,
    failedChecks: state.failedChecks,
    errorRate: `${(errorRate * 100).toFixed(2)}%`,
    consecutiveFailures: state.consecutiveFailures,
    avgResponseTime: `${avgResponseTime}ms`,
    lastCheck: new Date().toISOString()
  };
}

// Save status to file (for external monitoring)
function saveStatus(summary) {
  const statusFile = path.join(__dirname, '../../logs/api-status.json');
  try {
    fs.writeFileSync(statusFile, JSON.stringify(summary, null, 2));
  } catch (e) {
    log('ERROR', 'Failed to save status file', { error: e.message });
  }
}

// Main monitoring loop
async function runMonitor() {
  log('INFO', 'Starting API Monitor', { interval: CONFIG.checkInterval });
  
  // Perform initial check
  const initialCheck = await checkHealth();
  if (!initialCheck.healthy) {
    log('WARN', 'Initial health check failed, continuing anyway', initialCheck);
  }
  
  log('INFO', 'Monitor running. Press Ctrl+C to stop.');
  
  // Run checks
  setInterval(async () => {
    // Rotate logs daily
    rotateLogFile();
    
    // Health check
    const healthResult = await checkHealth();
    
    // Periodic full check (every 10 intervals)
    if (state.totalChecks % 10 === 0) {
      log('INFO', 'Running full endpoint check');
      const endpointResults = await checkAllEndpoints();
      const failedRequired = endpointResults.filter(r => r.required && !r.success);
      
      if (failedRequired.length > 0) {
        log('ERROR', 'Some required endpoints are failing', failedRequired);
      }
    }
    
    // Update and save status
    const summary = getStatusSummary();
    saveStatus(summary);
    
    // Print status every minute
    if (state.totalChecks % (60 / CONFIG.checkInterval) === 0) {
      log('INFO', 'Status update', summary);
    }
    
    // Check error rate for alerting
    const currentErrorRate = state.totalChecks > 0 
      ? state.failedChecks / state.totalChecks 
      : 0;
      
    if (currentErrorRate > CONFIG.alertThreshold.errorRate && state.totalChecks >= 10) {
      await sendAlert('HIGH_ERROR_RATE', `Error rate is ${(currentErrorRate * 100).toFixed(2)}%`, {
        errorRate: currentErrorRate,
        threshold: CONFIG.alertThreshold.errorRate
      });
    }
    
  }, CONFIG.checkInterval * 1000);
}

// CLI mode - single check
async function runSingleCheck() {
  console.log('🔍 Keebshelf API Health Check\n');
  
  const result = await checkHealth();
  
  if (result.healthy) {
    console.log('✅ API is healthy');
    console.log(`   Response time: ${result.responseTime}ms`);
    if (result.uptime) {
      const minutes = Math.floor(result.uptime / 60);
      const hours = Math.floor(minutes / 60);
      console.log(`   Uptime: ${hours}h ${minutes % 60}m`);
    }
  } else {
    console.log('❌ API is unhealthy');
    console.log(`   Error: ${result.error}`);
  }
  
  process.exit(result.healthy ? 0 : 1);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('INFO', 'Monitor stopped by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('INFO', 'Monitor stopped');
  process.exit(0);
});

// Main
const args = process.argv.slice(2);

if (args.includes('--once') || args.includes('-o')) {
  runSingleCheck();
} else if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Keebshelf API Monitor

Usage: node api-monitoring.js [options]

Options:
  --once, -o       Run a single check and exit
  --help, -h       Show this help message

Environment Variables:
  CHECK_INTERVAL   Check interval in seconds (default: 60)

Examples:
  # Run in continuous monitoring mode
  node api-monitoring.js

  # Run a single check
  node api-monitoring.js --once
  
  # Run with custom interval
  CHECK_INTERVAL=30 node api-monitoring.js
`);
  process.exit(0);
} else {
  runMonitor();
}

module.exports = { checkHealth, request };
