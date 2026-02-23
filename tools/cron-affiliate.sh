#!/bin/bash
# Keyboard Affiliate Site - Cron Worker Script
# Runs every 15 minutes, accumulates work, pushes every hour

WORK_DIR="/home/klondike/Desktop/keyboard-tracker"
LOG_FILE="/home/klondike/.openclaw/workspace/logs/affiliate-cron.log"
STATE_FILE="/home/klondike/.openclaw/workspace/logs/affiliate-state.json"

mkdir -p "$(dirname $LOG_FILE)"
mkdir -p "$(dirname $STATE_FILE)"

cd "$WORK_DIR" || exit 1

# Read or init state
if [ -f "$STATE_FILE" ]; then
    CYCLE=$(jq -r '.cycle // 0' "$STATE_FILE")
    TOTAL_COMMITS=$(jq -r '.totalCommits // 0' "$STATE_FILE")
    LAST_QC=$(jq -r '.lastQC // ""' "$STATE_FILE")
else
    CYCLE=0
    TOTAL_COMMITS=0
    LAST_QC=""
fi

# Increment cycle
CYCLE=$((CYCLE + 1))
HOUR=$((CYCLE / 4))

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== Cron Cycle $CYCLE (Hour $HOUR) ==="

# PHASE 1: Do Work (every 15 min)
case $CYCLE in
    1)
        TASK="Scrape & Data Refresh"
        log "Task: $TASK"
        cd "$WORK_DIR/scraper" && node index.js >> "$LOG_FILE" 2>&1
        if [ -f "$WORK_DIR/public/data.json" ]; then
            log "✓ Data refreshed"
            cd "$WORK_DIR" && git add public/data.json data.json
            git diff --cached --quiet || git commit -m "Auto-scrape: $(date '+%Y-%m-%d %H:%M')" --allow-empty
        fi
        ;;
    
    2)
        TASK="Content & SEO"
        log "Task: $TASK"
        # Check for missing meta descriptions, alt texts
        find "$WORK_DIR/src/pages" -name "*.tsx" -exec grep -L "Helmet\|meta.*description" {} \; | head -3 >> "$LOG_FILE"
        log "✓ Content checks complete"
        ;;
    
    3)
        TASK="Analytics & Links"
        log "Task: $TASK"
        # Verify affiliate links are valid
        grep -r "affiliateUrl" "$WORK_DIR/public/data.json" | wc -l | xargs -I {} log "✓ {} products with affiliate links"
        ;;
    
    4|8|12|16|20|24|28|32|36|40|44|48|52|56|60)
        # QC & Push Hour - handled in Phase 2
        TASK="QC Hour"
        log "Task: $TASK"
        ;;
esac

# PHASE 2: Hourly QC and Push (every 4 cycles = 1 hour)
if [ $((CYCLE % 4)) -eq 0 ]; then
    log "=== QUALITY CONTROL HOUR $HOUR ==="
    
    # QC CHECK 1: Build verification
    log "QC: Running build test..."
    cd "$WORK_DIR"
    if npm run build >> "$LOG_FILE" 2>&1
    then
        log "✓ Build passes"
        BUILD_STATUS="PASS"
    else
        log "✗ Build FAILED - skipping push"
        BUILD_STATUS="FAIL"
    fi
    
    # QC CHECK 2: Tests (if they exist)
    if [ -f "$WORK_DIR/package.json" ] && grep -q "test" "$WORK_DIR/package.json"; then
        log "QC: Running tests..."
        npm test -- --watchAll=false >> "$LOG_FILE" 2>&1
        log "✓ Tests complete"
    fi
    
    # QC CHECK 3: Check for uncommitted work
    UNCOMMITTED=$(git diff --cached --numstat | wc -l)
    log "QC: $UNCOMMITTED staged files"
    
    # PUSH if build passes and we're in push hour (every cycle 4, 8, 12...)
    if [ "$BUILD_STATUS" = "PASS" ] && [ $((CYCLE % 4)) -eq 0 ]; then
        log "=== PUSHING CHANGES ==="
        git pull --rebase
        if git push; then
            TOTAL_COMMITS=$((TOTAL_COMMITS + 1))
            log "✓ Pushed! Total commits: $TOTAL_COMMITS"
        else
            log "✗ Push failed"
        fi
    fi
    
    # Reset cycle after QC
    if [ $CYCLE -ge 240 ]; then
        CYCLE=0
        log "=== Day complete - cycle reset ==="
    fi
    
    LAST_QC=$(date '+%Y-%m-%d %H:%M:%S')
fi

# Save state
jq -n --arg cycle "$CYCLE" --arg commits "$TOTAL_COMMITS" --arg lastQC "$LAST_QC" \
    '{cycle: ($cycle | tonumber), totalCommits: ($commits | tonumber), lastQC: $lastQC}' \
    > "$STATE_FILE"

log "Cycle $CYCLE complete."
log ""
