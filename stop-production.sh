#!/bin/bash
# Keebshelf API Stop Script

echo "🛑 Stopping Keebshelf API..."

# Stop pm2 process
pm2 stop keebshelf-api 2>/dev/null || echo "ℹ️  keebshelf-api not running"

# Stop Cloudflare tunnel
pkill -f "cloudflared.*keebshelf" 2>/dev/null || echo "ℹ️  Cloudflare tunnel not running"

echo "✅ Keebshelf API stopped"
