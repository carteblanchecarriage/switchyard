const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security & Performance Configuration
const CONFIG = {
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || NODE_ENV === 'production' ? 100 : 1000, // 100 req/min in prod
  DATA_RELOAD_INTERVAL: parseInt(process.env.DATA_RELOAD_INTERVAL) || 5 * 60 * 1000, // 5 minutes
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 30000, // 30 seconds
  TRUST_PROXY: process.env.TRUST_PROXY === 'true' || NODE_ENV === 'production'
};

// Enable trust proxy in production (for rate limiting behind reverse proxy)
if (CONFIG.TRUST_PROXY) {
  app.set('trust proxy', 1);
}

// Simple in-memory rate limiting
class RateLimiter {
  constructor(windowMs, maxRequests) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.requests = new Map();
    
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }
  
  check(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    const userRequests = this.requests.get(key) || [];
    const recentRequests = userRequests.filter(t => t > windowStart);
    
    if (recentRequests.length >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: Math.ceil((recentRequests[0] + this.windowMs) / 1000)
      };
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return {
      allowed: true,
      remaining: this.maxRequests - recentRequests.length,
      resetTime: Math.ceil((now + this.windowMs) / 1000)
    };
  }
  
  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    for (const [key, requests] of this.requests) {
      const recentRequests = requests.filter(t => t > windowStart);
      if (recentRequests.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recentRequests);
      }
    }
  }
}

