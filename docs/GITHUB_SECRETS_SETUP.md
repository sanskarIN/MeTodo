# GitHub Secrets Configuration Guide

**Copyright © Sanskar Yadav. All rights reserved.**

## Overview

GitHub Secrets are encrypted environment variables used in GitHub Actions workflows. They store sensitive information like API tokens, credentials, and configuration values securely.

## Required Secrets

### 1. API_TOKEN

**Purpose**: Authentication token for publishing releases to the update API

**How to Generate**:
1. Go to your update API server
2. Navigate to Settings → API Tokens
3. Create new token with "releases:write" scope
4. Copy the generated token

**Value Format**: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 2. API_ENDPOINT

**Purpose**: URL of the update API server

**Value Format**: `https://api.metodo.app` or `https://your-domain.com/api`

### 3. ANDROID_KEYSTORE_PASSWORD

**Purpose**: Password for Android keystore file for signing APKs

**How to Generate**:
```bash
keytool -genkey -v -keystore metodo.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias metodo-key
```

**Value Format**: Your keystore password (e.g., `SecurePassword123!`)

### 4. ANDROID_KEY_PASSWORD

**Purpose**: Password for Android key alias

**Value Format**: Same as keystore password or different if configured

### 5. ANDROID_KEYSTORE_BASE64

**Purpose**: Base64-encoded keystore file for GitHub Actions

**How to Generate**:
```bash
base64 metodo.keystore | tr -d '\n' | pbcopy
```

**Value Format**: Base64 string (very long)

### 6. IOS_CERTIFICATE_PASSWORD

**Purpose**: Password for iOS code signing certificate

**Value Format**: Your certificate password

### 7. IOS_PROVISIONING_PROFILE_BASE64

**Purpose**: Base64-encoded iOS provisioning profile

**How to Generate**:
```bash
base64 MeTodo.mobileprovision | tr -d '\n' | pbcopy
```

**Value Format**: Base64 string

### 8. MACOS_CERTIFICATE_PASSWORD

**Purpose**: Password for macOS code signing certificate

**Value Format**: Your certificate password

### 9. WINDOWS_CERTIFICATE_PASSWORD

**Purpose**: Password for Windows code signing certificate

**Value Format**: Your certificate password

### 10. SLACK_WEBHOOK_URL

**Purpose**: Slack webhook for build notifications

**How to Generate**:
1. Go to Slack Workspace Settings
2. Navigate to Apps & Integrations
3. Create Incoming Webhook
4. Copy webhook URL

**Value Format**: `<your-slack-webhook-url>`

## Setting Up Secrets

### Via GitHub Web Interface

1. Go to your repository
2. Click Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Enter secret name (e.g., `API_TOKEN`)
5. Paste secret value
6. Click "Add secret"

### Via GitHub CLI

```bash
# Install GitHub CLI
brew install gh  # macOS
# or
sudo apt-get install gh  # Linux

# Login to GitHub
gh auth login

# Add secrets
gh secret set API_TOKEN --body "your-token-here"
gh secret set API_ENDPOINT --body "https://api.metodo.app"
gh secret set ANDROID_KEYSTORE_PASSWORD --body "your-password"
gh secret set ANDROID_KEY_PASSWORD --body "your-password"
gh secret set ANDROID_KEYSTORE_BASE64 --body "$(base64 metodo.keystore | tr -d '\n')"
gh secret set IOS_CERTIFICATE_PASSWORD --body "your-password"
gh secret set IOS_PROVISIONING_PROFILE_BASE64 --body "$(base64 MeTodo.mobileprovision | tr -d '\n')"
gh secret set MACOS_CERTIFICATE_PASSWORD --body "your-password"
gh secret set WINDOWS_CERTIFICATE_PASSWORD --body "your-password"
gh secret set SLACK_WEBHOOK_URL --body "<your-slack-webhook-url>"
```

### Via Script

