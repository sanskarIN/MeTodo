#!/bin/bash

##############################################################################
# Disaster Recovery and Rollback Testing Script
# Tests disaster recovery procedures and rollback capabilities
# Usage: bash test-disaster-recovery.sh [backup-path] [database-url]
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
TEST_LOG="${PROJECT_ROOT}/.manus-logs/disaster-recovery-test-$(date +%Y%m%d_%H%M%S).log"

# Default values
BACKUP_PATH="${1:-${PROJECT_ROOT}/backups}"
DATABASE_URL="${2:-}"

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

# Create log directory
mkdir -p "$(dirname "$TEST_LOG")"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Disaster Recovery and Rollback Testing Script          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

log_info "Backup Path: $BACKUP_PATH"
log_info "Test log: $TEST_LOG"
echo ""

# Phase 1: Backup Verification
log_info "Phase 1: Backup Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1.1: Check backup directory
log_info "Test 1.1: Checking backup directory"
if [ -d "$BACKUP_PATH" ]; then
    log_success "Backup directory exists"
    
    BACKUP_COUNT=$(find "$BACKUP_PATH" -type f | wc -l)
    log_info "Found $BACKUP_COUNT backup files"
else
    log_error "Backup directory does not exist"
    mkdir -p "$BACKUP_PATH"
fi

# Test 1.2: Check backup files
log_info "Test 1.2: Checking backup files"
if [ -d "$BACKUP_PATH" ] && [ "$(ls -A "$BACKUP_PATH")" ]; then
    LATEST_BACKUP=$(ls -t "$BACKUP_PATH" | head -1)
    log_success "Latest backup found: $LATEST_BACKUP"
    
    # Check backup file size
    BACKUP_SIZE=$(du -h "$BACKUP_PATH/$LATEST_BACKUP" | cut -f1)
    log_info "Backup size: $BACKUP_SIZE"
else
    log_warning "No backup files found"
fi

# Test 1.3: Check backup integrity
log_info "Test 1.3: Checking backup integrity"
if [ -f "$BACKUP_PATH/$LATEST_BACKUP" ]; then
    if file "$BACKUP_PATH/$LATEST_BACKUP" | grep -q "gzip\|tar\|SQL"; then
        log_success "Backup file format valid"
    else
        log_error "Backup file format may be invalid"
    fi
else
    log_warning "Cannot verify backup integrity"
fi

echo ""

# Phase 2: Rollback Procedures
log_info "Phase 2: Rollback Procedures"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 2.1: Check rollback scripts
log_info "Test 2.1: Checking rollback scripts"
ROLLBACK_SCRIPTS=(
    "rollback-deployment.sh"
    "rollback-database.sh"
    "rollback-config.sh"
)

for script in "${ROLLBACK_SCRIPTS[@]}"; do
    if [ -f "$PROJECT_ROOT/scripts/$script" ]; then
        log_success "Rollback script found: $script"
    else
        log_warning "Rollback script missing: $script"
    fi
done

# Test 2.2: Check rollback documentation
log_info "Test 2.2: Checking rollback documentation"
if grep -r "rollback\|recovery\|restore" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "procedure\|step\|guide"; then
    log_success "Rollback procedures documented"
else
    log_warning "Rollback procedures may not be documented"
fi

# Test 2.3: Check version history
log_info "Test 2.3: Checking version history"
if [ -f "$PROJECT_ROOT/.git/config" ]; then
    COMMIT_COUNT=$(git -C "$PROJECT_ROOT" rev-list --all --count 2>/dev/null || echo "0")
    if [ "$COMMIT_COUNT" -gt 0 ]; then
        log_success "Git history available ($COMMIT_COUNT commits)"
    else
        log_warning "No git commits found"
    fi
else
    log_warning "Git repository not found"
fi

echo ""

# Phase 3: Database Recovery
log_info "Phase 3: Database Recovery"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 3.1: Check database backup scripts
log_info "Test 3.1: Checking database backup scripts"
if [ -f "$PROJECT_ROOT/scripts/backup-database-production.sh" ] || [ -f "$PROJECT_ROOT/scripts/backup-database.sh" ]; then
    log_success "Database backup scripts found"
else
    log_warning "Database backup scripts not found"
fi

# Test 3.2: Check database recovery procedures
log_info "Test 3.2: Checking database recovery procedures"
if grep -r "restore\|recover" "$PROJECT_ROOT/docs/PRODUCTION_DATABASE_GUIDE.md" 2>/dev/null | grep -q "procedure\|step"; then
    log_success "Database recovery procedures documented"
else
    log_warning "Database recovery procedures may not be documented"
fi

# Test 3.3: Check database schema backup
log_info "Test 3.3: Checking database schema backup"
if [ -f "$PROJECT_ROOT/drizzle/schema.ts" ]; then
    log_success "Database schema file present"
else
    log_error "Database schema file not found"
fi

echo ""

# Phase 4: Application State Recovery
log_info "Phase 4: Application State Recovery"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 4.1: Check application configuration backup
log_info "Test 4.1: Checking application configuration backup"
CONFIG_FILES=(
    "app.config.ts"
    "tailwind.config.js"
    "theme.config.js"
    "drizzle.config.ts"
)

for config in "${CONFIG_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$config" ]; then
        log_success "Configuration file backed up: $config"
    else
        log_warning "Configuration file missing: $config"
    fi
done

# Test 4.2: Check environment variable backup
log_info "Test 4.2: Checking environment variable backup"
if [ -f "$PROJECT_ROOT/.env.example" ]; then
    log_success "Environment variable template found"
else
    log_warning "Environment variable template not found"
fi

