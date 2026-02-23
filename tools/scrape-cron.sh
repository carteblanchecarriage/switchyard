#!/bin/bash
# Keebshelf Scraper - Runs every 2 hours (reduced from 30 min)
# Place this in crontab: 0 */2 * * * /home/klondike/Desktop/keyboard-tracker/tools/scrape-cron.sh

cd /home/klondike/Desktop/keyboard-tracker

# Run scraper
node scraper/scraper-v2.js > logs/scrape-$(date +%Y%m%d-%H%M).log 2>&1

# Track prices (if Supabase configured)
if [ -f .env ]; then
    source .env
    node tools/price-tracker.js > logs/price-tracker-$(date +%Y%m%d-%H%M).log 2>&1
fi

# Only commit if PRODUCT COUNT changed (not just timestamps)
NEW_COUNT=$(cat data.json | jq -r '.metadata.totalProducts // 0')
OLD_COUNT=$(git show HEAD:data.json 2>/dev/null | jq -r '.metadata.totalProducts // 0' || echo "0")

echo "Product count: $OLD_COUNT → $NEW_COUNT"

if [ "$NEW_COUNT" != "$OLD_COUNT" ]; then
    git add data.json dashboard/data.json
    git commit -m "data: Update products - $NEW_COUNT items ($(date '+%Y-%m-%d %H:%M'))"
    git push origin master
    echo "Pushed: Product count changed from $OLD_COUNT to $NEW_COUNT"
else
    echo "Skipped: Product count unchanged ($NEW_COUNT)"
    # Don't commit - timestamps change but products don't
fi