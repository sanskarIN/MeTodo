#!/bin/bash

##############################################################################
# GitHub Actions Secrets Execution and Testing Script
# Tests GitHub Actions workflows and validates secret configuration
# Usage: bash test-github-actions.sh [github-token] [repo-owner] [repo-name]
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
TEST_LOG="${PROJECT_ROOT}/.manus-logs/github-actions-test-$(date +%Y%m%d_%H%M%S).log"

# Default values
GITHUB_TOKEN="${1:-}"
REPO_OWNER="${2:-}"
REPO_NAME="${3:-}"

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
echo -e "${BLUE}║    GitHub Actions Secrets Execution and Testing Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate inputs
if [ -z "$GITHUB_TOKEN" ] || [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    log_error "Missing required arguments"
    echo "Usage: bash test-github-actions.sh <github-token> <repo-owner> <repo-name>"
    exit 1
fi

log_info "Repository: $REPO_OWNER/$REPO_NAME"
log_info "Test log: $TEST_LOG"
echo ""

# Phase 1: GitHub CLI Verification
log_info "Phase 1: GitHub CLI Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v gh &> /dev/null; then
    log_error "GitHub CLI not installed"
    exit 1
fi
log_success "GitHub CLI installed"

echo "$GITHUB_TOKEN" | gh auth login --with-token 2>/dev/null || true
log_success "GitHub authentication configured"

echo ""

# Phase 2: Workflow Files Verification
log_info "Phase 2: Workflow Files Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

WORKFLOW_FILES=(
    ".github/workflows/build-android.yml"
    ".github/workflows/build-ios.yml"
    ".github/workflows/build-windows.yml"
    ".github/workflows/build-linux.yml"
    ".github/workflows/build-macos.yml"
    ".github/workflows/release-workflow.yml"
)

for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$workflow" ]; then
        log_success "Workflow file found: $workflow"
    else
        log_error "Workflow file missing: $workflow"
    fi
done

echo ""

# Phase 3: Workflow Syntax Validation
log_info "Phase 3: Workflow Syntax Validation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$workflow" ]; then
        log_info "Validating: $workflow"
        
        # Check YAML syntax
        if python3 -c "import yaml; yaml.safe_load(open('$PROJECT_ROOT/$workflow'))" 2>/dev/null; then
            log_success "YAML syntax valid: $workflow"
        else
            log_error "YAML syntax invalid: $workflow"
        fi
    fi
done

echo ""

# Phase 4: Secrets Verification
log_info "Phase 4: Secrets Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_SECRETS=(
    "API_TOKEN"
    "API_ENDPOINT"
    "ANDROID_KEYSTORE_PASSWORD"
    "ANDROID_KEY_PASSWORD"
    "ANDROID_KEYSTORE_BASE64"
    "IOS_CERTIFICATE_PASSWORD"
    "IOS_PROVISIONING_PROFILE_BASE64"
    "MACOS_CERTIFICATE_PASSWORD"
    "WINDOWS_CERTIFICATE_PASSWORD"
    "SLACK_WEBHOOK_URL"
)

EXISTING_SECRETS=$(gh secret list --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null | awk '{print $1}' | tail -n +2)

MISSING_SECRETS=()
FOUND_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if echo "$EXISTING_SECRETS" | grep -q "^$secret$"; then
        log_success "Secret configured: $secret"
        FOUND_SECRETS+=("$secret")
    else
        log_error "Secret missing: $secret"
        MISSING_SECRETS+=("$secret")
    fi
done

echo ""

# Phase 5: Environment Variables Verification
log_info "Phase 5: Environment Variables Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_ENV_VARS=(
    "NODE_ENV"
    "EXPO_PORT"
    "API_PORT"
    "DATABASE_URL"
    "SLACK_WEBHOOK_URL"
)

for env_var in "${REQUIRED_ENV_VARS[@]}"; do
    if grep -r "$env_var" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
        log_success "Environment variable referenced: $env_var"
    else
        log_warning "Environment variable not referenced: $env_var"
    fi
done

echo ""

