#!/bin/bash
#
# Keebshelf Pre-Flight Deployment Check
# Run this before deploying to production
# Usage: ./tools/pre-flight-check.sh

set -e

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║         KEEBSHELF PRE-FLIGHT DEPLOYMENT CHECK              ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

function success() {
  echo -e "${GREEN}✅${NC} $1"
}

function error() {
  echo -e "${RED}❌${NC} $1"
  ((ERRORS++))
}

function warning() {
  echo -e "${YELLOW}⚠️${NC} $1"
  ((WARNINGS++))
}

function info() {
  echo -e "ℹ️  $1"
}

echo "━━ Environment Check ━━"

# Check Node.js version
NODE_VERSION=$(node --version 2>/dev/null || echo "")
if [[ -n "$NODE_VERSION" ]]; then
  success "Node.js installed: $NODE_VERSION"
else
  error "Node.js not installed"
fi

# Check PM2
if command -v pm2 > /dev/null 2>&1; then
  success "PM2 installed"
else
  warning "PM2 not installed (optional but recommended)"
fi

# Check .env file
if [[ -f ".env" ]]; then
  success ".env file exists"
  
  # Check if secrets are protected
  if grep -q "SUPABASE_SERVICE_KEY" .env 2>/dev/null; then
    if grep -q "^SUPABASE_SERVICE_KEY=your-" .env 2>/dev/null || \
       ! grep -q "^SUPABASE_SERVICE_KEY=" .env 2>/dev/null || \
       grep -q "^# SUPABASE_SERVICE_KEY" .env 2>/dev/null; then
      info "Supabase not configured (OK for basic deployment)"
    else
      warning "Supabase configured - ensure .env is in .gitignore"
    fi
  fi
else
  error ".env file missing"
  info "Run: cp .env.example .env"
fi

# Check .gitignore
if [[ -f ".gitignore" ]]; then
  if grep -q ".env" .gitignore; then
    success ".env is protected in .gitignore"
  else
    warning ".env may not be protected in .gitignore"
  fi
else
  error ".gitignore file missing"
fi

echo ""
echo "━━ File Structure Check ━━"

# Critical files
CRITICAL_FILES=(
  "api/index.js"
  "data/keyboard-data.json"
  "index.html"
  "package.json"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    success "Critical file: $file"
  else
    error "Missing critical file: $file"
  fi
done

# Check data file integrity
if [[ -f "data/keyboard-data.json" ]]; then
  if node -e "JSON.parse(require('fs').readFileSync('data/keyboard-data.json'))" 2>/dev/null; then
    success "Data file is valid JSON"
    DATA_SIZE=$(stat -c%s "data/keyboard-data.json" 2>/dev/null || stat -f%z "data/keyboard-data.json" 2>/dev/null || echo "0")
    DATA_SIZE_KB=$((DATA_SIZE / 1024))
    info "Data file size: ${DATA_SIZE_KB}KB"
  else
    error "Data file is corrupted (invalid JSON)"
  fi
else
  error "Data file missing"
fi

echo ""
echo "━━ API Check ━━"

# Check if API can start
cd api
if node -e "require('./index.js')" 2>/dev/null; then
  success "API can be loaded"
else
  error "API has load errors"
fi
cd ..

# Test if API is running
if curl -s http://localhost:3003/health > /dev/null 2>&1; then
  success "API is running on port 3003"
  
  # Test endpoints
  ENDPOINTS=("/health" "/api/groupbuys" "/api/search?q=keychron" "/api/vendors")
  
  for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3003$endpoint" 2>/dev/null || echo "000")
    if [[ "$STATUS" == "200" ]]; then
      success "Endpoint $endpoint: $STATUS"
    else
      warning "Endpoint $endpoint returned $STATUS"
    fi
  done
  
  # Check security headers
  if curl -s -I http://localhost:3003/health 2>/dev/null | grep -q "X-Frame-Options"; then
    success "Security headers present"
  else
    warning "Security headers may be missing"
  fi
  
  # Check rate limiting
  if curl -s -I http://localhost:3003/health 2>/dev/null | grep -q "X-RateLimit"; then
    success "Rate limiting headers present"
  else
    warning "Rate limiting headers not detected"
  fi
else
  warning "API not running on port 3003 (start with: npm start)"
fi

echo ""
echo "━━ Security Check ━━"

# Check for secrets in code
if grep -r "api_key\|apikey\|password\|secret" --include="*.js" --include="*.ts" . 2>/dev/null | grep -v "node_modules" | grep -v ".env.example" | head -3; then
  warning "Potential secrets found in code (review above)"
else
  success "No obvious secrets in code"
fi

# Check npm for vulnerabilities
if command -v npm > /dev/null 2>&1; then
  VULNS=$(npm audit --json 2>/dev/null | node -e "
    const data = '';
    process.stdin.on('data', d => data.push(d));
    process.stdin.on('end', () => {
      try {
        const json = JSON.parse(data.join(''));
        console.log(json.metadata?.vulnerabilities?.total || 0);
      } catch { console.log(0); }
    });
  " 2>/dev/null || echo "0")
  
  if [[ "$VULNS" -eq 0 ]]; then
    success "No npm vulnerabilities"
  else
    warning "$VULNS npm vulnerabilities found"
    info "Run: npm audit fix"
  fi
fi

echo ""
echo "━━ Performance Check ━━"

# Check response times
if curl -s http://localhost:3003/health > /dev/null 2>&1; then
  RES_TIME=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:3003/health 2>/dev/null || echo "999")
  RES_TIME_MS=$(echo "$RES_TIME * 1000" | bc 2>/dev/null || echo "0")
  
  if (( $(echo "$RES_TIME_MS < 100" | bc 2>/dev/null || echo "0") )); then
    success "API response time: ${RES_TIME_MS}ms"
  else
    warning "API response time: ${RES_TIME_MS}ms (should be <100ms)"
  fi
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [[ "$DISK_USAGE" -lt 90 ]]; then
  success "Disk usage: ${DISK_USAGE}%"
else
  error "Disk usage critical: ${DISK_USAGE}%"
fi

# Check memory
if command -v free > /dev/null 2>&1; then
  MEM_AVAILABLE=$(free | grep Mem | awk '{print $7}')
  MEM_MB=$((MEM_AVAILABLE / 1024))
  if [[ "$MEM_MB" -gt 500 ]]; then
    success "Available memory: ${MEM_MB}MB"
  else
    warning "Low memory: ${MEM_MB}MB"
  fi
fi

echo ""
echo "━━ Summary ━━"

if [[ $ERRORS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED${NC}"
  echo ""
  echo "System is ready for production deployment!"
  echo ""
  echo "Next steps:"
  echo "  1. Review DEPLOYMENT-CHECKLIST.md"
  echo "  2. Run: ./start-production.sh"
  echo "  3. Verify with: curl http://localhost:3003/health"
  exit 0
elif [[ $ERRORS -eq 0 ]]; then
  echo -e "${YELLOW}⚠️  DEPLOY WITH CAUTION${NC}"
  echo ""
  echo "$WARNINGS warnings found - system functional but review recommended"
  exit 0
else
  echo -e "${RED}❌ DEPLOYMENT BLOCKED${NC}"
  echo ""
  echo "$ERRORS errors, $WARNINGS warnings found"
  echo "Fix issues above before deploying"
  exit 1
fi
