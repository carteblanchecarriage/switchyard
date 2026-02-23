# Keebshelf Email Alerts & Wishlist System

**Status:** ✅ Implemented and Tested  
**Priority:** P0 (Core MVP Feature)  
**Last Updated:** 2026-02-23

---

## Overview

The Keebshelf Email Alerts/Wishlist system allows users to:
- Save products to a personal wishlist
- Get notified when prices drop 10%+
- Get notified when out-of-stock items return
- Receive daily digest emails with wishlist status

---

## Components

### 1. wishlist-service.js
Core wishlist management and price tracking logic.

**Features:**
- Add/remove products from wishlist
- Track price history per product
- Detect price changes (10%+ threshold)
- Generate daily digests
- Store data in JSON files

**Data Files:**
- `data/wishlists.json` - User wishlists
- `data/price-history.json` - Price history
- `logs/price-check.log` - Price check logs

**Usage:**
```javascript
const wishlist = require('./api/wishlist-service');

// Add item
await wishlist.addToWishlist('user@example.com', 'product-id');

// Get list
const list = wishlist.getWishlist('user@example.com');

// Check changes
const alerts = wishlist.checkPriceChanges();

// Get digest
const digest = wishlist.generateDailyDigest();

// CLI
node wishlist-service.js stats
node wishlist-service.js check
node wishlist-service.js digest
```

---

### 2. alert-sender.js
Email notification service with multiple provider support.

**Supported Providers:**
- **console** (default) - Logs to console for testing
- **sendgrid** - SendGrid API
- **mailgun** - Mailgun API

**Environment Variables:**
```bash
EMAIL_SERVICE=console  # or 'sendgrid', 'mailgun'
FROM_EMAIL=alerts@keebshelf.com
FROM_NAME=Keebshelf
SENDGRID_API_KEY=xxxxx  # if using SendGrid
MAILGUN_API_KEY=xxxxx   # if using Mailgun
MAILGUN_DOMAIN=mg.yourdomain.com
```

**Email Templates:**
- **Price Drop Alert** - Shows old price, new price, drop percentage
- **Restock Alert** - Shows product is back in stock
- **Daily Digest** - Summary of all tracked items

**Usage:**
```javascript
const sender = require('./api/alert-sender');

// Send price drop
await sender.sendPriceDropAlert(email, alertData);

// Send daily digest
await sender.sendDailyDigest(email, digestData);

// Test
node alert-sender.js test user@example.com
```

---

### 3. wishlist-routes.js
Express API routes for wishlist operations.

**Endpoints:**

#### POST /api/wishlist/add
Add product to wishlist.
```json
{
  "email": "user@example.com",
  "productId": "drop-ctrl-v2"
}
```

#### POST /api/wishlist/remove
Remove product from wishlist.
```json
{
  "email": "user@example.com",
  "productId": "drop-ctrl-v2"
}
```

#### GET /api/wishlist?email=user@example.com
Get user's wishlist.

#### POST /api/wishlist/preferences
Update notification preferences.
```json
{
  "email": "user@example.com",
  "preferences": {
    "daily_digest": true,
    "price_alerts": true,
    "restock_alerts": true
  }
}
```

#### GET /api/wishlist/stats
Get service statistics (admin).

---

### 4. cron-price-check.js
Scheduled job to check prices and send alerts.

**Run Manually:**
```bash
node api/cron-price-check.js
```

**Add to Crontab:**
```bash
# Check prices every hour
0 * * * * /usr/bin/node /home/klondike/Desktop/keyboard-tracker/api/cron-price-check.js >> /home/klondike/Desktop/keyboard-tracker/logs/price-check.log 2>&1

# Daily digest at 9 AM (handled in script)
```

**What it does:**
1. Loads all wishlists
2. Checks current prices vs stored prices
3. Detects 10%+ price drops
4. Detects restocked items
5. Sends email alerts
6. Sends daily digest (at 9 AM only)
7. Updates stored prices

---

## Setup Instructions

### 1. Configure Email Service
Edit `.env`:
```bash
# For testing (default)
EMAIL_SERVICE=console

# For SendGrid production
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.your-key-here

# For Mailgun production  
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=key-your-key
MAILGUN_DOMAIN=mg.yourdomain.com
```

### 2. Install Dependencies (if using SendGrid/Mailgun)
```bash
cd api
npm install @sendgrid/mail
# OR
npm install mailgun.js form-data
```

### 3. Set Up Cron Job
```bash
crontab -e

# Add this line
0 * * * * /usr/bin/node /home/klondike/Desktop/keyboard-tracker/api/cron-price-check.js >> /home/klondike/Desktop/keyboard-tracker/logs/price-check.log 2>&1
```