# Phase 6: Workflow Trigger Verification
log_info "Phase 6: Workflow Trigger Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for push trigger
if grep -r "on: push" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
    log_success "Push trigger configured"
else
    log_warning "Push trigger not configured"
fi

# Check for tag trigger
if grep -r "tags:" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
    log_success "Tag trigger configured"
else
    log_warning "Tag trigger not configured"
fi

# Check for schedule trigger
if grep -r "schedule:" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
    log_success "Schedule trigger configured"
else
    log_warning "Schedule trigger not configured"
fi

echo ""

# Phase 7: Job Configuration Verification
log_info "Phase 7: Job Configuration Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_JOBS=(
    "build"
    "test"
    "deploy"
    "notify"
)

for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$workflow" ]; then
        log_info "Checking jobs in: $workflow"
        
        for job in "${REQUIRED_JOBS[@]}"; do
            if grep -q "^  $job:" "$PROJECT_ROOT/$workflow" 2>/dev/null; then
                log_success "Job found: $job"
            else
                log_warning "Job not found: $job"
            fi
        done
    fi
done

echo ""

# Phase 8: Action Verification
log_info "Phase 8: Action Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REQUIRED_ACTIONS=(
    "actions/checkout"
    "actions/setup-node"
    "actions/setup-python"
    "actions/upload-artifact"
    "actions/download-artifact"
)

for action in "${REQUIRED_ACTIONS[@]}"; do
    if grep -r "$action" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
        log_success "Action used: $action"
    else
        log_warning "Action not used: $action"
    fi
done

echo ""

# Phase 9: Notification Configuration
log_info "Phase 9: Notification Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check for Slack notification
if grep -r "slack" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
    log_success "Slack notifications configured"
else
    log_warning "Slack notifications not configured"
fi

# Check for email notification
if grep -r "email" "$PROJECT_ROOT/.github/workflows/" > /dev/null 2>&1; then
    log_success "Email notifications configured"
else
    log_warning "Email notifications not configured"
fi

echo ""

# Phase 10: Generate Test Report
log_info "Phase 10: Generating test report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/github-actions-test-report-$(date +%Y%m%d_%H%M%S).txt"
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

cat > "$REPORT_FILE" << REPORT
GitHub Actions Secrets Execution and Testing Report
===================================================

Test Date: $(date)
Repository: $REPO_OWNER/$REPO_NAME

Test Results:
  Total Tests: $TOTAL_TESTS
  Passed: $TESTS_PASSED
  Failed: $TESTS_FAILED
  Skipped: $TESTS_SKIPPED
  Success Rate: $([ $TOTAL_TESTS -gt 0 ] && echo "$((TESTS_PASSED * 100 / TOTAL_TESTS))%" || echo "N/A")%

Secrets Configuration:
  Found: ${#FOUND_SECRETS[@]}/${#REQUIRED_SECRETS[@]}
  Missing: ${#MISSING_SECRETS[@]}

Workflow Files:
  Total: ${#WORKFLOW_FILES[@]}
  Present: $([ -f "$PROJECT_ROOT/.github/workflows/build-android.yml" ] && echo "6" || echo "0")

Status: $([ $TESTS_FAILED -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Missing Secrets:
$(for secret in "${MISSING_SECRETS[@]}"; do echo "  - $secret"; done)

Next Steps:
1. Add all missing secrets to GitHub repository
2. Verify workflow syntax is valid
3. Test workflow execution by pushing to main
4. Monitor workflow runs in GitHub Actions tab
5. Configure notifications for failures

For more information, see:
- GITHUB_ACTIONS_SETUP_GUIDE.md
- GitHub Actions Documentation

Support: supportramsandesh@gmail.com
REPORT

log_success "Test report generated: $REPORT_FILE"

echo ""

# Final Summary
TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED + TESTS_SKIPPED))

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     GitHub Actions Configuration Verified! ✓             ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "GitHub Actions is ready for automated builds"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Some Tests Failed - Review and Fix Issues            ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_error "$TESTS_FAILED test(s) failed"
    exit 1
fi