const rateLimiter = new RateLimiter(CONFIG.RATE_LIMIT_WINDOW, CONFIG.RATE_LIMIT_MAX);

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      query: req.query,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')?.slice(0, 100)
    };
    
    if (NODE_ENV === 'production') {
      // In production, log to file or service
      console.log(JSON.stringify(logEntry));
    } else {
      // In dev, human-readable format
      const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
      const resetColor = '\x1b[0m';
      console.log(`${statusColor}${res.statusCode}${resetColor} ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// Rate limiting middleware
app.use((req, res, next) => {
  const key = req.ip || req.connection.remoteAddress;
  const limit = rateLimiter.check(key);
  
  res.setHeader('X-RateLimit-Limit', CONFIG.RATE_LIMIT_MAX);
  res.setHeader('X-RateLimit-Remaining', limit.remaining);
  res.setHeader('X-RateLimit-Reset', limit.resetTime);
  
  if (!limit.allowed) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: `Too many requests. Try again after ${Math.ceil(CONFIG.RATE_LIMIT_WINDOW / 1000)} seconds.`,
      retryAfter: CONFIG.RATE_LIMIT_WINDOW / 1000
    });
  }
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Timeout handling middleware
app.use((req, res, next) => {
  req.setTimeout(CONFIG.REQUEST_TIMEOUT, () => {
    res.status(408).json({
      error: 'Request timeout',
      message: 'Request took too long to process'
    });
  });
  next();
});

// ===================== DATA MANAGEMENT =====================

const DATA_FILE = path.join(__dirname, '..', 'data', 'keyboard-data.json');

// Sanitize string input
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Basic XSS prevention
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control chars
    .trim()
    .slice(0, 200); // Limit length
}

// Validate and sanitize query parameters
function sanitizeQueryParams(query) {
  const sanitized = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else {
      sanitized[key] = String(value).slice(0, 50);
    }
  }
  return sanitized;
}

function loadData() {
  const startTime = Date.now();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      console.log(`✅ Data loaded in ${Date.now() - startTime}ms (${(Buffer.byteLength(raw) / 1024).toFixed(2)}KB)`);
      return data;
    }
  } catch (e) {
    console.error('❌ Error loading data:', e.message);
  }
  return { 
    groupBuys: [], 
    interestChecks: [], 
    vendors: [], 
    allProducts: [], 
    revenueProjection: {},
    metadata: {}
  };
}

// Initial data load
let db = loadData();

// Reload data periodically
setInterval(() => {
  console.log('🔄 Reloading data...');
  db = loadData();
}, CONFIG.DATA_RELOAD_INTERVAL);

// ===================== STANDARDIZED RESPONSES =====================

function successResponse(data, meta = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    meta: {
      ...meta,
      apiVersion: '2.0.0',
      environment: NODE_ENV
    }
  };
}

function errorResponse(error, code, details = {}) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code,
      message: error
    },
    meta: {
      apiVersion: '2.0.0',
      environment: NODE_ENV,
      ...details
    }
  };
}

// ===================== FILTERING =====================

const EXCLUDED_STATUSES = ['archived', 'sold_out', 'unavailable', 'discontinued', 'ended', 'closed'];

function filterAvailableItems(items, includeUnavailable = false) {
  if (!Array.isArray(items)) return [];
  if (includeUnavailable) return items;
  
  return items.filter(item => {
    // Check explicit status field
    if (item.status && EXCLUDED_STATUSES.includes(item.status.toLowerCase())) {
      return false;
    }
    
    // Check availability flag
    if (item.available === false) return false;
    
    // Check inventory
    if (item.inventory !== undefined && item.inventory <= 0) return false;
    
    // Check for markers in name/description
    const nameDesc = `${item.name || ''} ${item.description || ''}`.toLowerCase();
    if (nameDesc.includes('[sold out]') || nameDesc.includes('(archived)') || 
        nameDesc.includes('[unavailable]') || nameDesc.includes('discontinued')) {
      return false;
    }
    
    return true;
  });
}

// ===================== ROUTES =====================

// Health check - Comprehensive
app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  res.json(successResponse({
    status: 'healthy',
    uptime: Math.floor(uptime),
    uptimeFormatted: `${Math.floor(uptime / 86400)}d ${Math.floor((uptime % 86400) / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: NODE_ENV,
    data: {
      source: 'live-scraper',
      fileExists: fs.existsSync(DATA_FILE),
      lastUpdated: db.metadata?.scrapedAt || 'unknown',
      productCount: db.allProducts?.length || db.groupBuys?.length || 0
    },
    memory: NODE_ENV === 'development' ? {
      used: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)}MB`
    } : undefined
  }, {
    rateLimit: {
      window: `${CONFIG.RATE_LIMIT_WINDOW}ms`,
      max: CONFIG.RATE_LIMIT_MAX
    }
  }));
});

// Get all group buys with comprehensive filtering
app.get('/api/groupbuys', (req, res) => {
  try {
    const query = sanitizeQueryParams(req.query);
    const { status, category, vendor, includeUnavailable, page, limit } = query;
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    
    // Use allProducts if available, otherwise groupBuys
    let results = db.allProducts || db.groupBuys || [];
    
    // Filter by availability
    results = filterAvailableItems(results, includeUnavailable === 'true');
    
    // Apply filters
    if (status) {
      results = results.filter(item => item.status?.toLowerCase() === status.toLowerCase());
    }
    if (category) {
      results = results.filter(item => item.category?.toLowerCase().includes(category.toLowerCase()));
    }
    if (vendor) {
      results = results.filter(item => 
        item.vendor?.toLowerCase().includes(vendor.toLowerCase()) ||
        item.origin?.toLowerCase().includes(vendor.toLowerCase())
      );
    }
    
    // Pagination
    const total = results.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIdx = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIdx, startIdx + limitNum);
    
    res.json(successResponse(paginatedResults, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      },
      filters: {
        status: status || 'any',
        category: category || 'any',
        vendor: vendor || 'any',
        showUnavailable: includeUnavailable === 'true'
      },
      excludedStatuses: includeUnavailable === 'true' ? [] : EXCLUDED_STATUSES
    }));
    
  } catch (error) {
    console.error('Error in /api/groupbuys:', error);
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get specific group buy
app.get('/api/groupbuys/:id', (req, res) => {
  try {
    const id = sanitizeString(req.params.id);
    if (!id) {
      return res.status(400).json(errorResponse('Invalid ID provided', 'INVALID_ID'));
    }
    
    const groupBuy = db.groupBuys?.find(gb => gb.id === id) || 
                    db.allProducts?.find(item => item.id === id);
    
    if (!groupBuy) {
      return res.status(404).json(errorResponse('Group buy not found', 'NOT_FOUND'));
    }
    
    res.json(successResponse(groupBuy, {
      related: db.groupBuys?.filter(gb => 
        gb.id !== id && gb.vendor === groupBuy.vendor
      ).slice(0, 3) || []
    }));
    
  } catch (error) {
    console.error('Error in /api/groupbuys/:id:', error);
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get interest checks
app.get('/api/interest-checks', (req, res) => {
  try {
    const { includeUnavailable, page, limit } = sanitizeQueryParams(req.query);
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 50));
    
    let results = db.interestChecks || [];
    results = filterAvailableItems(results, includeUnavailable === 'true');
    
    const total = results.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIdx = (pageNum - 1) * limitNum;
    const paginatedResults = results.slice(startIdx, startIdx + limitNum);
    
    res.json(successResponse(paginatedResults, {
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    }));
    
  } catch (error) {
    console.error('Error in /api/interest-checks:', error);
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Search across everything
app.get('/api/search', (req, res) => {
  try {
    const { q, includeUnavailable } = sanitizeQueryParams(req.query);
    
    if (!q || q.length < 2) {
      return res.status(400).json(errorResponse(
        'Query must be at least 2 characters',
        'INVALID_QUERY',
        { minLength: 2, maxLength: 100 }
      ));
    }
    
    const searchTerm = q.toLowerCase();
    const searchStartTime = Date.now();
    
    // Search across all products
    const allItems = db.allProducts || db.groupBuys || [];
    
    let results = allItems.filter(item => {
      const searchableText = [
        item.name,
        item.description,
        item.vendor,
        item.origin,
        item.category
      ].filter(Boolean).join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
    
    // Filter by availability
    results = filterAvailableItems(results, includeUnavailable === 'true');
    
    // Also search interest checks
    let icResults = db.interestChecks?.filter(ic =>
      ic.name?.toLowerCase().includes(searchTerm) ||
      ic.description?.toLowerCase().includes(searchTerm)
    ) || [];
    
    icResults = filterAvailableItems(icResults, includeUnavailable === 'true');
    
    const searchTime = Date.now() - searchStartTime;
    
    res.json(successResponse({
      products: results.slice(0, 50),
      interestChecks: icResults.slice(0, 20),
      total: results.length + icResults.length
    }, {
      search: {
        query: q,
        time: `${searchTime}ms`,
        includeUnavailable: includeUnavailable === 'true'
      }
    }));
    
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get vendors with affiliate links
app.get('/api/vendors', (req, res) => {
  try {
    const vendors = db.vendors || [];
    res.json(successResponse(vendors, {
      count: vendors.length,
      revenueProjection: db.revenueProjection
    }));
  } catch (error) {
    console.error('Error in /api/vendors:', error);
    res.status(500).json(errorResponse('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get pricing tiers
app.get('/api/pricing', (req, res) => {
  res.json(successResponse([
    {
      name: 'Free',
      price: 0,
      calls: 100,
      alerts: 0,
      features: ['Basic search', 'View group buys', 'Vendor listings'],
      limits: { callsPerDay: 100, trackedItems: 0 }
    },
    {
      name: 'Hobbyist',
      price: 5,
      calls: 1000,
      alerts: 5,
      features: ['1000 API calls/day', 'Email alerts', '30-day history', 'Track 5 items'],
      limits: { callsPerDay: 1000, trackedItems: 5 }
    },
    {
      name: 'Builder',
      price: 15,
      calls: 10000,
      alerts: 20,
      features: ['10k API calls/day', 'Discord alerts', '1-year history', 'Track 20 items', 'WebSocket streams'],
      limits: { callsPerDay: 10000, trackedItems: 20 }
    },
    {
      name: 'Business',
      price: 50,
      calls: null,
      alerts: null,
      features: ['Unlimited calls', 'White-label feed', 'Priority support', 'Custom integrations'],
      limits: { callsPerDay: 'unlimited', trackedItems: 'unlimited' }
    }
  ], { currency: 'USD' }));
});

// ===================== ERROR HANDLING =====================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json(errorResponse(
    `Route ${req.method} ${req.path} not found`,
    'ROUTE_NOT_FOUND',
    { availableRoutes: ['/health', '/api/groupbuys', '/api/interest-checks', '/api/search', '/api/vendors', '/api/pricing'] }
  ));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json(errorResponse(
    NODE_ENV === 'production' ? 'Internal server error' : err.message,
    err.code || 'INTERNAL_ERROR',
    NODE_ENV === 'development' ? { stack: err.stack } : undefined
  ));
});

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n🎹 Keebshelf API v2.0.0');
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Rate Limit: ${CONFIG.RATE_LIMIT_MAX} requests per ${CONFIG.RATE_LIMIT_WINDOW}ms\n`);
  
  console.log('Endpoints:');
  console.log('  GET /health              - Health check with metrics');
  console.log('  GET /api/groupbuys       - List group buys (paginated)');
  console.log('  GET /api/groupbuys/:id   - Get specific group buy');
  console.log('  GET /api/interest-checks - List interest checks');
  console.log('  GET /api/search?q=query  - Search products');
  console.log('  GET /api/vendors         - List vendors');
  console.log('  GET /api/pricing         - Pricing tiers\n');
  
  console.log('Query Parameters:');
  console.log('  ?includeUnavailable=true - Show archived items');
  console.log('  ?status=active           - Filter by status');
  console.log('  ?category=keyboard       - Filter by category');
  console.log('  ?vendor=NovelKeys        - Filter by vendor');
  console.log('  ?page=1&limit=50         - Pagination\n');
  
  console.log('Response Headers:');
  console.log('  X-RateLimit-Limit        - Max requests allowed');
  console.log('  X-RateLimit-Remaining    - Remaining requests');
  console.log('  X-RateLimit-Reset        - Rate limit reset time\n');
});

module.exports = app; // Export for testing
