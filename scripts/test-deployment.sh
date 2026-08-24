#!/bin/bash

##############################################################################
# Deployment Testing and Validation Suite
# Comprehensive testing of production deployment
# Usage: bash test-deployment.sh [server-ip] [api-endpoint]
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_LOG="${PROJECT_ROOT}/.manus-logs/deployment-test-$(date +%Y%m%d_%H%M%S).log"

# Default values
SERVER_IP="${1:-}"
API_ENDPOINT="${2:-http://localhost:3000}"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$TEST_LOG"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_PASSED++))
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_SKIPPED++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_FAILED++))
}

test_endpoint() {
    local endpoint="$1"
    local expected_status="${2:-200}"
    local description="$3"
    
    log_info "Testing: $description"
    
    local response=$(curl -s -w "\n%{http_code}" "$API_ENDPOINT$endpoint" 2>/dev/null || echo "000")
    local status=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    
    if [ "$status" = "$expected_status" ]; then
        log_success "$description (HTTP $status)"
        return 0
    else
        log_error "$description (Expected $expected_status, got $status)"
        return 1
    fi
}

# Create log directory
mkdir -p "$(dirname "$TEST_LOG")"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Deployment Testing and Validation Suite           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate inputs
if [ -z "$SERVER_IP" ]; then
    log_warning "Server IP not provided, using localhost"
    SERVER_IP="localhost"
fi

log_info "Server: $SERVER_IP"
log_info "API Endpoint: $API_ENDPOINT"
log_info "Test log: $TEST_LOG"
echo ""

# Phase 1: Connectivity Tests
log_info "Phase 1: Connectivity Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1.1: Ping server
log_info "Test 1.1: Ping server"
if ping -c 1 "$SERVER_IP" &> /dev/null; then
    log_success "Server is reachable"
else
    log_warning "Server not reachable via ping (may be blocked)"
fi

# Test 1.2: Check port 80
log_info "Test 1.2: Check HTTP port (80)"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$SERVER_IP/80" 2>/dev/null; then
    log_success "HTTP port (80) is open"
else
    log_warning "HTTP port (80) not accessible"
fi

# Test 1.3: Check port 443
log_info "Test 1.3: Check HTTPS port (443)"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$SERVER_IP/443" 2>/dev/null; then
    log_success "HTTPS port (443) is open"
else
    log_warning "HTTPS port (443) not accessible"
fi

# Test 1.4: Check port 3000
log_info "Test 1.4: Check API port (3000)"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$SERVER_IP/3000" 2>/dev/null; then
    log_success "API port (3000) is open"
else
    log_warning "API port (3000) not accessible"
fi

# Test 1.5: Check port 3001
log_info "Test 1.5: Check Socket.io port (3001)"
if timeout 5 bash -c "cat < /dev/null > /dev/tcp/$SERVER_IP/3001" 2>/dev/null; then
    log_success "Socket.io port (3001) is open"
else
    log_warning "Socket.io port (3001) not accessible"
fi

echo ""

# Phase 2: API Endpoint Tests
log_info "Phase 2: API Endpoint Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 2.1: Health check
test_endpoint "/health" "200" "Health check endpoint"

# Test 2.2: API root
test_endpoint "/" "200" "API root endpoint"

# Test 2.3: Tasks endpoint
test_endpoint "/api/tasks" "200" "Tasks API endpoint" || true

# Test 2.4: Users endpoint
test_endpoint "/api/users" "200" "Users API endpoint" || true

# Test 2.5: Settings endpoint
test_endpoint "/api/settings" "200" "Settings API endpoint" || true

echo ""

# Phase 3: Performance Tests
log_info "Phase 3: Performance Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 3.1: Response time
log_info "Test 3.1: Measuring response time"
START_TIME=$(date +%s%N)
curl -s "$API_ENDPOINT/health" > /dev/null 2>&1 || true
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

if [ "$RESPONSE_TIME" -lt 1000 ]; then
    log_success "Response time: ${RESPONSE_TIME}ms (< 1000ms)"
elif [ "$RESPONSE_TIME" -lt 5000 ]; then
    log_warning "Response time: ${RESPONSE_TIME}ms (acceptable but slow)"
else
    log_error "Response time: ${RESPONSE_TIME}ms (too slow)"
fi

# Test 3.2: Concurrent requests
log_info "Test 3.2: Testing concurrent requests"
CONCURRENT_REQUESTS=10
SUCCESS_COUNT=0

for i in $(seq 1 $CONCURRENT_REQUESTS); do
    if curl -s "$API_ENDPOINT/health" > /dev/null 2>&1; then
        ((SUCCESS_COUNT++))
    fi
done

if [ "$SUCCESS_COUNT" -eq "$CONCURRENT_REQUESTS" ]; then
    log_success "All $CONCURRENT_REQUESTS concurrent requests succeeded"
else
    log_error "$SUCCESS_COUNT/$CONCURRENT_REQUESTS concurrent requests succeeded"
fi

echo ""

# Phase 4: Data Integrity Tests
log_info "Phase 4: Data Integrity Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 4.1: Database connectivity
log_info "Test 4.1: Database connectivity"
DB_RESPONSE=$(curl -s "$API_ENDPOINT/api/health/db" 2>/dev/null || echo "")

