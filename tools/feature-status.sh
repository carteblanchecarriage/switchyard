#!/bin/bash
# Feature Implementation Tracker
# Run this to get current feature status and next priorities

echo "🎯 Keebshelf Feature Status Tracker"
echo "===================================="
echo ""

# Check if critical features exist
echo "Checking feature files..."
echo ""

# Product Modal Enhancement
echo "📦 Product Detail Enhancement:"
if grep -q "hot-swap\|solder\|switch type\|layout" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Enhanced product details present"
else
    echo "   ❌ Not implemented"
fi

# Email/Wishlist System
echo ""
echo "📧 Email/Wishlist System:"
if grep -q "wishlist\|email-capture\|track-item" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Email/wishlist present"
else
    echo "   ❌ Not implemented - PRIORITY P0"
fi

# Price History
if [ -f ~/Desktop/keyboard-tracker/supabase/schema-price-history.sql ]; then
    echo "   ⚠️  Price history schema exists but needs Supabase connection"
else
    echo "   ❌ Price history not implemented"
fi

# Search Enhancement
echo ""
echo "🔍 Search Functionality:"
if grep -q "fuse\|fuse.js\|fuzzy" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Fuzzy search implemented"
else
    echo "   ⚠️  Basic search only (client-side filter)"
fi

# Comparison Tool
echo ""
echo "⚖️  Comparison Tool:"
if grep -q "compare\|comparison\|vs-mode" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Comparison feature present"
else
    echo "   ❌ Not implemented"
fi

# Sorting Options
echo ""
echo "📊 Sorting Options:"
if grep -q "name" ~/Desktop/keyboard-tracker/index.html && grep -q "newest\|latest\|recent" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Multiple sorting options"
else
    echo "   ⚠️  Price sorting only"
fi

# Analytics
echo ""
echo "📈 Analytics:"
if grep -q "gtag\|googletagmanager\|google-analytics\|plausible" ~/Desktop/keyboard-tracker/index.html 2>/dev/null; then
    echo "   ✅ Analytics configured"
else
    echo "   ❌ No analytics detected"
fi

# API
echo ""
echo "🔌 API:"
if [ -f ~/Desktop/keyboard-tracker/api/index-v2.js ]; then
    echo "   ✅ API v2 exists"
else
    echo "   ❌ API not found"
fi

if [ -f ~/Desktop/keyboard-tracker/api/tests/api-monitoring.js ]; then
    echo "   ✅ API monitoring exists"
else
    echo "   ⚠️  No API monitoring"
fi

# Tests
echo ""
echo "🧪 Testing:"
TEST_COUNT=$(find ~/Desktop/keyboard-tracker/api/tests -name "*.js" 2>/dev/null | wc -l)
echo "   Found $TEST_COUNT test files"

# Documentation
echo ""
echo "📚 Documentation:"
DOC_COUNT=$(find ~/Desktop/keyboard-tracker/docs -name "*.md" 2>/dev/null | wc -l)
echo "   Found $DOC_COUNT documentation files"

MARKETING_COUNT=$(find ~/Desktop/keyboard-tracker/marketing -name "*.md" 2>/dev/null | wc -l)
echo "   Found $MARKETING_COUNT marketing files"

echo ""
echo "===================================="
echo ""
echo "📋 Next Priority Actions:"
echo ""
echo "P0 (Launch This Week):"
echo "   1. Implement product detail enhancement"
echo "   2. Add email capture modal"
echo "   3. Set up Google Analytics"
echo ""
echo "P1 (Launch Week):"
echo "   4. Empty state UI"
echo "   5. Test affiliate links"
echo "   6. Final launch content"
echo ""
echo "P2 (Post-Launch Week 1-2):"
echo "   7. Email alerts system"
echo "   8. Price history charts"
echo "   9. Advanced sorting"
echo ""
echo "P3 (Post-Launch Month 1+):"
echo "   10. Comparison tool"
echo "   11. Reviews system"
echo "   12. Wizard"
echo ""
echo "Run 'cat ~/Desktop/keyboard-tracker/docs/MVP-GAP-ANALYSIS.md' for full analysis"
