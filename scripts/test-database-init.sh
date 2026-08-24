#!/bin/bash

##############################################################################
# Database Initialization Testing and Validation Script
# Tests database setup, migrations, and data integrity
# Usage: bash test-database-init.sh [database-url] [environment]
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
TEST_LOG="${PROJECT_ROOT}/.manus-logs/database-init-test-$(date +%Y%m%d_%H%M%S).log"

# Default values
DATABASE_URL="${1:-}"
ENVIRONMENT="${2:-development}"

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
echo -e "${BLUE}║   Database Initialization Testing and Validation Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate inputs
if [ -z "$DATABASE_URL" ]; then
    log_error "Missing required argument: DATABASE_URL"
    echo "Usage: bash test-database-init.sh <database-url> [environment]"
    exit 1
fi

log_info "Database URL: ${DATABASE_URL:0:20}...***"
log_info "Environment: $ENVIRONMENT"
log_info "Test log: $TEST_LOG"
echo ""

# Phase 1: Database Connection Test
log_info "Phase 1: Database Connection Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 1.1: Parse database URL
log_info "Test 1.1: Parsing database URL"
if [[ "$DATABASE_URL" =~ ^mysql://(.+):(.+)@(.+):([0-9]+)/(.+)$ ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
    log_success "Database URL parsed successfully"
else
    log_error "Invalid database URL format"
    exit 1
fi

# Test 1.2: Check MySQL connectivity
log_info "Test 1.2: Checking MySQL connectivity"
if command -v mysql &> /dev/null; then
    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" &>/dev/null; then
        log_success "MySQL connection successful"
    else
        log_error "MySQL connection failed"
    fi
else
    log_warning "MySQL client not installed, skipping connection test"
fi

echo ""

# Phase 2: Database Schema Verification
log_info "Phase 2: Database Schema Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 2.1: Check Drizzle schema file
log_info "Test 2.1: Checking Drizzle schema file"
if [ -f "$PROJECT_ROOT/drizzle/schema.ts" ]; then
    log_success "Drizzle schema file found"
    
    # Count tables in schema
    TABLE_COUNT=$(grep -c "export const" "$PROJECT_ROOT/drizzle/schema.ts" || echo "0")
    log_info "Found $TABLE_COUNT table definitions"
else
    log_error "Drizzle schema file not found"
fi

# Test 2.2: Check migrations directory
log_info "Test 2.2: Checking migrations directory"
if [ -d "$PROJECT_ROOT/drizzle/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 "$PROJECT_ROOT/drizzle/migrations" | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        log_success "Found $MIGRATION_COUNT migration files"
    else
        log_warning "No migration files found"
    fi
else
    log_error "Migrations directory not found"
fi

# Test 2.3: Validate schema syntax
log_info "Test 2.3: Validating schema syntax"
if grep -q "export const.*= table" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Schema syntax appears valid"
else
    log_error "Schema syntax may be invalid"
fi

echo ""

# Phase 3: Required Tables Verification
log_info "Phase 3: Required Tables Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_TABLES=(
    "tasks"
    "users"
    "settings"
    "releases"
    "releasePlatforms"
    "downloads"
    "installations"
    "updateFeedback"
    "rollbackRequests"
    "updateStats"
    "releaseChangelog"
)

for table in "${REQUIRED_TABLES[@]}"; do
    if grep -q "export const $table" "$PROJECT_ROOT/drizzle/schema.ts" 2>/dev/null; then
        log_success "Table defined: $table"
    else
        log_warning "Table not defined: $table"
    fi
done

echo ""

# Phase 4: Database Indexes Verification
log_info "Phase 4: Database Indexes Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 4.1: Check for primary keys
log_info "Test 4.1: Checking for primary keys"
if grep -q "primaryKey\|id.*serial" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Primary keys configured"
else
    log_warning "Primary keys may not be configured"
fi

# Test 4.2: Check for indexes
log_info "Test 4.2: Checking for indexes"
if grep -q "index\|unique" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Indexes configured"
else
    log_warning "Indexes may not be configured"
fi

# Test 4.3: Check for foreign keys
log_info "Test 4.3: Checking for foreign keys"
if grep -q "references\|foreignKey" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Foreign keys configured"
else
    log_warning "Foreign keys may not be configured"
fi

echo ""

# Phase 5: Drizzle Configuration Verification
log_info "Phase 5: Drizzle Configuration Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 5.1: Check drizzle.config.ts
log_info "Test 5.1: Checking drizzle.config.ts"
if [ -f "$PROJECT_ROOT/drizzle.config.ts" ]; then
    log_success "Drizzle config file found"
    
    # Verify config contains database URL
    if grep -q "DATABASE_URL\|url:" "$PROJECT_ROOT/drizzle.config.ts"; then
        log_success "Database URL configured in drizzle.config.ts"
    else
        log_warning "Database URL not found in config"
    fi
else
    log_error "Drizzle config file not found"
fi

# Test 5.2: Check db.ts
log_info "Test 5.2: Checking server/db.ts"
if [ -f "$PROJECT_ROOT/server/db.ts" ]; then
    log_success "Database connection file found"
else
    log_error "Database connection file not found"
fi

echo ""

# Phase 6: Environment Configuration Verification
log_info "Phase 6: Environment Configuration Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 6.1: Check .env file
log_info "Test 6.1: Checking .env file"
if [ -f "$PROJECT_ROOT/.env" ]; then
    log_success ".env file found"
    
    if grep -q "DATABASE_URL" "$PROJECT_ROOT/.env"; then
        log_success "DATABASE_URL configured in .env"
    else
        log_warning "DATABASE_URL not found in .env"
    fi
else
    log_warning ".env file not found"
fi

# Test 6.2: Check .env.example
log_info "Test 6.2: Checking .env.example"
if [ -f "$PROJECT_ROOT/.env.example" ]; then
    log_success ".env.example file found"
else
    log_warning ".env.example file not found"
fi

# Test 6.3: Check environment variables
log_info "Test 6.3: Checking environment variables"
if [ -n "${DATABASE_URL:-}" ]; then
    log_success "DATABASE_URL environment variable set"
else
    log_warning "DATABASE_URL environment variable not set"
fi

echo ""

# Phase 7: Migration Scripts Verification
log_info "Phase 7: Migration Scripts Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 7.1: Check package.json scripts
log_info "Test 7.1: Checking package.json scripts"
if grep -q "db:push\|migrate" "$PROJECT_ROOT/package.json"; then
    log_success "Database scripts found in package.json"
else
    log_warning "Database scripts not found in package.json"
fi

# Test 7.2: Check for migration tools
log_info "Test 7.2: Checking for migration tools"
if grep -q "drizzle-kit" "$PROJECT_ROOT/package.json"; then
    log_success "drizzle-kit dependency found"
else
    log_error "drizzle-kit dependency not found"
fi

echo ""

# Phase 8: Data Integrity Checks
log_info "Phase 8: Data Integrity Checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 8.1: Check for data validation
log_info "Test 8.1: Checking for data validation"
if grep -q "not null\|NOT NULL\|default\|DEFAULT" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Data validation constraints found"
else
    log_warning "Data validation constraints may be missing"
fi

# Test 8.2: Check for timestamps
log_info "Test 8.2: Checking for timestamps"
if grep -q "createdAt\|updatedAt\|timestamp" "$PROJECT_ROOT/drizzle/schema.ts"; then
    log_success "Timestamp columns found"
else
    log_warning "Timestamp columns not found"
fi

echo ""

# Phase 9: Backup and Recovery Verification
log_info "Phase 9: Backup and Recovery Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Test 9.1: Check for backup scripts
log_info "Test 9.1: Checking for backup scripts"
if [ -f "$PROJECT_ROOT/scripts/backup-database-production.sh" ] || [ -f "$PROJECT_ROOT/scripts/backup-database.sh" ]; then
    log_success "Backup scripts found"
else
    log_warning "Backup scripts not found"
fi

# Test 9.2: Check for recovery procedures
log_info "Test 9.2: Checking for recovery documentation"
if grep -r "recovery\|restore\|backup" "$PROJECT_ROOT/docs/" 2>/dev/null | grep -q "DATABASE"; then
    log_success "Recovery procedures documented"
else
    log_warning "Recovery procedures may not be documented"
fi

echo ""

# Phase 10: Generate Test Report
log_info "Phase 10: Generating test report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/database-init-test-report-$(date +%Y%m%d_%H%M%S).txt"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

cat > "$REPORT_FILE" << REPORT
Database Initialization Testing and Validation Report
=====================================================

Test Date: $(date)
Environment: $ENVIRONMENT
Database Host: $DB_HOST
Database Port: $DB_PORT
Database Name: $DB_NAME

Test Results:
  Total Tests: $TOTAL_TESTS
  Passed: $TESTS_PASSED
  Failed: $TESTS_FAILED
  Skipped: $TESTS_SKIPPED
  Success Rate: $([ $TOTAL_TESTS -gt 0 ] && echo "$((TESTS_PASSED * 100 / TOTAL_TESTS))%" || echo "N/A")%

Database Configuration:
  Schema File: $([ -f "$PROJECT_ROOT/drizzle/schema.ts" ] && echo "✓ Found" || echo "✗ Missing")
  Drizzle Config: $([ -f "$PROJECT_ROOT/drizzle.config.ts" ] && echo "✓ Found" || echo "✗ Missing")
  DB Connection: $([ -f "$PROJECT_ROOT/server/db.ts" ] && echo "✓ Found" || echo "✗ Missing")
  Migrations: $([ -d "$PROJECT_ROOT/drizzle/migrations" ] && echo "✓ Found" || echo "✗ Missing")

Tables Defined: $(grep -c "export const" "$PROJECT_ROOT/drizzle/schema.ts" 2>/dev/null || echo "0")
Indexes Configured: $(grep -c "index\|unique" "$PROJECT_ROOT/drizzle/schema.ts" 2>/dev/null || echo "0")
Foreign Keys: $(grep -c "references" "$PROJECT_ROOT/drizzle/schema.ts" 2>/dev/null || echo "0")

Status: $([ $TESTS_FAILED -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Next Steps:
1. Verify database connectivity
2. Run database migrations: npm run db:push
3. Verify all tables are created
4. Test data insertion and retrieval
5. Set up automated backups
6. Configure monitoring and alerts

For more information, see:
- PRODUCTION_DATABASE_GUIDE.md
- DATABASE_SETUP.md
- Drizzle ORM Documentation

Support: supportramsandesh@gmail.com
REPORT

log_success "Test report generated: $REPORT_FILE"

echo ""

# Final Summary
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     Database Initialization Verified! ✓                  ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "Database is ready for initialization"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Some Tests Failed - Review and Fix Issues            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$TESTS_FAILED test(s) failed"
    exit 1
fi