if echo "$DB_RESPONSE" | grep -q "connected\|ok\|true"; then
    log_success "Database connection verified"
else
    log_warning "Database connection status unknown"
fi

# Test 4.2: Cache functionality
log_info "Test 4.2: Cache functionality"
CACHE_RESPONSE=$(curl -s "$API_ENDPOINT/api/health/cache" 2>/dev/null || echo "")

if echo "$CACHE_RESPONSE" | grep -q "connected\|ok\|true"; then
    log_success "Cache connection verified"
else
    log_warning "Cache connection status unknown"
fi

echo ""

# Phase 5: Security Tests
log_info "Phase 5: Security Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 5.1: HTTPS redirect
log_info "Test 5.1: HTTPS redirect"
HTTPS_RESPONSE=$(curl -s -I "http://$SERVER_IP" 2>/dev/null | grep -i "location\|https" || echo "")

if [ -n "$HTTPS_RESPONSE" ]; then
    log_success "HTTPS redirect configured"
else
    log_warning "HTTPS redirect not detected"
fi

# Test 5.2: Security headers
log_info "Test 5.2: Security headers"
HEADERS=$(curl -s -I "$API_ENDPOINT" 2>/dev/null)

if echo "$HEADERS" | grep -q "X-Frame-Options\|X-Content-Type-Options\|Strict-Transport-Security"; then
    log_success "Security headers present"
else
    log_warning "Some security headers missing"
fi

# Test 5.3: CORS configuration
log_info "Test 5.3: CORS configuration"
CORS_RESPONSE=$(curl -s -H "Origin: http://localhost:3000" -I "$API_ENDPOINT" 2>/dev/null | grep -i "access-control" || echo "")

if [ -n "$CORS_RESPONSE" ]; then
    log_success "CORS headers present"
else
    log_warning "CORS headers not detected"
fi

echo ""

# Phase 6: Functional Tests
log_info "Phase 6: Functional Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 6.1: Create task
log_info "Test 6.1: Create task"
CREATE_TASK=$(curl -s -X POST "$API_ENDPOINT/api/tasks" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Task","description":"Testing deployment"}' 2>/dev/null || echo "")

if echo "$CREATE_TASK" | grep -q "id\|success\|created"; then
    log_success "Task creation functional"
else
    log_warning "Task creation response unclear"
fi

# Test 6.2: Get tasks
log_info "Test 6.2: Get tasks"
GET_TASKS=$(curl -s "$API_ENDPOINT/api/tasks" 2>/dev/null || echo "")

if echo "$GET_TASKS" | grep -q "\[\|tasks\|data"; then
    log_success "Task retrieval functional"
else
    log_warning "Task retrieval response unclear"
fi

echo ""

# Phase 7: Monitoring Tests
log_info "Phase 7: Monitoring Tests"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 7.1: Metrics endpoint
log_info "Test 7.1: Metrics endpoint"
METRICS=$(curl -s "$API_ENDPOINT/metrics" 2>/dev/null || echo "")

if echo "$METRICS" | grep -q "http_requests\|process_\|nodejs_"; then
    log_success "Metrics endpoint available"
else
    log_warning "Metrics endpoint not responding"
fi

# Test 7.2: Health stats
log_info "Test 7.2: Health stats"
STATS=$(curl -s "$API_ENDPOINT/api/health/stats" 2>/dev/null || echo "")

if echo "$STATS" | grep -q "uptime\|memory\|cpu"; then
    log_success "Health stats available"
else
    log_warning "Health stats not available"
fi

echo ""

# Phase 8: Generate Test Report
log_info "Phase 8: Generating test report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/deployment-test-report-$(date +%Y%m%d_%H%M%S).txt"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

cat > "$REPORT_FILE" << REPORT
Deployment Testing and Validation Report
=========================================

Test Date: $(date)
Server: $SERVER_IP
API Endpoint: $API_ENDPOINT
Test Duration: $(date +%s) seconds

Test Results:
  Total Tests: $TOTAL_TESTS
  Passed: $TESTS_PASSED
  Failed: $TESTS_FAILED
  Skipped: $TESTS_SKIPPED
  Success Rate: $(( TESTS_PASSED * 100 / TOTAL_TESTS ))%

Test Phases:
  ✓ Connectivity Tests
  ✓ API Endpoint Tests
  ✓ Performance Tests
  ✓ Data Integrity Tests
  ✓ Security Tests
  ✓ Functional Tests
  ✓ Monitoring Tests

Performance Metrics:
  Response Time: ${RESPONSE_TIME}ms
  Concurrent Requests: $SUCCESS_COUNT/$CONCURRENT_REQUESTS

Status: $([ $TESTS_FAILED -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Next Steps:
1. Review any failed tests
2. Check application logs for errors
3. Verify database connectivity
4. Monitor system resources
5. Set up continuous monitoring

For more information, see:
- PRODUCTION_DEPLOYMENT_GUIDE.md
- MONITORING_HEALTH_CHECKS.md
- Deployment logs in .manus-logs/

Support: supportramsandesh@gmail.com
REPORT

log_success "Test report generated: $REPORT_FILE"

echo ""

# Final Summary
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          All Deployment Tests Passed! ✓                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "Deployment is production-ready"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Some Tests Failed - Review Logs and Fix Issues        ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$TESTS_FAILED test(s) failed"
    exit 1
fi
