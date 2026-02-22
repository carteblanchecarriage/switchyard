#!/bin/bash
# Hourly Git Push Script
# Pushes all pending changes to GitHub once per hour

SITE_DIR="/home/klondike/Desktop/keyboard-tracker"
LOG_FILE="$SITE_DIR/logs/auto-push.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

cd "$SITE_DIR"

# Check if there are any changes to commit
if git diff --quiet HEAD 2>/dev/null && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo "[$TIMESTAMP] No changes to push" >> "$LOG_FILE"
    exit 0
fi

# Add all changes except logs and temp files
git add -A

# Commit with timestamp
COMMIT_MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M') batch update"
git commit -m "$COMMIT_MSG" >> "$LOG_FILE" 2>&1

# Push to GitHub
git push origin master >> "$LOG_FILE" 2>&1
if [ $? -eq 0 ]; then
    echo "[$TIMESTAMP] Successfully pushed to GitHub" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] Push failed" >> "$LOG_FILE"
fi
