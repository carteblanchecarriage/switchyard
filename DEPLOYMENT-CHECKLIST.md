# Keebshelf Production Deployment Checklist

**Project:** Keebshelf Mechanical Keyboard Tracker  
**Version:** 2.0.0  
**Target:** Public Production Deployment  

Use this checklist for deploying Keebshelf to production.

---

## Pre-Deployment Checklist

### ✅ Code Quality
- [ ] All tests pass (`npm test` in api/)
- [ ] Edge case tests pass (`node api/tests/edge-cases-test.js`)
- [ ] Load test baseline established (`node api/tests/load-test.js`)
- [ ] No critical security vulnerabilities (`npm audit`)
- [ ] No console.log statements in production code
- [ ] Error logging configured and tested

### ✅ Environment Configuration
- [ ] `.env` file created with all required variables
- [ ] Environment variables documented
- [ ] No secrets in version control (`.env` in `.gitignore`)
- [ ] Default values set for optional variables
- [ ] Production vs development config separated

### ✅ Data Integrity
- [ ] Data file loads without errors
- [ ] Data validation schema implemented
- [ ] Backup strategy configured
- [ ] Data freshness check working
- [ ] Scraper runs successfully manually

### ✅ API Security
- [ ] Rate limiting enabled and tested
- [ ] Security headers present (checked via securityheaders.com)
- [ ] CORS configured for frontend origin
- [ ] No exposed sensitive endpoints
- [ ] Input sanitization verified
- [ ] SQL injection tests pass
- [ ] XSS protection tests pass

### ✅ Performance
- [ ] Response time < 500ms for all endpoints
- [ ] Memory usage < 512MB (PM2 limit in ecosystem.json)
- [ ] Static assets cached (Cache-Control headers)
- [ ] Compression enabled (gzip/brotli)
- [ ] Load test baseline established

### ✅ Monitoring
- [ ] Health check endpoint responds correctly
- [ ] Log rotation configured
- [ ] Error alerting configured
- [ ] API monitoring script tested
- [ ] PM2 monitoring enabled (`pm2 monit`)
- [ ] Uptime monitoring (e.g., UptimeRobot) configured

### ✅ Documentation
- [ ] API documentation created (OpenAPI/Swagger)
- [ ] README updated with deployment instructions
- [ ] Environment setup documented
- [ ] Troubleshooting guide created
- [ ] Rollback procedures documented

---

## Deployment Options

### Option A: Local Server (Current - NUC)
**Best for:** Full control, lowest cost, already configured

```bash
# 1. Install dependencies
cd ~/Desktop/keyboard-tracker
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with production values

# 3. Run tests
npm test
cd api && node tests/edge-cases-test.js

# 4. Start production services
./start-production.sh

# 5. Verify
pm2 status
curl http://localhost:3003/health
curl http://localhost:3003/api/groupbuys
```

**Pros:**
- Full control over hardware
- No monthly hosting costs
- Existing infrastructure

**Cons:**
- Single point of failure
- Requires port forwarding or tunnel
- Manual SSL certificate management

**Production Readiness:** 8/10

---

### Option B: Railway (Recommended)
**Best for:** Automatic deployment, easy scaling, $0-5/month

```bash
# 1. Install Railway CLI
npm install -g @railway/cli
railway login

# 2. Initialize project
cd ~/Desktop/keyboard-tracker/api
railway init --name keebshelf-api

# 3. Configure environment
railway variables set NODE_ENV=production
railway variables set PORT=3003

# 4. Deploy
railway up

# 5. Get domain
railway domain
```

**Pros:**
- Automatic HTTPS
- Git-based deployment
- Easy scaling
- Automatic restarts
- Generous free tier ($5/month credit)

**Cons:**
- Requires credit card (even for free tier)
- Vendor lock-in

**Estimated Cost:** $0-10/month
**Production Readiness:** 9/10

---

