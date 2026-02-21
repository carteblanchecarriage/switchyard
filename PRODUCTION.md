# Keebshelf Production Setup

## 2-Hour Cron Configuration

### Option 1: System Crontab
```bash
# Edit crontab
crontab -e

# Add this line to run every 2 hours
0 */2 * * * /home/klondike/Desktop/keyboard-tracker/tools/scrape-cron.sh
```

### Option 2: PM2 (Recommended)
```bash
# Install PM2 if not present
npm install -g pm2

# Run ecosystem
pm2 start ecosystem.json

# Save
pm2 save
pm2 startup
```

## Environment Variables

Create `.env` file:
```bash
# Supabase (for price tracking & alerts)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Email service (for alerts)
# SENDGRID_API_KEY=your-key
# MAILGUN_API_KEY=your-key
```

## Price Tracking

Enable price history:
1. Set up Supabase project
2. Run `supabase/schema-price-history.sql` in SQL Editor
3. Set env vars above

Price history starts collecting automatically on next scrape.

## Email Alerts

To enable daily digest:
1. Configure SendGrid or Mailgun
2. Add API key to `.env`
3. Update `api/subscribe.js` with email service

## Monitoring

Check logs:
```bash
# Recent scrapes
tail -20 logs/cron.log

# Recent output
ls -la logs/ | tail -20
```

## Manual Refresh

```bash
cd /home/klondike/Desktop/keyboard-tracker
node scraper/scraper-v2.js
```

## Features Added

✅ **2-hour scraping** - Fresh data twice daily
✅ **Price history** - Track price trends over time
✅ **Subscribe modal** - Email alerts for users
✅ **Daily digest** - New products + price drops
✅ **Beautiful UI** - Newspaper aesthetic
✅ **Sorting** - Price, name, vendor filters
✅ **Search** - Full-text search

## Next Steps

- [ ] Connect email service
- [ ] Add product detail pages
- [ ] Price trend charts
- [ ] Mobile app
- [ ] Discord notifications
- [ ] API rate limiting

## Ethics

- ✅ Public data only (same as search engines)
- ✅ Affiliate links disclosed
- ✅ Equal vendor treatment
- ✅ No fake scarcity
- ✅ Respects robots.txt