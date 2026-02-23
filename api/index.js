const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security & Performance Configuration
const CONFIG = {
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || (NODE_ENV === 'production' ? 100 : 1000),
  DATA_RELOAD_INTERVAL: parseInt(process.env.DATA_RELOAD_INTERVAL) || 5 * 60 * 1000, // 5 minutes
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT) || 30000, // 30 seconds
  MAX_QUERY_LENGTH: 100,
  MAX_ID_LENGTH: 100
};

// Enable trust proxy in production
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ===================== RATE LIMITER =====================

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
        resetTime: Math.ceil((recentRequests[0] + this.windowMs) / 1000),
        retryAfter: Math.ceil(this.windowMs / 1000)
      };
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    
    return {
      allowed: true,
      remaining: this.maxRequests - recentRequests.length,
      resetTime: Math.ceil((now + this.windowMs) / 1000),
      count: recentRequests.length
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

// ===================== MIDDLEWARE =====================

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Body parsing with limits
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Request timing and logging
app.use((req, res, next) => {
  req.startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress
    };
    
    if (NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      const statusColor = res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
      console.log(`${statusColor}${res.statusCode}\x1b[0m ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// Rate limiting with headers (set early so they're on all responses)
app.use((req, res, next) => {
  const key = req.ip || req.connection.remoteAddress || 'unknown';
  const limit = rateLimiter.check(key);
  
  res.setHeader('X-RateLimit-Limit', String(CONFIG.RATE_LIMIT_MAX));
  res.setHeader('X-RateLimit-Remaining', String(Math.max(0, limit.remaining)));
  res.setHeader('X-RateLimit-Reset', String(limit.resetTime));
  
  if (!limit.allowed) {
    return res.status(429).json(formatError(
      'Too many requests. Please try again later.',
      'RATE_LIMIT_EXCEEDED',
      { retryAfter: limit.retryAfter }
    ));
  }
  next();
});

// Security headers middleware - must be before rate limiting to set on all responses
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Cache headers for API responses (short cache for dynamic content)
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  next();
});

// ===================== DATA MANAGEMENT =====================

const DATA_FILE = path.join(__dirname, '..', 'data', 'keyboard-data.json');

// Input sanitization
function sanitizeString(str, maxLength = CONFIG.MAX_QUERY_LENGTH) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Basic XSS prevention
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control chars
    .trim()
    .slice(0, maxLength);
}

function sanitizeId(id) {
  if (typeof id !== 'string') return '';
  // Only allow alphanumeric, hyphens, underscores for IDs
  return id.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, CONFIG.MAX_ID_LENGTH);
}

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

// Load data with validation
let dataLoadErrors = [];
let lastDataLoad = null;

function loadData() {
  const startTime = Date.now();
  dataLoadErrors = [];
  
  try {
    if (!fs.existsSync(DATA_FILE)) {
      dataLoadErrors.push('Data file not found');
      return createEmptyData();
    }
    
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const fileSize = Buffer.byteLength(raw);
    
    if (fileSize === 0) {
      dataLoadErrors.push('Data file is empty');
      return createEmptyData();
    }
    
    if (fileSize > 50 * 1024 * 1024) { // 50MB limit
      dataLoadErrors.push('Data file exceeds maximum size (50MB)');
      return createEmptyData();
    }
    
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      dataLoadErrors.push(`Invalid JSON: ${e.message}`);
      return createEmptyData();
    }
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      dataLoadErrors.push('Data is not an object');
      return createEmptyData();
    }
    
    lastDataLoad = {
      timestamp: new Date().toISOString(),
      duration: Date.now() - startTime,
      size: `${(fileSize / 1024).toFixed(2)}KB`,
      productCount: data.allProducts?.length || data.groupBuys?.length || 0
    };
    
    console.log(`✅ Data loaded: ${lastDataLoad.size}, ${lastDataLoad.productCount} products in ${lastDataLoad.duration}ms`);
    return data;
    
  } catch (e) {
    dataLoadErrors.push(`Unexpected error: ${e.message}`);
    console.error('Error loading data:', e.message);
    return createEmptyData();
  }
}

function createEmptyData() {
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
  const newData = loadData();
  if (dataLoadErrors.length === 0) {
    db = newData;
  } else {
    console.error('⚠️ Data reload failed, keeping existing data:', dataLoadErrors);
  }
}, CONFIG.DATA_RELOAD_INTERVAL);

// ===================== RESPONSE HELPERS =====================

function formatSuccess(data, meta = {}) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data,
    meta: {
      ...meta,
      apiVersion: '2.1.0',
      environment: NODE_ENV
    }
  };
}

function formatError(message, code = 'ERROR', details = {}) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code,
      message
    },
    meta: {
      apiVersion: '2.1.0',
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
    if (!item || typeof item !== 'object') return false;
    
    // Check explicit status field
    if (item.status && EXCLUDED_STATUSES.includes(item.status.toLowerCase())) {
      return false;
    }
    
    // Check availability flag
    if (item.available === false) return false;
    
    // Check inventory
    if (item.inventory !== undefined && item.inventory <= 0) return false;
    
    // Check for markers in name/description
    const name = (item.name || '').toLowerCase();
    const desc = (item.description || '').toLowerCase();
    const markers = ['[sold out]', '(archived)', '[unavailable]', 'discontinued', '[ended]'];
    if (markers.some(m => name.includes(m) || desc.includes(m))) {
      return false;
    }
    
    return true;
  });
}

// Parse pagination parameters
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 50));
  return { page, limit };
}

// Apply pagination
function paginate(items, page, limit) {
  const total = items.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIdx = (page - 1) * limit;
  const data = items.slice(startIdx, startIdx + limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
}

// ===================== ROUTES =====================

// Health check
app.get('/health', (req, res) => {
  const memUsage = process.memoryUsage();
  const uptime = process.uptime();
  
  // Calculate uptime in readable format
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  
  const isHealthy = dataLoadErrors.length === 0 && db.allProducts?.length > 0;
  
  res.status(isHealthy ? 200 : 503).json(formatSuccess({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    version: '2.1.0',
    environment: NODE_ENV,
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${days}d ${hours}h ${minutes}m`
    },
    memory: NODE_ENV === 'development' ? {
      heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
      heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`,
      rss: `${(memUsage.rss / 1024 / 1024).toFixed(2)}MB`
    } : undefined,
    data: {
      fileExists: fs.existsSync(DATA_FILE),
      lastLoad: lastDataLoad,
      productCount: db.allProducts?.length || db.groupBuys?.length || 0,
      vendorCount: db.vendors?.length || 0
    },
    errors: dataLoadErrors.length > 0 ? dataLoadErrors : undefined
  }, {
    rateLimit: {
      windowMs: CONFIG.RATE_LIMIT_WINDOW,
      maxRequests: CONFIG.RATE_LIMIT_MAX,
      windowMinutes: Math.ceil(CONFIG.RATE_LIMIT_WINDOW / 60000)
    }
  }));
});

// Get all group buys
app.get('/api/groupbuys', (req, res) => {
  try {
    const query = sanitizeQueryParams(req.query);
    const { status, category, vendor, includeUnavailable } = query;
    const { page, limit } = parsePagination(query);
    
    // Use allProducts if available, otherwise groupBuys
    let results = db.allProducts || db.groupBuys || [];
    
    // Filter by availability
    results = filterAvailableItems(results, includeUnavailable === 'true');
    
    // Apply filters
    if (status) {
      results = results.filter(item => 
        item.status?.toLowerCase() === status.toLowerCase()
      );
    }
    if (category) {
      results = results.filter(item => 
        item.category?.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (vendor) {
      const vendorLower = vendor.toLowerCase();
      results = results.filter(item => 
        item.vendor?.toLowerCase().includes(vendorLower) ||
        item.origin?.toLowerCase().includes(vendorLower)
      );
    }
    
    const paginated = paginate(results, page, limit);
    
    res.json(formatSuccess(paginated.data, {
      pagination: paginated.pagination,
      filters: {
        status: status || 'any',
        category: category || 'any',
        vendor: vendor || 'any',
        showUnavailable: includeUnavailable === 'true'
      }
    }));
    
  } catch (error) {
    console.error('Error in /api/groupbuys:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get specific group buy
app.get('/api/groupbuys/:id', (req, res) => {
  try {
    const id = sanitizeId(req.params.id);
    
    if (!id) {
      return res.status(400).json(formatError(
        'Invalid ID format. IDs can only contain letters, numbers, hyphens, and underscores.',
        'INVALID_ID'
      ));
    }
    
    const groupBuy = db.allProducts?.find(item => item.id === id) ||
                    db.groupBuys?.find(item => item.id === id);
    
    if (!groupBuy) {
      return res.status(404).json(formatError(
        `Group buy with ID "${id}" not found`,
        'NOT_FOUND'
      ));
    }
    
    // Find related products (same vendor, exclude self)
    const allItems = db.allProducts || db.groupBuys || [];
    const related = allItems
      .filter(item => item.id !== id && item.vendor === groupBuy.vendor)
      .slice(0, 3);
    
    res.json(formatSuccess(groupBuy, { related }));
    
  } catch (error) {
    console.error('Error in /api/groupbuys/:id:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get interest checks
app.get('/api/interest-checks', (req, res) => {
  try {
    const query = sanitizeQueryParams(req.query);
    const { includeUnavailable } = query;
    const { page, limit } = parsePagination(query);
    
    let results = db.interestChecks || [];
    results = filterAvailableItems(results, includeUnavailable === 'true');
    
    const paginated = paginate(results, page, limit);
    
    res.json(formatSuccess(paginated.data, {
      pagination: paginated.pagination,
      source: 'live-scraper'
    }));
    
  } catch (error) {
    console.error('Error in /api/interest-checks:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Search across everything
app.get('/api/search', (req, res) => {
  try {
    const query = sanitizeQueryParams(req.query);
    const { q, includeUnavailable } = query;
    
    if (!q || q.length < 2) {
      return res.status(400).json(formatError(
        'Query must be at least 2 characters long',
        'INVALID_QUERY',
        { minLength: 2, maxLength: CONFIG.MAX_QUERY_LENGTH }
      ));
    }
    
    const searchStartTime = Date.now();
    const searchTerm = q.toLowerCase();
    
    // Search across all products
    const allItems = db.allProducts || db.groupBuys || [];
    let productResults = allItems.filter(item => {
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
    productResults = filterAvailableItems(productResults, includeUnavailable === 'true');
    
    // Search interest checks
    let icResults = (db.interestChecks || []).filter(ic =>
      ic.name?.toLowerCase().includes(searchTerm) ||
      ic.description?.toLowerCase().includes(searchTerm)
    );
    
    icResults = filterAvailableItems(icResults, includeUnavailable === 'true');
    
    const searchTime = Date.now() - searchStartTime;
    
    res.json(formatSuccess({
      products: productResults.slice(0, 50),
      interestChecks: icResults.slice(0, 20),
      totalProducts: productResults.length,
      totalInterestChecks: icResults.length
    }, {
      search: {
        query: q,
        timeMs: searchTime,
        includeUnavailable: includeUnavailable === 'true'
      }
    }));
    
  } catch (error) {
    console.error('Error in /api/search:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get vendors
app.get('/api/vendors', (req, res) => {
  try {
    const vendors = db.vendors || [];
    res.json(formatSuccess(vendors, {
      count: vendors.length,
      revenueProjection: db.revenueProjection
    }));
  } catch (error) {
    console.error('Error in /api/vendors:', error);
    res.status(500).json(formatError('Internal server error', 'INTERNAL_ERROR'));
  }
});

// Get pricing tiers
app.get('/api/pricing', (req, res) => {
  res.json(formatSuccess([
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

// ===================== WISHLIST ROUTES =====================
// Load wishlist routes if available
try {
  const wishlistRoutes = require('./wishlist-routes');
  app.use('/api/wishlist', wishlistRoutes);
  console.log('✅ Wishlist routes loaded');
} catch (err) {
  console.log('⚠️  Wishlist routes not available:', err.message);
}

// ===================== STATIC FILES =====================
// Serve frontend static files from parent directory
app.use(express.static(path.join(__dirname, '..'), {
  index: 'index.html',
  maxAge: '1h'
}));

// ===================== ERROR HANDLING =====================

// 404 handler
app.use((req, res) => {
  res.status(404).json(formatError(
    `Route ${req.method} ${req.path} not found`,
    'ROUTE_NOT_FOUND',
    {
      availableRoutes: [
        'GET /health',
        'GET /api/groupbuys',
        'GET /api/groupbuys/:id',
        'GET /api/interest-checks',
        'GET /api/search?q=query',
        'GET /api/vendors',
        'GET /api/pricing',
        'GET /api/wishlist',
        'POST /api/wishlist/add',
        'POST /api/wishlist/remove'
      ]
    }
  ));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  // Don't expose stack traces in production
  const response = formatError(
    NODE_ENV === 'production' ? 'Internal server error' : err.message,
    err.code || 'INTERNAL_ERROR'
  );
  
  if (NODE_ENV === 'development' && err.stack) {
    response.meta.stack = err.stack;
  }
  
  res.status(err.status || 500).json(response);
});

// Graceful shutdown
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
  console.log('\n🎹 Keebshelf API v2.1.0');
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`Port: ${PORT}`);
  console.log(`Rate Limit: ${CONFIG.RATE_LIMIT_MAX} requests per ${Math.ceil(CONFIG.RATE_LIMIT_WINDOW / 60000)} minutes\n`);
  
  console.log('Endpoints:');
  console.log('  GET /health              - Health check with metrics');
  console.log('  GET /api/groupbuys       - List group buys (paginated)');
  console.log('  GET /api/groupbuys/:id   - Get specific group buy');
  console.log('  GET /api/interest-checks - List interest checks');
  console.log('  GET /api/search?q=query  - Search products');
  console.log('  GET /api/vendors         - List vendors');
  console.log('  GET /api/pricing         - Pricing tiers\n');
  
  console.log('Query Parameters:');
  console.log('  ?includeUnavailable=true - Show archived/sold out items');
  console.log('  ?status=active           - Filter by status');
  console.log('  ?category=keyboard       - Filter by category');
  console.log('  ?vendor=NovelKeys        - Filter by vendor');
  console.log('  ?page=1&limit=50         - Pagination (max 100)\n');
  
  console.log('Response Headers:');
  console.log('  X-RateLimit-Limit        - Max requests allowed');
  console.log('  X-RateLimit-Remaining    - Remaining requests');
  console.log('  X-RateLimit-Reset        - Rate limit reset time (Unix timestamp)\n');
});

module.exports = app;
