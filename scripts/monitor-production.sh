#!/bin/bash

##############################################################################
# Production Monitoring and Health Verification Script
# Monitors production deployment health and generates alerts
# Usage: bash monitor-production.sh [server-url] [check-interval] [alert-webhook]
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
MONITOR_LOG="${PROJECT_ROOT}/.manus-logs/monitor-production-$(date +%Y%m%d_%H%M%S).log"

# Default values
SERVER_URL="${1:-http://localhost:3000}"
CHECK_INTERVAL="${2:-60}"
ALERT_WEBHOOK="${3:-}"

# Monitoring state
CONSECUTIVE_FAILURES=0
MAX_CONSECUTIVE_FAILURES=3
LAST_STATUS="unknown"
HEALTH_CHECKS_PASSED=0
HEALTH_CHECKS_FAILED=0

# Functions
log_info() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$MONITOR_LOG"
}

log_success() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')] ✓${NC} $1" | tee -a "$MONITOR_LOG"
    ((HEALTH_CHECKS_PASSED++))
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] ⚠${NC} $1" | tee -a "$MONITOR_LOG"
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ✗${NC} $1" | tee -a "$MONITOR_LOG"
    ((HEALTH_CHECKS_FAILED++))
}

send_alert() {
    local message="$1"
    local severity="${2:-warning}"
    
    if [ -n "$ALERT_WEBHOOK" ]; then
        curl -s -X POST "$ALERT_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\",\"severity\":\"$severity\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"}" \
            > /dev/null 2>&1 || true
    fi
}

check_api_health() {
    local response=$(curl -s -w "\n%{http_code}" "$SERVER_URL/health" 2>/dev/null || echo "000")
    local status=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | head -n-1)
    
    if [ "$status" = "200" ]; then
        return 0
    else
        return 1
    fi
}

check_database_health() {
    local response=$(curl -s "$SERVER_URL/api/health/db" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "connected\|ok\|true"; then
        return 0
    else
        return 1
    fi
}

check_cache_health() {
    local response=$(curl -s "$SERVER_URL/api/health/cache" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "connected\|ok\|true"; then
        return 0
    else
        return 1
    fi
}

check_response_time() {
    local start_time=$(date +%s%N)
    curl -s "$SERVER_URL/api/tasks" > /dev/null 2>&1 || true
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))
    
    echo "$response_time"
}

check_memory_usage() {
    local response=$(curl -s "$SERVER_URL/api/health/stats" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "memory"; then
        echo "$response" | grep -o '"memory":[0-9.]*' | cut -d':' -f2
    else
        echo "unknown"
    fi
}

check_cpu_usage() {
    local response=$(curl -s "$SERVER_URL/api/health/stats" 2>/dev/null || echo "")
    
    if echo "$response" | grep -q "cpu"; then
        echo "$response" | grep -o '"cpu":[0-9.]*' | cut -d':' -f2
    else
        echo "unknown"
    fi
}

# Create log directory
mkdir -p "$(dirname "$MONITOR_LOG")"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Production Monitoring and Health Verification Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log_info "Starting production monitoring"
log_info "Server URL: $SERVER_URL"
log_info "Check Interval: ${CHECK_INTERVAL}s"
log_info "Alert Webhook: ${ALERT_WEBHOOK:-disabled}"
echo ""

# Main monitoring loop
ITERATION=0
while true; do
    ((ITERATION++))
    
    log_info "=== Health Check Iteration #$ITERATION ==="
    
    # Check API Health
    if check_api_health; then
        log_success "API Server is healthy"
        CONSECUTIVE_FAILURES=0
    else
        log_error "API Server is not responding"
        ((CONSECUTIVE_FAILURES++))
    fi
    
    # Check Database Health
    if check_database_health; then
        log_success "Database is healthy"
    else
        log_warning "Database health check failed"
    fi
    
    # Check Cache Health
    if check_cache_health; then
        log_success "Cache is healthy"
    else
        log_warning "Cache health check failed"
    fi
    
    # Check Response Time
    RESPONSE_TIME=$(check_response_time)
    if [ "$RESPONSE_TIME" -lt 1000 ]; then
        log_success "Response time acceptable: ${RESPONSE_TIME}ms"
    elif [ "$RESPONSE_TIME" -lt 5000 ]; then
        log_warning "Response time slow: ${RESPONSE_TIME}ms"
    else
        log_error "Response time too slow: ${RESPONSE_TIME}ms"
    fi
    
    # Check Memory Usage
    MEMORY=$(check_memory_usage)
    if [ "$MEMORY" != "unknown" ]; then
        if (( $(echo "$MEMORY < 80" | bc -l) )); then
            log_success "Memory usage acceptable: ${MEMORY}%"
        else
            log_warning "Memory usage high: ${MEMORY}%"
        fi
    fi
    
    # Check CPU Usage
    CPU=$(check_cpu_usage)
    if [ "$CPU" != "unknown" ]; then
        if (( $(echo "$CPU < 80" | bc -l) )); then
            log_success "CPU usage acceptable: ${CPU}%"
        else
            log_warning "CPU usage high: ${CPU}%"
        fi
    fi
    
    # Check for consecutive failures
    if [ $CONSECUTIVE_FAILURES -ge $MAX_CONSECUTIVE_FAILURES ]; then
        log_error "ALERT: $CONSECUTIVE_FAILURES consecutive failures detected!"
        send_alert "Production server has failed $CONSECUTIVE_FAILURES times consecutively" "critical"
        LAST_STATUS="down"
    elif [ "$LAST_STATUS" = "down" ] && [ $CONSECUTIVE_FAILURES -eq 0 ]; then
        log_success "ALERT: Production server recovered!"
        send_alert "Production server has recovered" "info"
        LAST_STATUS="up"
    else
        LAST_STATUS="up"
    fi
    
    # Print summary
    echo ""
    log_info "Health Check Summary:"
    log_info "  Passed: $HEALTH_CHECKS_PASSED"
    log_info "  Failed: $HEALTH_CHECKS_FAILED"
    log_info "  Success Rate: $([ $((HEALTH_CHECKS_PASSED + HEALTH_CHECKS_FAILED)) -gt 0 ] && echo "$((HEALTH_CHECKS_PASSED * 100 / (HEALTH_CHECKS_PASSED + HEALTH_CHECKS_FAILED)))%" || echo "N/A")%"
    echo ""
    
    # Wait for next check
    log_info "Next check in ${CHECK_INTERVAL}s..."
    sleep "$CHECK_INTERVAL"
done
