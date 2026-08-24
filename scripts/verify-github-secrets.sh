#!/bin/bash

##############################################################################
# GitHub Actions Secrets Verification Script
# Verifies all required secrets are configured in GitHub repository
# Usage: bash verify-github-secrets.sh [github-token] [repo-owner] [repo-name]
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
VERIFICATION_LOG="${PROJECT_ROOT}/.manus-logs/github-verification-$(date +%Y%m%d_%H%M%S).log"

# Default values
GITHUB_TOKEN="${1:-}"
REPO_OWNER="${2:-}"
REPO_NAME="${3:-}"

# Required secrets
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

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

# Create log directory
mkdir -p "$(dirname "$VERIFICATION_LOG")"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     GitHub Actions Secrets Verification Script            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate inputs
if [ -z "$GITHUB_TOKEN" ] || [ -z "$REPO_OWNER" ] || [ -z "$REPO_NAME" ]; then
    log_error "Missing required arguments"
    echo "Usage: bash verify-github-secrets.sh <github-token> <repo-owner> <repo-name>"
    echo ""
    echo "Example:"
    echo "  bash verify-github-secrets.sh ghp_xxxxxxxxxxxx sanskaryadav metodo"
    echo ""
    echo "To get a GitHub token:"
    echo "  1. Go to https://github.com/settings/tokens"
    echo "  2. Click 'Generate new token'"
    echo "  3. Select 'repo' and 'admin:repo_hook' scopes"
    echo "  4. Copy the token"
    exit 1
fi

log_info "Repository: $REPO_OWNER/$REPO_NAME"
log_info "Verification log: $VERIFICATION_LOG"
echo ""

# Phase 1: Verify GitHub CLI
log_info "Phase 1: Verifying GitHub CLI"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v gh &> /dev/null; then
    log_error "GitHub CLI not installed"
    echo "Install GitHub CLI from: https://cli.github.com"
    exit 1
fi
log_success "GitHub CLI installed"

# Verify GitHub authentication
log_info "Verifying GitHub authentication..."
if ! gh auth status &> /dev/null; then
    log_warning "GitHub CLI not authenticated"
    log_info "Authenticating with provided token..."
    echo "$GITHUB_TOKEN" | gh auth login --with-token
fi
log_success "GitHub authentication verified"

echo ""

# Phase 2: Check existing secrets
log_info "Phase 2: Checking existing secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

EXISTING_SECRETS=$(gh secret list --repo "$REPO_OWNER/$REPO_NAME" 2>/dev/null | awk '{print $1}' | tail -n +2)

if [ -z "$EXISTING_SECRETS" ]; then
    log_warning "No secrets found in repository"
else
    log_info "Existing secrets:"
    echo "$EXISTING_SECRETS" | while read -r secret; do
        echo "  - $secret"
    done | tee -a "$VERIFICATION_LOG"
fi

echo ""

# Phase 3: Verify required secrets
log_info "Phase 3: Verifying required secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

MISSING_SECRETS=()
FOUND_SECRETS=()

for secret in "${REQUIRED_SECRETS[@]}"; do
    if echo "$EXISTING_SECRETS" | grep -q "^$secret$"; then
        log_success "Secret found: $secret"
        FOUND_SECRETS+=("$secret")
    else
        log_error "Secret missing: $secret"
        MISSING_SECRETS+=("$secret")
    fi
done

echo ""

# Phase 4: Summary
log_info "Phase 4: Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

FOUND_COUNT=${#FOUND_SECRETS[@]}
MISSING_COUNT=${#MISSING_SECRETS[@]}
TOTAL_COUNT=${#REQUIRED_SECRETS[@]}

log_info "Secrets found: $FOUND_COUNT/$TOTAL_COUNT"

if [ $MISSING_COUNT -gt 0 ]; then
    echo ""
    log_error "Missing secrets ($MISSING_COUNT):"
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  - $secret" | tee -a "$VERIFICATION_LOG"
    done
    
    echo ""
    log_info "To add missing secrets, run:"
    echo ""
    for secret in "${MISSING_SECRETS[@]}"; do
        echo "  gh secret set $secret --repo $REPO_OWNER/$REPO_NAME --body 'your_value'" | tee -a "$VERIFICATION_LOG"
    done
    echo ""
else
    log_success "All required secrets are configured!"
fi

echo ""

# Phase 5: Test workflow triggers
log_info "Phase 5: Testing workflow triggers"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Checking workflow files..."
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
        log_success "Workflow found: $workflow"
    else
        log_warning "Workflow not found: $workflow"
    fi
done

echo ""

# Phase 6: Generate verification report
log_info "Phase 6: Generating verification report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

REPORT_FILE="${PROJECT_ROOT}/.manus-logs/github-secrets-report-$(date +%Y%m%d_%H%M%S).txt"

cat > "$REPORT_FILE" << REPORT
GitHub Actions Secrets Verification Report
============================================

Verification Date: $(date)
Repository: $REPO_OWNER/$REPO_NAME
Verification Status: $([ $MISSING_COUNT -eq 0 ] && echo "✓ PASS" || echo "✗ FAIL")

Required Secrets: $TOTAL_COUNT
Found Secrets: $FOUND_COUNT
Missing Secrets: $MISSING_COUNT

Found Secrets:
$(for secret in "${FOUND_SECRETS[@]}"; do echo "  ✓ $secret"; done)

Missing Secrets:
$(for secret in "${MISSING_SECRETS[@]}"; do echo "  ✗ $secret"; done)

Workflow Files:
$(for workflow in "${WORKFLOW_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$workflow" ]; then
        echo "  ✓ $workflow"
    else
        echo "  ✗ $workflow"
    fi
done)

Next Steps:
1. Add all missing secrets to GitHub repository
2. Verify all workflow files are present
3. Test workflow execution by pushing to main branch
4. Monitor workflow runs in GitHub Actions tab
5. Configure notifications for workflow failures

For more information, see:
- GITHUB_ACTIONS_SETUP_GUIDE.md
- GitHub Actions Documentation: https://docs.github.com/en/actions

Support: supportramsandesh@gmail.com
REPORT

log_success "Verification report generated: $REPORT_FILE"

echo ""

# Phase 7: Final status
if [ $MISSING_COUNT -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║          All Secrets Verified Successfully!               ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_success "GitHub Actions is ready for automated builds and deployments"
    exit 0
else
    echo -e "${YELLOW}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${YELLOW}║     Please Configure Missing Secrets Before Proceeding     ║${NC}"
    echo -e "${YELLOW}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    log_warning "Missing $MISSING_COUNT secret(s) - configure them before deploying"
    exit 1
fi
