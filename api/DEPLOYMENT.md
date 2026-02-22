# Keebshelf API Deployment Guide

## Overview

The Keebshelf API v2 is designed to be deployed as a production-ready service with:
- Built-in rate limiting
- Request logging
- Security headers
- Pagination support
- Comprehensive error handling

## Deployment Options

### Option 1: Railway (Recommended)

Railway provides the easiest deployment with automatic HTTPS and scaling.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
cd api
railway login

# Initialize project
railway init

# Deploy
railway up

# Set environment variables
railway variables set NODE_ENV=production
railway variables set RATE_LIMIT_MAX=100
railway variables set TRUST_PROXY=true

# Open the deployed API
railway open
```

### Option 2: Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - Build Command: `cd api && npm install`
   - Start Command: `cd api && npm start`
4. Set environment variables in the Render dashboard
5. Deploy

### Option 3: Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app
cd api
fly launch

# Set environment variables
fly secrets set NODE_ENV=production
fly secrets set RATE_LIMIT_MAX=100

# Deploy
fly deploy
```

### Option 4: Self-Hosted (VPS/Dedicated Server)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/keyboard-tracker.git
cd keyboard-tracker/api

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env
nano .env  # Edit with your values

# 4. Start with PM2 (process manager)
npm install -g pm2
pm2 start index-v2.js --name keebshelf-api
pm2 startup
pm2 save

# Check status
pm2 status
```

### Option 5: Docker

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3003

ENV NODE_ENV=production
ENV PORT=3003

USER node

CMD ["node", "index-v2.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: ./api
    container_name: keebshelf-api
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=production
      - PORT=3003
      - RATE_LIMIT_MAX=100
      - DATA_RELOAD_INTERVAL=300000
    volumes:
      - ../data:/app/data:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3003/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

```bash
# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f
```

## Production Checklist

### Security
- [ ] Set `NODE_ENV=production`
- [ ] Set `TRUST_PROXY=true` if behind reverse proxy
- [ ] Configure appropriate `ALLOWED_ORIGINS`
- [ ] Set reasonable `RATE_LIMIT` values
- [ ] Enable HTTPS (cloud provider or reverse proxy)

### Monitoring
- [ ] Set up health check endpoint (`/health`)
- [ ] Configure log aggregation (optional)
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Add error tracking (Sentry - optional)

### Performance
- [ ] Review data file size (<10MB recommended)
- [ ] Set appropriate `DATA_RELOAD_INTERVAL`
- [ ] Monitor memory usage and response times

### Environment Variables Required
```bash
NODE_ENV=production
PORT=3003
RATE_LIMIT_MAX=100
TRUST_PROXY=true
DATA_RELOAD_INTERVAL=300000
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /health` | GET | Health check with metrics |
| `GET /api/groupbuys` | GET | List all group buys (paginated) |
| `GET /api/groupbuys/:id` | GET | Get specific group buy |
| `GET /api/interest-checks` | GET | List interest checks |
| `GET /api/search` | GET | Search products |
| `GET /api/vendors` | GET | List vendors with affiliate links |
| `GET /api/pricing` | GET | API pricing tiers |

### Query Parameters

**Pagination:**
- `?page=1` - Page number (default: 1)
- `?limit=50` - Items per page (max: 100, default: 50)

**Filtering:**
- `?status=active` - Filter by status
- `?category=keyboard` - Filter by category
- `?vendor=NovelKeys` - Filter by vendor
- `?includeUnavailable=true` - Show archived/sold out items

**Search:**
- `?q=query` - Search term (min 2 characters)

### Response Format

All responses follow this structure:
```json
{
  "success": true,
  "timestamp": "2026-02-20T20:31:00.000Z",
  "data": { ... },
  "meta": {
    "apiVersion": "2.0.0",
    "environment": "production",
    "pagination": { ... },
    "filters": { ... }
  }
}
```

Error responses:
```json
{
  "success": false,
  "timestamp": "2026-02-20T20:31:00.000Z",
  "error": {
    "code": "NOT_FOUND",
    "message": "Group buy not found"
  },
  "meta": { ... }
}
```

## Response Headers

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests allowed per window |
| `X-RateLimit-Remaining` | Remaining requests in current window |
| `X-RateLimit-Reset` | When the rate limit resets (Unix timestamp) |
| `X-Content-Type-Options` | Security header (nosniff) |
| `X-Frame-Options` | Security header (DENY) |
| `X-XSS-Protection` | Security header (1; mode=block) |

## Troubleshooting

### High Memory Usage
- Reduce `DATA_RELOAD_INTERVAL` to check for file changes less frequently
- Consider splitting data into multiple files by category

### Rate Limit Issues
- Adjust `RATE_LIMIT_MAX` based on expected traffic
- If behind Cloudflare, consider using their rate limiting instead

### Data Not Updating
- Check that `DATA_FILE` path is correct
- Verify `DATA_RELOAD_INTERVAL` is set appropriately
- Check file permissions

### CORS Errors
- Ensure `ALLOWED_ORIGINS` includes your frontend domain
- Use `*` for development only, never in production

## Support

For issues or questions:
- Check health endpoint: `GET /health`
- Review server logs
- Test locally: `npm run dev`
