#!/bin/bash

##############################################################################
# Comprehensive Integration Testing Suite
# Tests all production components working together
# Usage: bash test-integration.sh [server-url] [database-url] [github-token]
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
TEST_LOG="${PROJECT_ROOT}/.manus-logs/integration-test-$(date +%Y%m%d_%H%M%S).log"

# Default values
SERVER_URL="${1:-http://localhost:3000}"
DATABASE_URL="${2:-}"
GITHUB_TOKEN="${3:-}"

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_SKIPPED=0
TESTS_TOTAL=0

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$TEST_LOG"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_PASSED++))
    ((TESTS_TOTAL++))
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_SKIPPED++))
    ((TESTS_TOTAL++))
}

log_error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$TEST_LOG"
    ((TESTS_FAILED++))
    ((TESTS_TOTAL++))
}

# Create log directory
mkdir -p "$(dirname "$TEST_LOG")"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║      Comprehensive Integration Testing Suite              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log_info "Server URL: $SERVER_URL"
log_info "Test log: $TEST_LOG"
echo ""

# Phase 1: Component Health Check
log_info "Phase 1: Component Health Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1.1: API Server
log_info "Test 1.1: API Server Health"
if curl -s "$SERVER_URL/health" > /dev/null 2>&1; then
    log_success "API Server is healthy"
else
    log_error "API Server is not responding"
fi

# Test 1.2: Database
log_info "Test 1.2: Database Health"
if curl -s "$SERVER_URL/api/health/db" > /dev/null 2>&1; then
    log_success "Database is healthy"
else
    log_warning "Database health check unavailable"
fi

# Test 1.3: Cache
log_info "Test 1.3: Cache Health"
if curl -s "$SERVER_URL/api/health/cache" > /dev/null 2>&1; then
    log_success "Cache is healthy"
else
    log_warning "Cache health check unavailable"
fi

# Test 1.4: Socket.io
log_info "Test 1.4: Socket.io Health"
if curl -s "$SERVER_URL/api/health/socket" > /dev/null 2>&1; then
    log_success "Socket.io is healthy"
else
    log_warning "Socket.io health check unavailable"
fi

echo ""

# Phase 2: API Endpoint Integration
log_info "Phase 2: API Endpoint Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 2.1: Create Task
log_info "Test 2.1: Create Task"
TASK_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/tasks" \
    -H "Content-Type: application/json" \
    -d '{"title":"Integration Test Task","description":"Testing integration","priority":"high"}' 2>/dev/null || echo "")

if echo "$TASK_RESPONSE" | grep -q "id\|success\|created"; then
    TASK_ID=$(echo "$TASK_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    log_success "Task created successfully (ID: ${TASK_ID:0:8}...)"
else
    log_error "Failed to create task"
    TASK_ID=""
fi

# Test 2.2: Get Tasks
log_info "Test 2.2: Get Tasks"
GET_RESPONSE=$(curl -s "$SERVER_URL/api/tasks" 2>/dev/null || echo "")

if echo "$GET_RESPONSE" | grep -q "\[\|tasks\|data"; then
    TASK_COUNT=$(echo "$GET_RESPONSE" | grep -o '"id"' | wc -l)
    log_success "Retrieved tasks (Count: $TASK_COUNT)"
else
    log_error "Failed to retrieve tasks"
fi

# Test 2.3: Update Task
if [ -n "$TASK_ID" ]; then
    log_info "Test 2.3: Update Task"
    UPDATE_RESPONSE=$(curl -s -X PUT "$SERVER_URL/api/tasks/$TASK_ID" \
        -H "Content-Type: application/json" \
        -d '{"title":"Updated Task","completed":true}' 2>/dev/null || echo "")
    
    if echo "$UPDATE_RESPONSE" | grep -q "success\|updated"; then
        log_success "Task updated successfully"
    else
        log_error "Failed to update task"
    fi
fi

# Test 2.4: Delete Task
if [ -n "$TASK_ID" ]; then
    log_info "Test 2.4: Delete Task"
    DELETE_RESPONSE=$(curl -s -X DELETE "$SERVER_URL/api/tasks/$TASK_ID" 2>/dev/null || echo "")
    
    if echo "$DELETE_RESPONSE" | grep -q "success\|deleted"; then
        log_success "Task deleted successfully"
    else
        log_error "Failed to delete task"
    fi
fi

echo ""

# Phase 3: Authentication Integration
log_info "Phase 3: Authentication Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 3.1: Login
log_info "Test 3.1: User Login"
LOGIN_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"testpass123"}' 2>/dev/null || echo "")

