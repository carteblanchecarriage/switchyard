# Switchyard Analytics - Session Notes

## 📊 Overview

Simple local analytics system that tracks affiliate clicks, product views, and searches. Data persists between sessions in `data/tracking.json`.

## 🚀 Quick Start (For Future Sessions)

When you return and I need to restart analytics:

```bash
cd /home/klondike/Desktop/keyboard-tracker/analytics
./start-analytics.sh
```

**Then visit:** http://localhost:3456/analytics

## 📁 Files

| File | Purpose |
|------|---------|
| `live-dashboard.js` | Main server that serves dashboard |
| `start-analytics.sh` | Easy startup script |
| `data/tracking.json` | **PERSISTENT DATA** - All clicks/views stored here |
| `logs/server.log` | Server output log |

## 💾 Data Persistence

**All data survives restarts!**

```json
// data/tracking.json structure:
{
  "clicks": [
    {
      "timestamp": "2026-02-26T20:00:00.000Z",
      "type": "affiliate_click",
      "product": "Keychron Q1 Pro",
      "vendor": "Keychron",
      "category": "keyboard",
      "price": "$199"
    }
  ],
  "views": [...],
  "searches": [...]
}
```

## 📈 What You Can See

When you come back in a week:

1. **Total Clicks** - How many affiliate links clicked
2. **Product Views** - How many times products were viewed
3. **Top Products** - Which products are most popular
4. **Top Vendors** - Which vendors get most clicks
5. **Recent Searches** - What users are looking for
6. **Conversion Rate** - Clicks ÷ Views

## 🔍 Viewing Historical Data

### Option 1: Dashboard (Visual)
```bash
# Start server
./start-analytics.sh

# Open browser
open http://localhost:3456/analytics
```

### Option 2: Raw Data (JSON)
```bash
# View all clicks
cat data/tracking.json | jq '.clicks'

# Count total clicks
cat data/tracking.json | jq '.clicks | length'

# Top vendors
cat data/tracking.json | jq -r '.clicks | group_by(.vendor) | map({vendor: .[0].vendor, count: length}) | sort_by(.count) | reverse | .[0:5]'
```

### Option 3: Generate Report
```bash
node daily-report.js
```

## 🔄 Session Continuity

**If I'm restarted and you're gone:**

1. The data file `data/tracking.json` stays on disk
2. When I restart, just run `./start-analytics.sh`
3. Dashboard shows all historical data

**Example scenario:**
```
Week 1: You use site, data saves to tracking.json
Week 2: I restart, you return
Week 2: Run ./start-analytics.sh
Week 2: Dashboard shows Week 1 + Week 2 data combined
```

## 📊 Interpreting Results

### Good Signs:
- **High clicks on specific products** → Feature them on homepage
- **Top vendor emerging** → Add more of their products
- **Popular search terms** → Create content/guides for those
- **2-5% conversion rate** → Healthy engagement

### Red Flags:
- **Many views, few clicks** → Product may be out of stock
- **High clicks, no sales** → Check affiliate links work
- **Low overall traffic** → Need SEO/marketing
- **Search with no results** → Add those products

## 🎯 Optimization Actions

**Based on weekly data:**

```markdown
1. Top 5 products
   → Move to homepage "Trending" section
   → Add to "Popular" category

2. Top 3 vendors  
   → Feature vendor logos on homepage
   → Add more of their products

3. Popular searches with few results
   → Scrape more of those products
   → Create guides for those categories

4. Low conversion products
   → Check if out of stock
   → Compare prices
   → Add alternatives
```

## 🛠️ Maintenance

### Check Server Status:
```bash
lsof -ti:3456  # Get PID
curl http://localhost:3456/analytics  # Test dashboard
```

### Backup Data:
```bash
cp data/tracking.json data/tracking-backup-$(date +%Y%m%d).json
```

### Reset Data (if needed):
```bash
# Backup first
cp data/tracking.json data/tracking-backup-$(date +%Y%m%d).json

# Reset
echo '{"clicks": [], "views": [], "searches": []}' > data/tracking.json
```

## 📝 Sample Output (After 1 Week)

```
📊 SWITCHYARD ANALYTICS

Total Clicks:   247
Product Views:  1,892
Searches:       156
Conversion:     13.1%

🏆 Top Products
1. Keychron Q1 Pro         34 clicks
2. KBDfans Tofu65          28 clicks
3. Drop CTRL               21 clicks
4. NovelKeys NK65          19 clicks
5. Epomaker TH80           17 clicks

📊 Top Vendors
Keychron    89 clicks
KBDfans     76 clicks
Drop        42 clicks
NovelKeys   31 clicks

🔍 Recent Searches
"budget 60%"      12 searches
"gmk keycaps"     8 searches
"silent switches" 6 searches
```

## 🔐 Important Notes

1. **Data is local only** - Not sent to external analytics (unless you set up GA4)
2. **No personal data collected** - Just clicks, not users
3. **Works offline** - No internet needed for dashboard
4. **Auto-creates directories** - First run sets everything up

## 💰 Revenue Estimation

Once you have a week of data:

```javascript
// From dashboard metrics:
const dailyClicks = 35;        // From analytics
const conversionRate = 0.03;   // 3% of clicks buy
const avgOrderValue = 150;     // $150 per order
const avgCommission = 0.08;    // 8% commission

const dailyRevenue = dailyClicks * conversionRate * avgOrderValue * avgCommission;
// = $35/day
// = $1,050/month
```

Track this weekly and optimize based on which products/vendors convert best!

---

**Last Updated:** 2026-02-26
**Next Check:** When you return (data will be here!)
