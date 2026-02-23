#!/bin/bash
# Auto-deploy script - runs scraper and pushes to GitHub
# Cloudflare Pages auto-deploys on every push

set -e

echo "[$(date)] Starting auto-deploy..."

cd /home/klondike/Desktop/keyboard-tracker

# Run scraper
echo "Running scraper..."
node scraper/index.js 2>&1 || echo "Scraper had warnings, continuing..."

# Check if data changed
if git diff --quiet data.json; then
    echo "No data changes, skipping commit"
    exit 0
fi

# Commit and push
echo "Data changed, committing..."
git add data.json
git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M') - New products/prices"
git push origin master

echo "[$(date)] Deploy triggered! Site will update in ~30 seconds."