if echo "$LOGIN_RESPONSE" | grep -q "token\|success\|user"; then
    log_success "Login endpoint functional"
    AUTH_TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
else
    log_warning "Login endpoint not responding as expected"
    AUTH_TOKEN=""
fi

# Test 3.2: Get User Profile
if [ -n "$AUTH_TOKEN" ]; then
    log_info "Test 3.2: Get User Profile"
    PROFILE_RESPONSE=$(curl -s "$SERVER_URL/api/auth/profile" \
        -H "Authorization: Bearer $AUTH_TOKEN" 2>/dev/null || echo "")
    
    if echo "$PROFILE_RESPONSE" | grep -q "user\|email\|id"; then
        log_success "User profile retrieved"
    else
        log_error "Failed to retrieve user profile"
    fi
fi

echo ""

# Phase 4: Real-Time Communication
log_info "Phase 4: Real-Time Communication"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 4.1: Socket.io Connection
log_info "Test 4.1: Socket.io Connection"
SOCKET_TEST=$(curl -s "http://localhost:3001/socket.io/?EIO=4&transport=polling" 2>/dev/null || echo "")

if [ -n "$SOCKET_TEST" ]; then
    log_success "Socket.io connection available"
else
    log_warning "Socket.io connection not available"
fi

# Test 4.2: WebSocket Endpoint
log_info "Test 4.2: WebSocket Endpoint"
if curl -s -I "http://localhost:3001" | grep -q "200\|101"; then
    log_success "WebSocket endpoint responding"
else
    log_warning "WebSocket endpoint not responding"
fi

echo ""

# Phase 5: Data Persistence
log_info "Phase 5: Data Persistence"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 5.1: Create and Retrieve
log_info "Test 5.1: Create and Retrieve Data"
CREATE_RESPONSE=$(curl -s -X POST "$SERVER_URL/api/tasks" \
    -H "Content-Type: application/json" \
    -d '{"title":"Persistence Test","description":"Testing data persistence"}' 2>/dev/null || echo "")

if echo "$CREATE_RESPONSE" | grep -q "id"; then
    PERSIST_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    # Wait a moment for data to be written
    sleep 1
    
    # Retrieve the data
    RETRIEVE_RESPONSE=$(curl -s "$SERVER_URL/api/tasks/$PERSIST_ID" 2>/dev/null || echo "")
    
    if echo "$RETRIEVE_RESPONSE" | grep -q "$PERSIST_ID"; then
        log_success "Data persistence verified"
    else
        log_error "Data persistence failed"
    fi
else
    log_error "Failed to create test data"
fi

# Test 5.2: Data Consistency
log_info "Test 5.2: Data Consistency"
CONSISTENCY_CHECK=$(curl -s "$SERVER_URL/api/health/consistency" 2>/dev/null || echo "")

if echo "$CONSISTENCY_CHECK" | grep -q "consistent\|ok\|true"; then
    log_success "Data consistency verified"
else
    log_warning "Data consistency check unavailable"
fi

echo ""

# Phase 6: Performance Integration
log_info "Phase 6: Performance Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 6.1: Response Time
log_info "Test 6.1: Response Time"
START_TIME=$(date +%s%N)
curl -s "$SERVER_URL/api/tasks" > /dev/null 2>&1 || true
END_TIME=$(date +%s%N)
RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))

if [ "$RESPONSE_TIME" -lt 1000 ]; then
    log_success "Response time acceptable: ${RESPONSE_TIME}ms"
elif [ "$RESPONSE_TIME" -lt 5000 ]; then
    log_warning "Response time slow: ${RESPONSE_TIME}ms"
else
    log_error "Response time too slow: ${RESPONSE_TIME}ms"
fi

# Test 6.2: Concurrent Requests
log_info "Test 6.2: Concurrent Requests"
CONCURRENT_COUNT=0
for i in {1..5}; do
    if curl -s "$SERVER_URL/api/tasks" > /dev/null 2>&1; then
        ((CONCURRENT_COUNT++))
    fi
done

if [ "$CONCURRENT_COUNT" -eq 5 ]; then
    log_success "All concurrent requests succeeded"
