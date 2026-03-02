#!/bin/bash
# Switchyard Local Scraper - Runs on NUC
# Replaces GitHub Actions (which is failing)
# Runs every 2 hours via cron

set -e  # Exit on error

REPO_DIR="/home/klondike/Desktop/keyboard-tracker"
LOG_DIR="/home/klondike/Desktop/keyboard-tracker/logs"
DATE_STR=$(date +%Y%m%d-%H%M)
LOG_FILE="$LOG_DIR/scrape-$DATE_STR.log"

# Create log directory if needed
mkdir -p "$LOG_DIR"

echo "=========================================" | tee -a "$LOG_FILE"
echo "🚀 Switchyard Scraper - Local Run" | tee -a "$LOG_FILE"
echo "Started: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"

cd "$REPO_DIR"

# Ensure scraper dependencies are installed
echo "📦 Checking dependencies..." | tee -a "$LOG_FILE"
cd scraper
if [ ! -d "node_modules/axios" ] || [ ! -d "node_modules/cheerio" ]; then
    echo "   Installing scraper dependencies..." | tee -a "$LOG_FILE"
    npm install axios cheerio --silent
fi
cd ..

# Get current product count before running
OLD_COUNT=$(jq -r '.metadata.products // .metadata.totalItems // 0' data.json 2>/dev/null || echo "0")
echo "📊 Current products: $OLD_COUNT" | tee -a "$LOG_FILE"

# Run the scraper
echo "🔍 Running scraper..." | tee -a "$LOG_FILE"
node scraper/scraper.js 2>&1 | tee -a "$LOG_FILE"
SCRAPE_EXIT=${PIPESTATUS[0]}

if [ $SCRAPE_EXIT -ne 0 ]; then
    echo "❌ Scraper failed with exit code $SCRAPE_EXIT" | tee -a "$LOG_FILE"
    # Don't exit - we might still have partial data
fi

# Get new product count
NEW_COUNT=$(jq -r '.metadata.products // .metadata.totalItems // 0' data.json 2>/dev/null || echo "0")
echo "📊 New products: $NEW_COUNT" | tee -a "$LOG_FILE"

# Check if data actually changed
if [ "$NEW_COUNT" != "$OLD_COUNT" ]; then
    echo "✅ Product count changed: $OLD_COUNT → $NEW_COUNT" | tee -a "$LOG_FILE"
    
    # Stage and commit
    git add -A
    git commit -m "🔄 Auto-scrape: $NEW_COUNT products ($(date '+%Y-%m-%d %H:%M'))" || true
    
    # Push to GitHub
    echo "🔄 Pushing to GitHub..." | tee -a "$LOG_FILE"
    git push origin master 2>&1 | tee -a "$LOG_FILE" || echo "⚠️ Push failed (may need manual intervention)" | tee -a "$LOG_FILE"
    
    echo "✅ Changes committed and pushed" | tee -a "$LOG_FILE"
else
    echo "📊 No product count change ($NEW_COUNT products)" | tee -a "$LOG_FILE"
    echo "⏭️  Skipping commit (timestamps change but products don't)" | tee -a "$LOG_FILE"
fi

echo "" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"
echo "✅ Scraper run complete" | tee -a "$LOG_FILE"
echo "Finished: $(date '+%Y-%m-%d %H:%M:%S')" | tee -a "$LOG_FILE"
echo "Log saved: $LOG_FILE" | tee -a "$LOG_FILE"
echo "=========================================" | tee -a "$LOG_FILE"

exit 0
