#!/bin/bash
# Start Switchyard Analytics Dashboard

cd "$(dirname "$0")"

echo "📊 Starting Switchyard Analytics..."
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Install it from: https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install express cors
fi

# Start the server
echo "🚀 Starting dashboard server..."
echo ""
node live-dashboard.js