### Option C: Vercel (Serverless)
**Best for:** API-only deployment, automatic scaling, free tier

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Configure for serverless
# Create api/index.js as entry point (already done)

# 3. Deploy
cd ~/Desktop/keyboard-tracker/api
vercel --prod

# 4. Set environment variables
vercel env add NODE_ENV production
```

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "name": "keebshelf-api",
  "builds": [
    { "src": "index-v2.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "index-v2.js" }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Pros:**
- Automatic scaling
- Edge network (fast globally)
- Free tier generous
- Zero-downtime deployments

**Cons:**
- Serverless limitations (cold starts)
- In-memory state lost between requests (rate limiting breaks)

**Workaround for Rate Limiting:** Use Redis or disable for Vercel

**Estimated Cost:** $0-20/month
**Production Readiness:** 8/10

---

### Option D: Cloudflare Workers (Edge)
**Best for:** Global edge deployment, lowest latency

```bash
# 1. Install Wrangler
npm install -g wrangler

# 2. Configure
wrangler login

# 3. Deploy API to Workers
# Requires converting to Worker-compatible format
```

**Pros:**
- Edge deployment (200+ locations)
- Extremely fast
- Generous free tier

**Cons:**
- Requires significant code changes
- Worker runtime limitations
- Data needs external storage (KV/D1)

**Estimated Cost:** $0-5/month
**Production Readiness:** 7/10 (requires changes)

---

## Domain Configuration

### Option 1: Cloudflare Tunnel (Free)
```bash
# 1. Install cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# 2. Authenticate
cloudflared tunnel login

# 3. Create tunnel
cloudflared tunnel create keebshelf

# 4. Configure
~/.cloudflared/config.yml:
tunnel: YOUR_TUNNEL_ID
credentials-file: /home/klondike/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: api.keebshelf.com
    service: http://localhost:3003
  - service: http_status:404

# 5. Route DNS
cloudflared tunnel route dns keebshelf api.keebshelf.com

# 6. Run
cloudflared tunnel run keebshelf
```

### Option 2: Custom Domain via Railway/Vercel
- Domain purchased from Namecheap/Cloudflare
- Point CNAME to Railway/Vercel
- Automatic SSL provisioning

---

## Post-Deployment Verification

### API Endpoints Test
```bash
# Health check
curl -s https://api.keebshelf.com/health | jq .

# List products
curl -s https://api.keebshelf.com/api/groupbuys | jq '.data | length'

# Search
curl -s 'https://api.keebshelf.com/api/search?q=keychron' | jq '.data | length'

# Rate limiting (should return 429 after limit)
for i in {1..110}; do curl -s -o /dev/null -w "%{http_code}\n" https://api.keebshelf.com/health; done

# Check headers
curl -I https://api.keebshelf.com/health | grep -E "X-Rate|X-Frame|X-Content"
```

### Performance Test
```bash
# Install hey
sudo apt install hey

# Load test
hey -z 30s -c 50 https://api.keebshelf.com/health
```

Expected results:
- 99%+ success rate
- P95 latency < 200ms
- No 5xx errors

---

## Monitoring Setup

### Log Rotation (PM2)
```bash
# PM2 handles log rotation automatically
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
```

### Uptime Monitoring (UptimeRobot)
1. Sign up at https://uptimerobot.com
2. Add monitor: https://api.keebshelf.com/health
3. Set alert to Telegram/Discord/Email
4. Check interval: 5 minutes

### Custom Monitoring Script
```bash
# Add to crontab
crontab -e
*/5 * * * * /usr/bin/node /home/klondike/Desktop/keyboard-tracker/api/tests/api-monitoring.js --once >> /home/klondike/Desktop/keyboard-tracker/logs/monitor-cron.log 2>&1
```

---

## Backup & Recovery

### Data Backup
```bash
# Add to cron (runs daily at 2 AM)
0 2 * * * /home/klondike/Desktop/keyboard-tracker/tools/backup.sh
```

**Backup script** (`tools/backup.sh`):
```bash
#!/bin/bash
BACKUP_DIR="/home/klondike/backups/keebshelf"
DATE=$(date +%Y%m%d-%H%M)

