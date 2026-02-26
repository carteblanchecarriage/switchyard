#!/bin/bash
# Switchyard Analytics - Persistent Dashboard Starter
# Usage: ./start-analytics.sh

cd "$(dirname "$0")"

# Create persistent data directory
mkdir -p data

echo "📊 Switchyard Analytics - Persistent Mode"
echo "=========================================="
echo ""
echo "Data stored in: $(pwd)/data/tracking.json"
echo ""

# Check if already running
PID=$(lsof -ti:3456 2>/dev/null)
if [ -n "$PID" ]; then
    echo "⚠️  Analytics server already running (PID: $PID)"
    echo "   Dashboard: http://localhost:3456/analytics"
    echo ""
    echo "To restart:"
    echo "  kill $PID && ./start-analytics.sh"
    exit 0
fi

# Start the server
nohup node live-dashboard.js > logs/server.log 2>&1 &
NEWPID=$!

# Wait for startup
sleep 2

# Check if started
if lsof -ti:3456 > /dev/null 2>&1; then
    echo "✅ Analytics server started!"
    echo ""
    echo "Dashboard: http://localhost:3456/analytics"
    echo "PID: $NEWPID"
    echo ""
    echo "Data persists in: $(pwd)/data/tracking.json"
    echo ""
    echo "Commands:"
    echo "  View dashboard:  open http://localhost:3456/analytics"
    echo "  View logs:     tail -f logs/server.log"
    echo "  Stop server:   kill $NEWPID"
    echo "  View data:     cat data/tracking.json | jq '.clicks | length'"
    echo ""
else
    echo "❌ Failed to start. Check logs/server.log"
fi
