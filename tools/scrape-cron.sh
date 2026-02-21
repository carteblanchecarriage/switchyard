#!/bin/bash
# Keebshelf Scraper - Runs every 30 minutes
# Place this in crontab: */30 * * * * /home/klondike/Desktop/keyboard-tracker/tools/scrape-cron.sh

cd /home/klondike/Desktop/keyboard-tracker

# Run scraper
node scraper/scraper-v2.js > logs/scrape-$(date +%Y%m%d-%H%M).log 2>&1

# Track prices (if Supabase configured)
if [ -f .env ]; then
    source .env
    node tools/price-tracker.js > logs/price-tracker-$(date +%Y%m%d-%H%M).log 2>&1
fi

# Push to GitHub (only if changes exist)
git add data/keyboard-data.json data.json dashboard/data.json
if git diff --cached --quiet; then
    echo "No changes to push"
else
    git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M') - $(cat data/keyboard-data.json | jq -r '.metadata.totalProducts // 0') products"
    git push origin master
fi

# Log completion
echo "[$(date)] Keebshelf scraper completed" >> logs/cron.log