mkdir -p $BACKUP_DIR

# Backup data
tar czf $BACKUP_DIR/data-$DATE.tar.gz \
  /home/klondike/Desktop/keyboard-tracker/data.json \
  /home/klondike/Desktop/keyboard-tracker/data/keyboard-data.json

# Keep only 30 days of backups
find $BACKUP_DIR -name "data-*.tar.gz" -mtime +30 -delete

echo "[$(date)] Backup completed: data-$DATE.tar.gz" >> /home/klondike/Desktop/keyboard-tracker/logs/backup.log
```

### Disaster Recovery
1. **API down:** `pm2 restart keebshelf-api`
2. **Data corruption:** Restore from backup
3. **Server failure:** Deploy to Railway/Vercel as backup

---

## Rollback Procedure

### Code Rollback
```bash
# Option 1: Git revert
git log --oneline -5
git revert HEAD
git push

# Option 2: PM2 rollback
pm2 restart keebshelf-api --update-env

# Option 3: Restore data
pm2 stop keebshelf-api
# Restore data.json from backup
pm2 start keebshelf-api
```

### Database Rollback (if using Supabase)
```bash
# Supabase has point-in-time recovery
# Use dashboard to restore to specific time
```

---

## Security Checklist

- [ ] No secrets in environment variables dumpable
- [ ] API doesn't expose internal paths
- [ ] Rate limiting prevents abuse
- [ ] CORS properly configured
- [ ] Content Security Policy headers set
- [ ] Secure cookies if adding authentication
- [ ] HTTPS enforced (HSTS)
- [ ] Dependencies up to date (`npm audit fix`)

---

## Cost Estimates (Monthly)

| Option | Hosting | Domain | SSL | Monitoring | Total |
|--------|---------|--------|-----|------------|-------|
| Local + Cloudflare | $0 | $10/yr | Free | $0-5 | **$0-5** |
| Railway | $0-10 | $10/yr | Included | $0-5 | **$1-15** |
| Vercel | $0-20 | $10/yr | Included | $0-5 | **$1-25** |
| Cloudflare Workers | $0-5 | $10/yr | Included | $0-5 | **$1-10** |

**Recommendation:** Start with Local + Cloudflare (free), move to Railway when ready to scale.

---

## Launch Communication

When ready to launch:

1. **Update README** with live URLs
2. **Test all endpoints** one final time
3. **Verify monitoring** is alerting correctly
4. **Announce** on relevant channels:
   - r/MechanicalKeyboards (Reddit)
   - Discord servers (Keychron, Keebtalk)
   - Twitter/X (@keebshelf)
   - Personal network

---

## Maintenance Schedule

| Task | Frequency | Command/Action |
|------|-----------|----------------|
| Update dependencies | Weekly | `npm update` |
| Run security audit | Weekly | `npm audit` |
| Review logs | Weekly | Check `logs/` directory |
| Test backup restore | Monthly | Restore to staging |
| Load test | Monthly | `node api/tests/load-test.js` |
| Review monitoring | Monthly | Check UptimeRobot stats |
| Renew domain | Annually | Namecheap/Cloudflare |

---

## Troubleshooting

### API won't start
```bash
pm2 logs keebshelf-api --lines 50
# Check for port conflicts, missing env vars
```

### High memory usage
```bash
pm2 monit
# Check for memory leaks, restart if >512MB
```

### Rate limiting not working
- Verify single instance (in-memory store)
- Check X-RateLimit headers in responses

### Data not updating
```bash
tail -f /home/klondike/Desktop/keyboard-tracker/logs/cron.log
# Check scraper is running, check git push
```

---

**Checklist Version:** 1.0  
**Last Updated:** 2026-02-21  
**Owner:** Alex