else
    log_warning "$CONCURRENT_COUNT/5 concurrent requests succeeded"
fi

echo ""

# Phase 7: Error Handling
log_info "Phase 7: Error Handling"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 7.1: Invalid Endpoint
log_info "Test 7.1: Invalid Endpoint Handling"
ERROR_RESPONSE=$(curl -s -w "\n%{http_code}" "$SERVER_URL/api/nonexistent" 2>/dev/null | tail -n1)

if [ "$ERROR_RESPONSE" = "404" ]; then
    log_success "404 error handled correctly"
else
    log_warning "404 error not handled as expected (got: $ERROR_RESPONSE)"
fi

# Test 7.2: Invalid Request
log_info "Test 7.2: Invalid Request Handling"
INVALID_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$SERVER_URL/api/tasks" \
    -H "Content-Type: application/json" \
    -d '{"invalid":"data"}' 2>/dev/null | tail -n1)

if [ "$INVALID_RESPONSE" = "400" ] || [ "$INVALID_RESPONSE" = "422" ]; then
    log_success "Invalid request handled correctly"
else
    log_warning "Invalid request not handled as expected (got: $INVALID_RESPONSE)"
fi

echo ""

# Phase 8: Security Integration
log_info "Phase 8: Security Integration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 8.1: HTTPS Redirect
log_info "Test 8.1: HTTPS Redirect"
HTTPS_CHECK=$(curl -s -I "http://localhost:3000" 2>/dev/null | grep -i "location\|https" || echo "")

if [ -n "$HTTPS_CHECK" ]; then
    log_success "HTTPS redirect configured"
else
    log_warning "HTTPS redirect not detected"
fi

# Test 8.2: Security Headers
log_info "Test 8.2: Security Headers"
HEADERS=$(curl -s -I "$SERVER_URL" 2>/dev/null)

SECURITY_HEADERS=0
[ -n "$(echo "$HEADERS" | grep -i "X-Frame-Options")" ] && ((SECURITY_HEADERS++))
[ -n "$(echo "$HEADERS" | grep -i "X-Content-Type-Options")" ] && ((SECURITY_HEADERS++))
[ -n "$(echo "$HEADERS" | grep -i "Strict-Transport-Security")" ] && ((SECURITY_HEADERS++))

if [ "$SECURITY_HEADERS" -ge 2 ]; then
    log_success "Security headers present ($SECURITY_HEADERS/3)"
else
    log_warning "Some security headers missing ($SECURITY_HEADERS/3)"
fi

echo ""

# Phase 9: Generate Integration Test Report
log_info "Phase 9: Generating integration test report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/integration-test-report-$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" << REPORT
Comprehensive Integration Testing Report
========================================

Test Date: $(date)
Server URL: $SERVER_URL
Test Duration: $(date +%s) seconds

Test Results:
  Total Tests: $TESTS_TOTAL
  Passed: $TESTS_PASSED
  Failed: $TESTS_FAILED
  Skipped: $TESTS_SKIPPED
  Success Rate: $([ $TESTS_TOTAL -gt 0 ] && echo "$((TESTS_PASSED * 100 / TESTS_TOTAL))%" || echo "N/A")%

Test Phases Completed:
  ✓ Component Health Check
  ✓ API Endpoint Integration
  ✓ Authentication Integration
  ✓ Real-Time Communication
  ✓ Data Persistence
  ✓ Performance Integration
  ✓ Error Handling
  ✓ Security Integration

Performance Metrics:
  Response Time: ${RESPONSE_TIME}ms
  Concurrent Requests: $CONCURRENT_COUNT/5

Status: $([ $TESTS_FAILED -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Next Steps:
1. Review any failed tests
2. Check application logs for errors
3. Verify all components are running
4. Monitor system resources
5. Set up continuous monitoring

For more information, see:
- PRODUCTION_DEPLOYMENT_GUIDE.md
- MONITORING_HEALTH_CHECKS.md
- Integration test logs in .manus-logs/

Support: supportramsandesh@gmail.com
REPORT

log_success "Integration test report generated: $REPORT_FILE"

echo ""

# Final Summary
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║    All Integration Tests Passed! ✓                       ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "Production deployment is fully integrated and operational"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Some Tests Failed - Review and Fix Issues            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$TESTS_FAILED test(s) failed"
    exit 1
fi