```bash
#!/bin/bash

# Load secrets from .env file (NEVER commit this file!)
source .env.secrets

# Add all secrets
gh secret set API_TOKEN --body "$API_TOKEN"
gh secret set API_ENDPOINT --body "$API_ENDPOINT"
gh secret set ANDROID_KEYSTORE_PASSWORD --body "$ANDROID_KEYSTORE_PASSWORD"
gh secret set ANDROID_KEY_PASSWORD --body "$ANDROID_KEY_PASSWORD"
gh secret set ANDROID_KEYSTORE_BASE64 --body "$ANDROID_KEYSTORE_BASE64"
gh secret set IOS_CERTIFICATE_PASSWORD --body "$IOS_CERTIFICATE_PASSWORD"
gh secret set IOS_PROVISIONING_PROFILE_BASE64 --body "$IOS_PROVISIONING_PROFILE_BASE64"
gh secret set MACOS_CERTIFICATE_PASSWORD --body "$MACOS_CERTIFICATE_PASSWORD"
gh secret set WINDOWS_CERTIFICATE_PASSWORD --body "$WINDOWS_CERTIFICATE_PASSWORD"
gh secret set SLACK_WEBHOOK_URL --body "$SLACK_WEBHOOK_URL"

echo "All secrets added successfully!"
```

## Environment Variables File

Create `.env.secrets` file (NEVER commit to Git):

```bash
# .env.secrets
API_TOKEN=your-api-token-here
API_ENDPOINT=https://api.metodo.app
ANDROID_KEYSTORE_PASSWORD=your-keystore-password
ANDROID_KEY_PASSWORD=your-key-password
ANDROID_KEYSTORE_BASE64=base64-encoded-keystore
IOS_CERTIFICATE_PASSWORD=your-certificate-password
IOS_PROVISIONING_PROFILE_BASE64=base64-encoded-profile
MACOS_CERTIFICATE_PASSWORD=your-certificate-password
WINDOWS_CERTIFICATE_PASSWORD=your-certificate-password
SLACK_WEBHOOK_URL=<your-slack-webhook-url>
```

Add to `.gitignore`:

```bash
.env.secrets
.env.local
*.keystore
*.mobileprovision
*.p12
*.pfx
```

## Using Secrets in Workflows

In `.github/workflows/release-workflow.yml`:

```yaml
jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - name: Build APK
        env:
          KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}
        run: |
          ./gradlew assembleRelease \
            -Pandroid.injected.signing.store.password=$KEYSTORE_PASSWORD \
            -Pandroid.injected.signing.key.password=$KEY_PASSWORD

  publish-api:
    runs-on: ubuntu-latest
    steps:
      - name: Publish Release
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
          API_ENDPOINT: ${{ secrets.API_ENDPOINT }}
        run: |
          node scripts/publish-release.js \
            --token $API_TOKEN \
            --endpoint $API_ENDPOINT
```

## Secret Rotation

Rotate secrets regularly:

1. Generate new secret value
2. Update GitHub secret
3. Update local `.env.secrets`
4. Trigger new build to verify
5. Delete old secret value

## Troubleshooting

### Secret Not Found

**Problem**: Workflow says secret not found
- Verify secret name matches exactly (case-sensitive)
- Verify secret is in correct repository
- Check secret hasn't been deleted

**Solution**:
```bash
# List all secrets
gh secret list

# Verify secret exists
gh secret view API_TOKEN
```

### Secret Value Incorrect

**Problem**: Build fails with authentication error
- Verify secret value is correct
- Check for extra whitespace
- Verify token hasn't expired

**Solution**:
```bash
# Update secret
gh secret set API_TOKEN --body "new-token-value"
```

### Secrets Not Available in Workflow

**Problem**: Secrets not accessible in GitHub Actions
- Verify workflow has permission to access secrets
- Check repository settings allow Actions
- Verify branch is not protected

**Solution**:
```yaml
# In workflow file, ensure permissions are set
permissions:
  contents: read
  packages: write
  id-token: write
```

## Security Best Practices

1. **Never Log Secrets**: Don't print secrets in logs
2. **Use Least Privilege**: Only grant necessary permissions
3. **Rotate Regularly**: Change secrets every 90 days
4. **Use Strong Values**: Use 32+ character random strings
5. **Limit Access**: Only share with necessary team members
6. **Audit Changes**: Review secret access logs
7. **Use Separate Tokens**: Different tokens for different services
8. **Expire Tokens**: Set expiration dates on tokens

## Support

For GitHub Secrets issues:

- **Email**: supportramsandesh@gmail.com
- **GitHub Docs**: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