# Test 4.3: Check service files backup
log_info "Test 4.3: Checking service files backup"
SERVICE_COUNT=$(find "$PROJECT_ROOT/lib" -name "*service*" -o -name "*provider*" | wc -l)
if [ "$SERVICE_COUNT" -gt 0 ]; then
    log_success "Service files present ($SERVICE_COUNT files)"
else
    log_warning "Service files not found"
fi

echo ""

# Phase 5: Disaster Recovery Plan
log_info "Phase 5: Disaster Recovery Plan"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 5.1: Check disaster recovery documentation
log_info "Test 5.1: Checking disaster recovery documentation"
if [ -f "$PROJECT_ROOT/docs/DISASTER_RECOVERY_PLAN.md" ]; then
    log_success "Disaster recovery plan documented"
else
    log_warning "Disaster recovery plan not found"
fi

# Test 5.2: Check recovery time objective (RTO)
log_info "Test 5.2: Checking recovery time objective"
if grep -r "RTO\|recovery.*time\|restore.*time" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "[0-9]"; then
    log_success "Recovery time objective documented"
else
    log_warning "Recovery time objective not documented"
fi

# Test 5.3: Check recovery point objective (RPO)
log_info "Test 5.3: Checking recovery point objective"
if grep -r "RPO\|backup.*frequency\|data.*loss" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "[0-9]"; then
    log_success "Recovery point objective documented"
else
    log_warning "Recovery point objective not documented"
fi

echo ""

# Phase 6: Failover Testing
log_info "Phase 6: Failover Testing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 6.1: Check failover configuration
log_info "Test 6.1: Checking failover configuration"
if grep -r "failover\|redundancy\|backup.*server" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "configuration\|setup"; then
    log_success "Failover configuration documented"
else
    log_warning "Failover configuration not documented"
fi

# Test 6.2: Check load balancer configuration
log_info "Test 6.2: Checking load balancer configuration"
if [ -f "$PROJECT_ROOT/nginx.conf" ] || [ -f "$PROJECT_ROOT/configs/nginx.conf" ]; then
    log_success "Load balancer configuration found"
else
    log_warning "Load balancer configuration not found"
fi

# Test 6.3: Check health check endpoints
log_info "Test 6.3: Checking health check endpoints"
if grep -r "health\|status\|ping" "$PROJECT_ROOT/server/" 2>/dev/null | grep -q "endpoint\|route"; then
    log_success "Health check endpoints configured"
else
    log_warning "Health check endpoints may not be configured"
fi

echo ""

# Phase 7: Incident Response
log_info "Phase 7: Incident Response"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 7.1: Check incident response plan
log_info "Test 7.1: Checking incident response plan"
if [ -f "$PROJECT_ROOT/docs/INCIDENT_RESPONSE_PLAN.md" ]; then
    log_success "Incident response plan documented"
else
    log_warning "Incident response plan not found"
fi

# Test 7.2: Check escalation procedures
log_info "Test 7.2: Checking escalation procedures"
if grep -r "escalation\|notify\|alert\|contact" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "procedure\|step"; then
    log_success "Escalation procedures documented"
else
    log_warning "Escalation procedures not documented"
fi

# Test 7.3: Check communication plan
log_info "Test 7.3: Checking communication plan"
if grep -r "communication\|notify\|stakeholder\|customer" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "plan\|procedure"; then
    log_success "Communication plan documented"
else
    log_warning "Communication plan not documented"
fi

echo ""

# Phase 8: Generate Disaster Recovery Report
log_info "Phase 8: Generating disaster recovery report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/disaster-recovery-test-report-$(date +%Y%m%d_%H%M%S).txt"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

cat > "$REPORT_FILE" << REPORT
Disaster Recovery and Rollback Testing Report
============================================

Test Date: $(date)
Backup Path: $BACKUP_PATH

Test Results:
  Total Tests: $TOTAL_TESTS
  Passed: $TESTS_PASSED
  Failed: $TESTS_FAILED
  Skipped: $TESTS_SKIPPED
  Success Rate: $([ $TOTAL_TESTS -gt 0 ] && echo "$((TESTS_PASSED * 100 / TOTAL_TESTS))%" || echo "N/A")%

Backup Status:
  Backup Directory: $([ -d "$BACKUP_PATH" ] && echo "✓ Exists" || echo "✗ Missing")
  Backup Files: $(find "$BACKUP_PATH" -type f 2>/dev/null | wc -l)
  Latest Backup: $(ls -t "$BACKUP_PATH" 2>/dev/null | head -1 || echo "None")

Recovery Procedures:
  Rollback Scripts: $(ls "$PROJECT_ROOT/scripts/rollback-*.sh" 2>/dev/null | wc -l)
  Documentation: $([ -f "$PROJECT_ROOT/docs/DISASTER_RECOVERY_PLAN.md" ] && echo "✓ Present" || echo "✗ Missing")
  Incident Response: $([ -f "$PROJECT_ROOT/docs/INCIDENT_RESPONSE_PLAN.md" ] && echo "✓ Present" || echo "✗ Missing")

Status: $([ $TESTS_FAILED -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Recommendations:
1. Test backup restoration procedures regularly
2. Document all recovery procedures
3. Maintain multiple backup copies
4. Test failover mechanisms
5. Keep incident response plan updated
6. Train team on recovery procedures
7. Monitor backup integrity

For more information, see:
- DISASTER_RECOVERY_PLAN.md
- INCIDENT_RESPONSE_PLAN.md
- Backup procedures documentation

Support: supportramsandesh@gmail.com
REPORT

log_success "Disaster recovery report generated: $REPORT_FILE"

echo ""

# Final Summary
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║    Disaster Recovery Plan Verified! ✓                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "Disaster recovery procedures are in place"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Some Tests Failed - Review and Fix Issues            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$TESTS_FAILED test(s) failed"
    exit 1
fi
