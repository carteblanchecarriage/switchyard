# Keebshelf API v1 vs v2 Comparison

## What Was Improved

### 1. Rate Limiting
**v1:** None
**v2:** In-memory rate limiting with configurable limits
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: timestamp
```

### 2. Response Standardization
**v1:** Inconsistent structure
**v2:** Standardized format for all responses
```json
{
  "success": boolean,
  "timestamp": "ISO-8601",
  "data": { ... },
  "meta": { ... }
}
```

### 3. Error Handling
**v1:** Basic error messages
**v2:** Structured error responses with codes
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "..."
  },
  "meta": {
    "availableRoutes": [...]
  }
}
```

### 4. Security Headers
**v1:** None
**v2:** Comprehensive security headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### 5. Input Sanitization
**v1:** No sanitization
**v2:** sanitizeString() function removes:
- XSS characters (< >)
- Control characters
- Trims whitespace
- Limits length (200 chars)

### 6. Request Logging
**v1:** Console.log only
**v2:** Structured logging with:
- HTTP method & path
- Status code
- Response time
- IP address
- User agent

### 7. Pagination
**v1:** No pagination (all results)
**v2:** Configurable pagination
```json
{
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 276,
      "totalPages": 6,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 8. Health Endpoint
**v1:** Basic status
**v2:** Comprehensive metrics including:
- Memory usage
- Uptime (formatted)
- Data file status
- Product count
- Environment info

### 9. Request Timeout
**v1:** None (could hang)
**v2:** Configurable timeout (30s default)

### 10. Graceful Shutdown
**v1:** None
**v2:** SIGTERM/SIGINT handlers

## Performance Improvements

| Metric | v1 | v2 |
|--------|-----|-----|
| Data reload | Every page load | Every 5 minutes (+ instant on change) |
| Memory | Uncontrolled | Monitored + cleanup |
| Response time | Unknown | Tracked per request |
| Caching | None | In-memory with TTL |

## File Changes

### New Files
- `api/index-v2.js` - Production-ready API
- `api/tests/api-test.js` - Automated test suite
- `api/.env.example` - Environment configuration template
- `api/DEPLOYMENT.md` - Deployment guide
- `api/API_COMPARISON.md` - This file

### Modified Files
- `api/package.json` - Added scripts and engines

## Migration Guide

1. Install dependencies (no changes needed)
2. Copy `.env.example` to `.env` and configure
3. Update deployment to use `index-v2.js` instead of `index.js`
4. Test with `npm test`
5. Deploy

## Breaking Changes

### Response Structure
**v1:**
```json
{ "count": 276, "data": [...] }
```

**v2 (standardized):**
```json
{
  "success": true,
  "timestamp": "...",
  "data": [...],
  "meta": { "count": 276 }
}
```

### Error Responses
**v1:**
```json
{ "error": "Group buy not found" }
```

**v2:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Group buy not found"
  },
  "meta": { "availableRoutes": [...] }
}
```

### Pagination
**v1:** Returns all results
**v2:** Returns paginated results (default: 50 items per page, max: 100)

## Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- Health endpoint
- Rate limiting
- Security headers
- Pagination
- Filtering
- Search validation
- Error responses
- Response structure

## Production Readiness v1.0

| Feature | v1 | v2 |
|---------|-----|-----|
| Rate Limiting | ❌ | ✅ |
| Security Headers | ❌ | ✅ |
| Input Sanitization | ❌ | ✅ |
| Request Logging | ❌ | ✅ |
| Error Handling | ⚠️ Basic | ✅ Comprehensive |
| Pagination | ❌ | ✅ |
| Health Monitoring | ⚠️ Basic | ✅ Detailed |
| Environment Config | ❌ | ✅ |
| Documentation | ⚠️ Basic | ✅ Complete |
| Backwards Compatibility | ✅ | ❌ Breaking |

## Recommendation

**Use v2 for all new deployments.** Despite breaking changes, the improvements in security, reliability, and documentation justify the migration effort.

If you need v1 compatibility, the original file remains available as `index.js`.
