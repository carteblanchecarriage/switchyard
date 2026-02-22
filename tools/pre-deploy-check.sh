#!/bin/bash
# Pre-deployment verification script
# Run this before deploying to production

set -e

echo "🔍 Keebshelf Pre-Deployment Verification"
echo "=========================================="
echo ""

PROJECT_DIR="/home/klondike/Desktop/keyboard-tracker"
ERRORS=0
WARNINGS=0

log_success() {
    echo "✅ $1"
}

log_error() {
    echo "❌ $1"
    ((ERRORS++))
}

log_warning() {
    echo "⚠️  $1"
    ((WARNINGS++))
}

# Check 1: Node.js installed
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    log_success "Node.js installed: $NODE_VERSION"
else
    log_error "Node.js not installed"
fi

# Check 2: PM2 installed
echo "📦 Checking PM2..."
if command -v pm2 &> /dev/null; then
    log_success "PM2 installed"
else
    log_error "PM2 not installed. Run: npm install -g pm2"
fi

# Check 3: Environment file exists
echo "📄 Checking environment configuration..."
if [ -f "$PROJECT_DIR/.env" ]; then
    log_success ".env file exists"
else
    if [ -f "$PROJECT_DIR/.env.example" ]; then
        log_warning ".env file missing. Copy from .env.example"
    else
        log_error ".env.example file missing"
    fi
fi

# Check 4: Dependencies installed
echo "📦 Checking dependencies..."
cd "$PROJECT_DIR"
if [ -d "node_modules" ]; then
    log_success "Dependencies installed"
else
    log_error "Dependencies missing. Run: npm install"
fi

# Check 5: Data files exist
echo "📊 Checking data files..."
if [ -f "$PROJECT_DIR/data.json" ]; then
    FILE_SIZE=$(stat -f%z "$PROJECT_DIR/data.json" 2>/dev/null || stat -c%s "$PROJECT_DIR/data.json" 2>/dev/null)
    log_success "data.json exists (${FILE_SIZE} bytes)"
else
    log_error "data.json missing - run scraper first"
fi

# Check 6: Tests pass
echo "🧪 Running tests..."
cd "$PROJECT_DIR/api"
if npm test > /dev/null 2>&1; then
    log_success "Tests pass"
else
    log_warning "Some tests failed - check output"
fi

# Check 7: Check for secrets in code
echo "🔐 Checking for exposed secrets..."
if grep -r "password\|secret\|key\|token" --include="*.js" --include="*.json" "$PROJECT_DIR" | grep -v "node_modules" | grep -v "\.env" | grep -v "example" > /dev/null 2>&1; then
    log_warning "Suspicious strings found - review manually"
else
    log_success "No obvious secrets in code"
fi

# Check 8: Check .gitignore
echo "📝 Checking .gitignore..."
if [ -f "$PROJECT_DIR/.gitignore" ]; then
    if grep -q ".env" "$PROJECT_DIR/.gitignore"; then
        log_success ".env in .gitignore"
    else
        log_warning ".env not in .gitignore"
    fi
else
    log_warning ".gitignore file missing"
fi

# Check 9: API can start (brief check)
echo "🚀 Checking API startup..."
cd "$PROJECT_DIR"
if timeout 5 node api/index-v2.js > /dev/null 2>&1 &
    PID=$!
    sleep 3
    if kill -0 $PID 2>/dev/null; then
        log_success "API starts successfully"
        kill $PID 2>/dev/null || true
    else
        log_error "API failed to start"
    fi
else
    log_warning "Could not verify API startup"
fi

# Check 10: Ports not in use
echo "🌐 Checking port availability..."
if ! netstat -tuln 2>/dev/null | grep -q ":3003"; then
    log_success "Port 3003 is available"
else
    log_warning "Port 3003 may be in use"
fi

# Check 11: Disk space
echo "💾 Checking disk space..."
AVAILABLE=$(df -h / | tail -1 | awk '{print $4}')
USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$USAGE" -lt 80 ]; then
    log_success "Disk space OK ($AVAILABLE available)"
else
    log_warning "Low disk space: $AVAILABLE remaining"
fi

# Check 12: Backup directory
echo "💾 Checking backup setup..."
if [ -d "$PROJECT_DIR/backups" ]; then
    log_success "Backup directory exists"
else
    log_warning "Backup directory missing - create: mkdir -p $PROJECT_DIR/backups"
fi

# Check 13: Log directory
echo "📝 Checking logs directory..."
if [ -d "$PROJECT_DIR/logs" ]; then
    log_success "Logs directory exists"
else
    mkdir -p "$PROJECT_DIR/logs"
    log_warning "Logs directory created"
fi

# Summary
echo ""
echo "=========================================="
echo "📋 Verification Summary"
echo "=========================================="
echo "✅ Passed: $((13 - ERRORS - WARNINGS))"
echo "⚠️  Warnings: $WARNINGS"
echo "❌ Errors: $ERRORS"
echo ""

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "🎉 All checks passed! Ready for deployment."
        exit 0
    else
        echo "⚠️  Warnings found but deployment likely safe."
        echo "   Review warnings before proceeding."
        exit 0
    fi
else
    echo "❌ Errors found. Fix before deploying."
    exit 1
fi
