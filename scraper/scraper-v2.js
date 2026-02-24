const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Rate limiting: track consecutive failures per vendor
const vendorFailures = {};
const CIRCUIT_BREAKER_THRESHOLD = 3; // Skip vendor after 3 consecutive failures

// Sleep with jitter to avoid pattern detection
function sleep(ms) {
  const jitter = Math.random() * 500; // 0-500ms additional random delay
  return new Promise(resolve => setTimeout(resolve, ms + jitter));
}

// Exponential backoff for failed requests
function getBackoffTime(failureCount) {
  return Math.min(1000 * Math.pow(2, failureCount), 30000); // Max 30s backoff
}

// Write to app-accessible locations only
const DATA_FILES = [
  path.join(__dirname, '..', 'data.json'),  // root for GitHub Pages (what the app fetches)
  path.join(__dirname, '..', 'public', 'data.json')  // React dev server
];

// Ensure directories exist
DATA_FILES.forEach(file => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Vendor configurations with scraping strategies
const VENDORS = {
  // ... rest of the file remains the same ...
