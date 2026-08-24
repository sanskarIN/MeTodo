#!/bin/bash

################################################################################
# MeTodo GitHub Secrets Configuration Script
################################################################################
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Configure GitHub repository secrets for CI/CD automation
#
# DESCRIPTION:
# This script automates the setup of GitHub secrets required for automated
# builds and deployments across all platforms.
#
# USAGE:
# bash scripts/configure-github-secrets.sh
#
################################################################################

set -e

echo "=================================="
echo "MeTodo GitHub Secrets Configuration"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI is not installed${NC}"
    echo "Install GitHub CLI: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}→ Authenticating with GitHub...${NC}"
    gh auth login
fi

echo -e "${BLUE}→ Getting repository information...${NC}"

# Get repository owner and name
REPO_OWNER=$(gh repo view --json owner --jq '.owner.login')
REPO_NAME=$(gh repo view --json name --jq '.name')

echo -e "${GREEN}✓ Repository: $REPO_OWNER/$REPO_NAME${NC}"

echo ""
echo -e "${YELLOW}=== GitHub Secrets Configuration ===${NC}"
echo ""
echo "This script will help you configure the following secrets:"
echo ""
echo "1. API_TOKEN - Update API authentication token"
echo "2. API_ENDPOINT - Update API endpoint URL"
echo "3. ANDROID_KEYSTORE_PASSWORD - Android keystore password"
echo "4. ANDROID_KEY_PASSWORD - Android key password"
echo "5. ANDROID_KEYSTORE_BASE64 - Base64-encoded keystore"
echo "6. IOS_CERTIFICATE_PASSWORD - iOS certificate password"
echo "7. IOS_PROVISIONING_PROFILE_BASE64 - Base64-encoded provisioning profile"
echo "8. MACOS_CERTIFICATE_PASSWORD - macOS certificate password"
echo "9. WINDOWS_CERTIFICATE_PASSWORD - Windows certificate password"
echo "10. SLACK_WEBHOOK_URL - Slack webhook for notifications"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    local description=$3

    if [ -z "$secret_value" ]; then
        echo -e "${YELLOW}⚠ Skipping $secret_name (empty value)${NC}"
        return
    fi

    echo -e "${BLUE}→ Setting $secret_name...${NC}"
    gh secret set "$secret_name" --body "$secret_value" 2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $secret_name configured${NC}"
    else
        echo -e "${RED}✗ Failed to set $secret_name${NC}"
    fi
}

# Check if .env.secrets file exists
if [ -f ".env.secrets" ]; then
    echo -e "${BLUE}→ Loading secrets from .env.secrets...${NC}"
    source .env.secrets

    # Set all secrets
    set_secret "API_TOKEN" "$API_TOKEN" "API authentication token"
    set_secret "API_ENDPOINT" "$API_ENDPOINT" "API endpoint URL"
    set_secret "ANDROID_KEYSTORE_PASSWORD" "$ANDROID_KEYSTORE_PASSWORD" "Android keystore password"
    set_secret "ANDROID_KEY_PASSWORD" "$ANDROID_KEY_PASSWORD" "Android key password"
    set_secret "ANDROID_KEYSTORE_BASE64" "$ANDROID_KEYSTORE_BASE64" "Base64-encoded Android keystore"
    set_secret "IOS_CERTIFICATE_PASSWORD" "$IOS_CERTIFICATE_PASSWORD" "iOS certificate password"
    set_secret "IOS_PROVISIONING_PROFILE_BASE64" "$IOS_PROVISIONING_PROFILE_BASE64" "Base64-encoded iOS provisioning profile"
    set_secret "MACOS_CERTIFICATE_PASSWORD" "$MACOS_CERTIFICATE_PASSWORD" "macOS certificate password"
    set_secret "WINDOWS_CERTIFICATE_PASSWORD" "$WINDOWS_CERTIFICATE_PASSWORD" "Windows certificate password"
    set_secret "SLACK_WEBHOOK_URL" "$SLACK_WEBHOOK_URL" "Slack webhook URL"

    echo ""
    echo -e "${GREEN}✓ All secrets configured from .env.secrets${NC}"