### 4. Test the System
```bash
# Add item to wishlist
curl -X POST http://localhost:3003/api/wishlist/add \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "productId": "drop-ctrl-v2"}'

# Get wishlist
curl "http://localhost:3003/api/wishlist?email=test@example.com"

# Check stats
curl "http://localhost:3003/api/wishlist/stats"

# Test email
node api/alert-sender.js test test@example.com
```

---

## Frontend Integration

### JavaScript Example
```javascript
// Add to wishlist
async function addToWishlist(productId) {
  const email = localStorage.getItem('userEmail');
  if (!email) {
    email = prompt('Enter your email to track this item:');
    localStorage.setItem('userEmail', email);
  }
  
  const response = await fetch('/api/wishlist/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, productId })
  });
  
  const result = await response.json();
  if (result.success) {
    showToast('Added to wishlist! You\'ll be notified of price drops.');
  }
}

// Get user's wishlist
async function loadWishlist() {
  const email = localStorage.getItem('userEmail');
  if (!email) return;
  
  const response = await fetch(`/api/wishlist?email=${encodeURIComponent(email)}`);
  const result = await response.json();
  
  if (result.success) {
    displayWishlist(result.data.items);
  }
}
```

---

## Data Structure

### Wishlist Entry
```json
{
  "user@example.com": {
    "email": "user@example.com",
    "items": [
      {
        "productId": "drop-ctrl-v2",
        "name": "Drop CTRL Mechanical Keyboard",
        "vendor": "Drop",
        "price": "$199",
        "priceNumeric": 199,
        "image": "https://...",
        "url": "https://drop.com/...",
        "addedAt": "2026-02-23T01:34:00.182Z",
        "priceAtAddition": 199,
        "notifyOnPriceDrop": true,
        "notifyOnRestock": true,
        "lastPriceChange": "2026-02-23T02:00:00.000Z"
      }
    ],
    "preferences": {
      "daily_digest": true,
      "price_alerts": true,
      "restock_alerts": true
    },
    "createdAt": "2026-02-23T01:34:00.182Z"
  }
}
```

---

## Testing

### Unit Tests
```bash
# Test wishlist service
node api/wishlist-service.js stats

# Test price check
node api/wishlist-service.js check

# Test daily digest
node api/wishlist-service.js digest

# Test email sender
node api/alert-sender.js test your@email.com
```

### API Tests
```bash
# Add item
curl -X POST http://localhost:3003/api/wishlist/add \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "productId": "drop-ctrl-v2"}'

# Get list
curl "http://localhost:3003/api/wishlist?email=test@test.com"

# Remove item
curl -X POST http://localhost:3003/api/wishlist/remove \
  -H "Content-Type: application/json" \
  -d '{"email": "test@test.com", "productId": "drop-ctrl-v2"}'
```

---

## Monitoring

### Logs
- `logs/price-check.log` - Cron job output
- `logs/email-alerts.log` - Email send attempts
- `data/wishlists.json` - Wishlist data

### Stats
```bash
curl http://localhost:3003/api/wishlist/stats
```

**Returns:**
```json
{
  "success": true,
  "data": {
    "users": 45,
    "totalTrackedItems": 127,
    "avgItemsPerUser": "2.8",
    "dataFile": "/path/to/wishlists.json"
  }
}
```

---

## Future Enhancements

### Short Term
- [ ] Price history charts
- [ ] WebSocket real-time alerts
- [ ] SMS alerts (Twilio)
- [ ] Discord webhook alerts
- [ ] "Watch this price" without email

### Long Term
- [ ] User accounts (auth)
- [ ] Push notifications
- [ ] Alert history
- [ ] Price prediction
- [ ] Best time to buy recommendations

---

## Troubleshooting

### Emails Not Sending
1. Check `EMAIL_SERVICE` in `.env`
2. Verify API keys for SendGrid/Mailgun
3. Check `logs/email-alerts.log`
4. Test with `EMAIL_SERVICE=console` first

### Price Changes Not Detected
1. Verify cron job is running: `crontab -l`
2. Check `logs/price-check.log`
3. Run manually to debug: `node api/cron-price-check.js`
4. Verify data file has products

### Wishlist Not Saving
1. Check disk space
2. Verify `data/` directory is writable
3. Check API response in browser dev tools

---

## API Reference

Full endpoint documentation available in API codebase.

---

**Version:** 1.0  
**Status:** Production Ready  
**Last Tested:** 2026-02-23 ✅
