#!/bin/bash
# Quick deploy script for Switchyard Analytics Worker

set -e

echo "🚀 Switchyard Analytics Worker Deploy"
echo "======================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler not found. Installing..."
    npm install -g wrangler
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please login to Cloudflare:"
    wrangler login
fi

# Create KV namespace if it doesn't exist
echo ""
echo "📦 Setting up KV namespace..."

# Check for existing KV namespace
KV_ID=$(wrangler kv:namespace list | grep "switchyard-analytics" | head -1 | grep -oP '(?<=id": ")[^"]+' || echo "")

if [ -z "$KV_ID" ]; then
    echo "Creating new KV namespace..."
    wrangler kv:namespace create ANALYTICS_KV
    echo ""
    echo "⚠️  IMPORTANT: Copy the KV ID from above"
    echo "   Then update wrangler.toml with the ID"
    echo ""
    read -p "Did you update wrangler.toml? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Please update wrangler.toml and run again"
        exit 1
    fi
else
    echo "✅ KV namespace already exists"
fi

# Deploy
echo ""
echo "🚀 Deploying worker..."
wrangler deploy

# Get the worker URL
echo ""
echo "✅ Deployed successfully!"
echo ""
echo "📊 Dashboard URL:"
echo "   https://switchyard-analytics.$(wrangler whoami 2>/dev/null | grep 'Account' | awk '{print $2}').workers.dev/dashboard"
echo ""
echo "📝 Next steps:"
echo "   1. Copy the dashboard URL above"
echo "   2. Update public/index.html with the new endpoint"
echo "   3. Update src/hooks/useAnalytics.tsx"
echo "   4. Test with: curl -X POST <worker-url>/track -d '{\"type\":\"test\"}'"
echo ""