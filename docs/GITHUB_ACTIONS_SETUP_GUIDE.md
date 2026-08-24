# GitHub Actions Setup and Integration Guide

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [GitHub Secrets Configuration](#github-secrets-configuration)
4. [Workflow Triggers](#workflow-triggers)
5. [Build Workflows](#build-workflows)
6. [Deployment Workflows](#deployment-workflows)
7. [Monitoring and Notifications](#monitoring-and-notifications)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

MeTodo uses GitHub Actions for continuous integration and continuous deployment (CI/CD) across all platforms:

- **Android**: Google Play Store deployment
- **iOS**: TestFlight and App Store deployment
- **Windows**: NSIS, MSI, and AppX installers
- **Linux**: AppImage, Snap, Flatpak, DEB, and RPM packages
- **macOS**: DMG with notarization

---

## Prerequisites

### GitHub Repository Setup

1. **Repository Access**
   - Owner or admin access to repository
   - GitHub CLI installed and authenticated
   - SSH keys configured

2. **GitHub Secrets**
   - 10 required secrets to be configured
   - Secrets stored securely in repository settings
   - Never commit secrets to repository

3. **Third-Party Services**
   - Google Play Developer account
   - Apple Developer account
   - Microsoft Developer account
   - Slack workspace (for notifications)

---

## GitHub Secrets Configuration

### 1. Required Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `API_TOKEN` | Update API authentication token | `ghp_xxxxxxxxxxxx` |
| `API_ENDPOINT` | Update API endpoint URL | `https://api.metodo.app` |
| `ANDROID_KEYSTORE_PASSWORD` | Android keystore password | `your_keystore_password` |
| `ANDROID_KEY_PASSWORD` | Android key password | `your_key_password` |
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore | `MIIJxwIBAzCCCYMGCSqGSIb3...` |
| `IOS_CERTIFICATE_PASSWORD` | iOS certificate password | `your_cert_password` |
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded provisioning profile | `MIIFXgIBAzCCBTYGCSqGSIb3...` |
| `MACOS_CERTIFICATE_PASSWORD` | macOS certificate password | `your_macos_cert_password` |
| `WINDOWS_CERTIFICATE_PASSWORD` | Windows certificate password | `your_windows_cert_password` |
| `SLACK_WEBHOOK_URL` | Slack webhook for notifications | `<your-slack-webhook-url>` |

### 2. Add Secrets via GitHub CLI

```bash
# Authenticate with GitHub
gh auth login

# Set API_TOKEN
gh secret set API_TOKEN --body "your_api_token"

# Set API_ENDPOINT
gh secret set API_ENDPOINT --body "https://api.metodo.app"

# Set Android secrets
gh secret set ANDROID_KEYSTORE_PASSWORD --body "your_keystore_password"
gh secret set ANDROID_KEY_PASSWORD --body "your_key_password"

# Set Android keystore (base64-encoded)
base64 -w 0 keystore.jks | gh secret set ANDROID_KEYSTORE_BASE64

# Set iOS secrets
gh secret set IOS_CERTIFICATE_PASSWORD --body "your_cert_password"

# Set iOS provisioning profile (base64-encoded)
base64 -w 0 provisioning.mobileprovision | gh secret set IOS_PROVISIONING_PROFILE_BASE64

# Set macOS certificate password
gh secret set MACOS_CERTIFICATE_PASSWORD --body "your_macos_cert_password"

# Set Windows certificate password
gh secret set WINDOWS_CERTIFICATE_PASSWORD --body "your_windows_cert_password"

# Set Slack webhook
gh secret set SLACK_WEBHOOK_URL --body "<your-slack-webhook-url>"

# Verify all secrets are set
gh secret list
```

### 3. Add Secrets via GitHub Web Interface

1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Enter secret name and value
5. Click "Add secret"
6. Repeat for all 10 secrets

### 4. Create .env.secrets File (Local Development)

```bash
# Create .env.secrets file
cat > .env.secrets << 'EOF'
API_TOKEN=your_api_token
API_ENDPOINT=https://api.metodo.app
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_PASSWORD=your_key_password
ANDROID_KEYSTORE_BASE64=base64_encoded_keystore
IOS_CERTIFICATE_PASSWORD=your_cert_password
IOS_PROVISIONING_PROFILE_BASE64=base64_encoded_profile
MACOS_CERTIFICATE_PASSWORD=your_macos_cert_password
WINDOWS_CERTIFICATE_PASSWORD=your_windows_cert_password
SLACK_WEBHOOK_URL=<your-slack-webhook-url>
EOF

# Add to .gitignore
echo ".env.secrets" >> .gitignore

# Load secrets for local testing
source .env.secrets
```

---

## Workflow Triggers

### 1. Push Trigger

Workflows trigger automatically on push to main branch:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'app/**'
      - 'server/**'
      - 'package.json'
      - 'pnpm-lock.yaml'
```

### 2. Release Trigger

Workflows trigger on new release tags:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### 3. Manual Trigger

Workflows can be triggered manually:

```yaml
on:
  workflow_dispatch:
    inputs:
      platform:
        description: 'Platform to build'
        required: true
        default: 'all'
        type: choice
        options:
          - android
          - ios
          - windows
          - linux
          - macos
          - all
```

### 4. Scheduled Trigger

Workflows can run on schedule:

```yaml
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
```

---

## Build Workflows

### 1. Android Build Workflow

**File**: `.github/workflows/build-android.yml`

**Triggers**:
- Push to main branch
- Release tag created
- Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build APK and AAB
5. Sign with keystore
6. Upload to Google Play Store
7. Notify Slack

**Secrets Used**:
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_PASSWORD`
- `ANDROID_KEYSTORE_BASE64`
- `API_TOKEN`
- `SLACK_WEBHOOK_URL`

### 2. iOS Build Workflow

**File**: `.github/workflows/build-ios.yml`

**Triggers**:
- Push to main branch
- Release tag created
- Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build IPA
5. Sign with certificate
6. Upload to TestFlight
7. Notify Slack

**Secrets Used**:
- `IOS_CERTIFICATE_PASSWORD`
- `IOS_PROVISIONING_PROFILE_BASE64`
- `API_TOKEN`
- `SLACK_WEBHOOK_URL`

### 3. Windows Build Workflow

**File**: `.github/workflows/build-windows.yml`

**Triggers**:
- Push to main branch
- Release tag created
- Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build NSIS installer
5. Build MSI installer
6. Build AppX package
7. Sign with certificate
8. Upload to distribution server
9. Notify Slack

**Secrets Used**:
- `WINDOWS_CERTIFICATE_PASSWORD`
- `API_TOKEN`
- `SLACK_WEBHOOK_URL`

### 4. Linux Build Workflow

**File**: `.github/workflows/build-linux.yml`

**Triggers**:
- Push to main branch
- Release tag created
- Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build AppImage
5. Build Snap
6. Build Flatpak
7. Build DEB package
8. Build RPM package
9. Upload to distribution server
10. Notify Slack

**Secrets Used**:
- `API_TOKEN`
- `SLACK_WEBHOOK_URL`

### 5. macOS Build Workflow

**File**: `.github/workflows/build-macos.yml`

**Triggers**:
- Push to main branch
- Release tag created
- Manual dispatch

**Steps**:
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build DMG
5. Sign with certificate
6. Notarize with Apple
7. Upload to distribution server
8. Notify Slack

**Secrets Used**:
- `MACOS_CERTIFICATE_PASSWORD`
- `API_TOKEN`
- `SLACK_WEBHOOK_URL`

---

## Deployment Workflows

### 1. Automated Release Workflow

**File**: `.github/workflows/release-workflow.yml`

**Triggers**:
- New tag pushed (v*.*.*)

**Steps**:
1. Parse version from tag
2. Generate changelog
3. Create GitHub release
4. Build all platforms
5. Upload artifacts
6. Publish to API
7. Send notifications

### 2. Continuous Deployment Workflow

**File**: `.github/workflows/deploy.yml`

**Triggers**:
- Push to main branch
- Manual dispatch

**Steps**:
1. Build application
2. Run tests
3. Deploy to staging
4. Run integration tests
5. Deploy to production
6. Run smoke tests
7. Notify team

---

## Monitoring and Notifications

### 1. Slack Notifications

Workflows send Slack notifications for:

- Build started
- Build succeeded
- Build failed
- Deployment started
- Deployment succeeded
- Deployment failed

### 2. Email Notifications

Configure email notifications in GitHub:

1. Go to Settings → Notifications
2. Select "Email" as notification method
3. Choose when to receive notifications

### 3. GitHub Status Checks

Status checks show workflow status:

- ✅ All checks passed
- ❌ Checks failed
- ⏳ Checks in progress

---

## Troubleshooting

### Workflow Not Triggering

**Problem**: Workflow doesn't start on push

**Solutions**:
1. Check branch name matches trigger condition
2. Verify file path matches trigger paths
3. Check workflow file syntax
4. Verify workflow is enabled in Actions tab

### Build Failures

**Problem**: Build step fails

**Solutions**:
1. Check build logs in Actions tab
2. Verify all dependencies are installed
3. Check environment variables are set
4. Verify secrets are configured correctly

### Deployment Failures

**Problem**: Deployment step fails

**Solutions**:
1. Check deployment credentials
2. Verify target server is accessible
3. Check deployment logs
4. Verify deployment environment is configured

### Secret Issues

**Problem**: "Secret not found" error

**Solutions**:
1. Verify secret is created in repository
2. Check secret name matches exactly (case-sensitive)
3. Verify secret has correct value
4. Re-create secret if needed

---

## Best Practices

### 1. Secret Management

- ✅ Store all secrets in GitHub Secrets
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use different secrets for different environments
- ✅ Never commit secrets to repository
- ❌ Don't hardcode credentials in workflows

### 2. Workflow Organization

- ✅ Use separate workflows for each platform
- ✅ Use descriptive names for workflows
- ✅ Add comments explaining complex steps
- ✅ Use reusable workflows for common tasks
- ❌ Don't put all builds in one workflow

### 3. Error Handling

- ✅ Add error notifications
- ✅ Implement retry logic for flaky steps
- ✅ Use conditional steps for error handling
- ✅ Log detailed error information
- ❌ Don't ignore build failures

### 4. Performance Optimization

- ✅ Cache dependencies
- ✅ Use matrix builds for parallel execution
- ✅ Minimize workflow runtime
- ✅ Use self-hosted runners for heavy builds
- ❌ Don't run unnecessary steps

### 5. Security

- ✅ Use OIDC for authentication
- ✅ Limit workflow permissions
- ✅ Review workflow logs for sensitive data
- ✅ Use branch protection rules
- ❌ Don't use personal access tokens

---

## Workflow Execution Monitoring

### 1. View Workflow Runs

```bash
# List recent workflow runs
gh run list

# View specific workflow run
gh run view <run-id>

# View workflow logs
gh run view <run-id> --log
```

### 2. Workflow Statistics

```bash
# View workflow statistics
gh api repos/{owner}/{repo}/actions/workflows \
  --jq '.workflows[] | {name, created_at, updated_at}'
```

### 3. Workflow Artifacts

```bash
# List artifacts from run
gh run download <run-id>

# Download specific artifact
gh run download <run-id> -n <artifact-name>
```

---

## Support

For GitHub Actions setup issues:

- **Email**: supportramsandesh@gmail.com
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Workflow Examples**: https://github.com/actions

---

## Checklist

- [ ] GitHub repository created
- [ ] 10 secrets configured
- [ ] Workflow files created
- [ ] Triggers configured
- [ ] Notifications set up
- [ ] First workflow run successful
- [ ] All platforms building successfully
- [ ] Deployments working
- [ ] Monitoring configured
- [ ] Team trained on CI/CD process

---

**Last Updated**: 2026-07-03
**Version**: 1.0.0
**Author**: Sanskar Yadav
