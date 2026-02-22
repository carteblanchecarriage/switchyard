#!/bin/bash
# Keebshelf Backup Script
# Run daily via cron: 0 2 * * * /home/klondike/Desktop/keyboard-tracker/tools/backup.sh

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/home/klondike/backups/keebshelf}"
PROJECT_DIR="/home/klondike/Desktop/keyboard-tracker"
RETENTION_DAYS=30
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DATE=$(date +%Y-%m-%d)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1"
}

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup data files
log "Backing up data files..."
tar czf "$BACKUP_DIR/data-$TIMESTAMP.tar.gz" \
    -C "$PROJECT_DIR" \
    data.json \
    data/keyboard-data.json \
    2>/dev/null || warn "Some data files not found"

# Backup logs (last 7 days)
log "Backing up recent logs..."
find "$PROJECT_DIR/logs" -name "*.log" -mtime -7 -print0 | \
    tar czf "$BACKUP_DIR/logs-$TIMESTAMP.tar.gz" --null -T - 2>/dev/null || \
    warn "No recent logs to backup"

# Backup configuration
log "Backing up configuration..."
tar czf "$BACKUP_DIR/config-$TIMESTAMP.tar.gz" \
    -C "$PROJECT_DIR" \
    ecosystem.json \
    package.json \
    .env.example \
    2>/dev/null || warn "Some config files not found"

# Backup if .env exists (careful - contains secrets)
if [ -f "$PROJECT_DIR/.env" ]; then
    log "Backing up environment file..."
    cp "$PROJECT_DIR/.env" "$BACKUP_DIR/.env-$TIMESTAMP.bak"
    chmod 600 "$BACKUP_DIR/.env-$TIMESTAMP.bak"
fi

# Create restore script
log "Creating restore script..."
cat > "$BACKUP_DIR/restore-$TIMESTAMP.sh" << 'EOF'
#!/bin/bash
# Keebshelf Restore Script
# Usage: ./restore.sh <backup-file>

if [ -z "$1" ]; then
    echo "Usage: $0 <backup-file>"
    echo "Example: $0 data-20260221-120000.tar.gz"
    exit 1
fi

RESTORE_DIR="/home/klondike/Desktop/keyboard-tracker"
BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Stop services
pm2 stop keebshelf-api 2>/dev/null || true

# Restore
log "Restoring from $BACKUP_FILE..."
tar xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# Restart services
pm2 restart keebshelf-api

echo "✅ Restore completed!"
EOF

cp "$BACKUP_DIR/restore-$TIMESTAMP.sh" "$BACKUP_DIR/restore-latest.sh"
chmod +x "$BACKUP_DIR/restore-$TIMESTAMP.sh"
chmod +x "$BACKUP_DIR/restore-latest.sh"

# Clean old backups
log "Cleaning backups older than $RETENTION_DAYS days..."
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name ".env-*.bak" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR" -name "restore-*.sh" -mtime +$RETENTION_DAYS -delete

# Calculate backup size
BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)

# Log completion
echo "[$TIMESTAMP] Backup completed. Size: $BACKUP_SIZE. Files remaining: $(ls -1 $BACKUP_DIR/*.tar.gz 2>/dev/null | wc -l)" >> "$PROJECT_DIR/logs/backup.log"

log "Backup completed successfully!"
log "Backup location: $BACKUP_DIR/data-$TIMESTAMP.tar.gz"
log "Total backup size: $BACKUP_SIZE"
log "To restore: $BACKUP_DIR/restore-$TIMESTAMP.sh data-$TIMESTAMP.tar.gz"
