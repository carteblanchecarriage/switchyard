#!/bin/bash
# Keebshelf API Production Startup Script

echo "🎹 Starting Keebshelf API Production Environment..."

# Check if pm2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ pm2 not found. Install with: npm install -g pm2"
    exit 1
fi

# Start the API with pm2
echo "📡 Starting API server..."
pm2 start ecosystem.json

# Save pm2 config to restart on boot
echo "💾 Saving pm2 configuration..."
pm2 save

# Setup startup script if not already done
if [ ! -f /etc/systemd/system/pm2-klondike.service ]; then
    echo "⚙️  Setting up pm2 startup..."
    pm2 startup systemd -u klondike --hp /home/klondike
fi

# Start Cloudflare tunnel (if configured)
if command -v cloudflared &> /dev/null; then
    echo "🌐 Checking Cloudflare tunnel..."
    
    # Check if tunnel already running
    if ! pgrep -f "cloudflared.*keebshelf" > /dev/null; then
        echo "🚀 Starting Cloudflare tunnel for keebshelf..."
        # Create tunnel if it doesn't exist
        if [ ! -f /home/klondike/.cloudflared/keebshelf-cert.pem ]; then
            echo "⚠️  Cloudflare tunnel not configured yet."
            echo "   Run: cloudflared tunnel create keebshelf"
            echo "   Then: cloudflared tunnel route dns keebshelf api.keebshelf.com"
        else
            cloudflared tunnel run keebshelf &
        fi
    else
        echo "✅ Cloudflare tunnel already running"
    fi
else
    echo "⚠️  cloudflared not installed. Install with:"
    echo "   wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
    echo "   sudo dpkg -i cloudflared-linux-amd64.deb"
fi

echo ""
echo "✅ Keebshelf API is running!"
echo "📊 Check status: pm2 status"
echo "📜 View logs: pm2 logs keebshelf-api"
echo "🌐 Local API: http://localhost:3003"
echo "🔍 Health check: curl http://localhost:3003/health"
echo ""
echo "📝 Production checklist:"
echo "   [ ] Add real data to data/keyboard-data.json"
echo "   [ ] Configure Cloudflare tunnel for public access"
echo "   [ ] Set up monitoring/alerting"
echo "   [ ] Add API documentation"
echo ""
