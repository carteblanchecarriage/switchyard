#!/bin/bash
# Switchyard Site Cleanup Script
# Runs every 15 minutes to fix broken links, bad data, CSS issues

SITE_DIR="/home/klondike/Desktop/keyboard-tracker"
LOG_FILE="$SITE_DIR/logs/cleanup.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Starting site cleanup..." >> "$LOG_FILE"

# 1. Fix broken internal links in HTML files
echo "[$TIMESTAMP] Checking for broken links..." >> "$LOG_FILE"

# Pages that actually exist (whitelist)
EXISTING_PAGES=(
    "/"
    "/artisan/"
    "/artisan/index.html"
    "/blog/"
    "/blog/index.html"
    "/blog/what-are-group-buys.html"
    "/beginner/"
    "/beginner/index.html"
    "/contact.html"
    "/privacy.html"
    "/terms.html"
    "/affiliate-disclosure.html"
    "/sitemap.xml"
    "/robots.txt"
)

# Find all HTML files and check for links to non-existent pages
find "$SITE_DIR" -name "*.html" -type f 2>/dev/null | while read html_file; do
    # Remove links to non-existent pages:
    sed -i 's|href="/best/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/best-budget/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/best-60-percent/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/gaming/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/glossary/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/price-alerts/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/dashboard/"|href="/"|g' "$html_file" 2>/dev/null
    sed -i 's|href="/api/pricing"|href="/"|g' "$html_file" 2>/dev/null
done

# 2. Fix any remaining Keebshelf references
echo "[$TIMESTAMP] Checking for old brand names..." >> "$LOG_FILE"
find "$SITE_DIR" -name "*.html" -type f 2>/dev/null | while read html_file; do
    sed -i 's/Keebshelf/Switchyard/g' "$html_file" 2>/dev/null
    sed -i 's/keebshelf/switchyard/g' "$html_file" 2>/dev/null
done

# 3. Clean up data.json symlink if broken
if [ -L "$SITE_DIR/data.json" ]; then
    if [ ! -e "$SITE_DIR/data.json" ]; then
        echo "[$TIMESTAMP] Fixing broken data.json symlink..." >> "$LOG_FILE"
        rm "$SITE_DIR/data.json"
        ln -s data/keyboard-data.json "$SITE_DIR/data.json"
    fi
fi

# 4. Check if API is responding
API_HEALTH=$(curl -s http://localhost:3003/health 2>/dev/null | grep -o '"status":"ok"' || echo "")
if [ -z "$API_HEALTH" ]; then
    echo "[$TIMESTAMP] API not responding, restarting..." >> "$LOG_FILE"
    pm2 restart keebshelf-api 2>/dev/null
fi

# 5. Remove temp files
find "$SITE_DIR" -name "*.tmp" -delete 2>/dev/null
find "$SITE_DIR" -name "*~" -delete 2>/dev/null

# 6. Clean up log files (keep last 30 days)
find "$SITE_DIR/logs" -name "*.log" -mtime +30 -delete 2>/dev/null

echo "[$TIMESTAMP] Cleanup complete." >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"