else
    echo -e "${YELLOW}⚠ .env.secrets file not found${NC}"
    echo ""
    echo "You can configure secrets interactively or create .env.secrets file."
    echo ""
    read -p "Configure secrets interactively? (y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Interactive configuration
        read -p "API_TOKEN: " API_TOKEN
        set_secret "API_TOKEN" "$API_TOKEN"

        read -p "API_ENDPOINT: " API_ENDPOINT
        set_secret "API_ENDPOINT" "$API_ENDPOINT"

        read -sp "ANDROID_KEYSTORE_PASSWORD: " ANDROID_KEYSTORE_PASSWORD
        echo ""
        set_secret "ANDROID_KEYSTORE_PASSWORD" "$ANDROID_KEYSTORE_PASSWORD"

        read -sp "ANDROID_KEY_PASSWORD: " ANDROID_KEY_PASSWORD
        echo ""
        set_secret "ANDROID_KEY_PASSWORD" "$ANDROID_KEY_PASSWORD"

        read -p "ANDROID_KEYSTORE_BASE64 (file path): " KEYSTORE_FILE
        if [ -f "$KEYSTORE_FILE" ]; then
            ANDROID_KEYSTORE_BASE64=$(base64 "$KEYSTORE_FILE" | tr -d '\n')
            set_secret "ANDROID_KEYSTORE_BASE64" "$ANDROID_KEYSTORE_BASE64"
        fi

        read -sp "IOS_CERTIFICATE_PASSWORD: " IOS_CERTIFICATE_PASSWORD
        echo ""
        set_secret "IOS_CERTIFICATE_PASSWORD" "$IOS_CERTIFICATE_PASSWORD"

        read -p "IOS_PROVISIONING_PROFILE_BASE64 (file path): " PROFILE_FILE
        if [ -f "$PROFILE_FILE" ]; then
            IOS_PROVISIONING_PROFILE_BASE64=$(base64 "$PROFILE_FILE" | tr -d '\n')
            set_secret "IOS_PROVISIONING_PROFILE_BASE64" "$IOS_PROVISIONING_PROFILE_BASE64"
        fi

        read -sp "MACOS_CERTIFICATE_PASSWORD: " MACOS_CERTIFICATE_PASSWORD
        echo ""
        set_secret "MACOS_CERTIFICATE_PASSWORD" "$MACOS_CERTIFICATE_PASSWORD"

        read -sp "WINDOWS_CERTIFICATE_PASSWORD: " WINDOWS_CERTIFICATE_PASSWORD
        echo ""
        set_secret "WINDOWS_CERTIFICATE_PASSWORD" "$WINDOWS_CERTIFICATE_PASSWORD"

        read -p "SLACK_WEBHOOK_URL: " SLACK_WEBHOOK_URL
        set_secret "SLACK_WEBHOOK_URL" "$SLACK_WEBHOOK_URL"

        echo ""
        echo -e "${GREEN}✓ All secrets configured interactively${NC}"
    fi
fi

echo ""
echo -e "${BLUE}→ Verifying configured secrets...${NC}"

# List all secrets
echo ""
echo -e "${YELLOW}Configured Secrets:${NC}"
gh secret list

echo ""
echo -e "${GREEN}=================================="
echo "✓ GitHub Secrets Configuration Complete!"
echo "==================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "✓ GitHub secrets configured"
echo "✓ Ready for automated builds"
echo "✓ CI/CD pipelines can now access secrets"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Verify secrets are visible in GitHub repository settings"
echo "2. Push changes to trigger automated builds"
echo "3. Monitor build progress in Actions tab"
echo "4. Check build logs for any errors"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "⚠ Keep .env.secrets file secure and never commit to Git"
echo "⚠ Rotate secrets regularly (every 90 days recommended)"
echo "⚠ Use different secrets for different environments"
echo ""
