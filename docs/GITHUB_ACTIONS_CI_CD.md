# MeTodo GitHub Actions CI/CD Documentation

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [Workflow Files](#workflow-files)
3. [Setup and Configuration](#setup-and-configuration)
4. [Secrets Management](#secrets-management)
5. [Build Triggers](#build-triggers)
6. [Platform-Specific Details](#platform-specific-details)
7. [Deployment Process](#deployment-process)
8. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)

## Overview

The MeTodo CI/CD system uses GitHub Actions to automatically build, test, and deploy the application across all platforms (Android, Windows, Linux, iOS, macOS). Each platform has a dedicated workflow that handles building, testing, signing, and publishing.

### Key Features

- **Automated Builds**: Triggered on push, pull requests, and tags
- **Multi-Platform Support**: Android, Windows, Linux, iOS, macOS
- **Code Signing**: Automatic code signing for all platforms
- **Testing**: Automated tests, linting, and TypeScript checks
- **Deployment**: Automatic deployment to app stores and download servers
- **Notifications**: Slack notifications for build status
- **Artifact Management**: Automatic artifact upload and retention

## Workflow Files

### Android Workflow (`build-android.yml`)

**File Location**: `.github/workflows/build-android.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (v*)
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs**:
1. **build** - Compiles Android APK/AAB
2. **test** - Runs tests and linting
3. **publish** - Publishes to Google Play Store

**Outputs**:
- `metodo-debug.apk` (for pull requests)
- `metodo-release.aab` (for releases)

### Windows Workflow (`build-windows.yml`)

**File Location**: `.github/workflows/build-windows.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (v*)
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs**:
1. **build** - Creates Windows installers
2. **test** - Runs tests and linting
3. **publish** - Uploads to website and creates GitHub release

**Outputs**:
- `metodo-setup.exe` (NSIS installer)
- `metodo-portable.exe` (Portable version)
- `metodo-installer.msi` (MSI installer)
- `SHA256SUMS` (Checksums)

### Linux Workflow (`build-linux.yml`)

**File Location**: `.github/workflows/build-linux.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (v*)
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs**:
1. **build** - Creates Linux packages
2. **test** - Runs tests and linting
3. **publish** - Publishes to Snap Store and uploads to website

**Outputs**:
- `metodo-*.AppImage` (AppImage)
- `metodo_*.snap` (Snap package)
- `metodo-*.flatpak` (Flatpak)
- `metodo_*.deb` (Debian package)
- `metodo-*.rpm` (RPM package)
- `SHA256SUMS` (Checksums)

### iOS Workflow (`build-ios.yml`)

**File Location**: `.github/workflows/build-ios.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (v*)
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs**:
1. **build** - Compiles iOS IPA
2. **test** - Runs tests and linting
3. **publish** - Uploads to TestFlight and App Store

**Outputs**:
- `metodo.ipa` (iOS app archive)

### macOS Workflow (`build-macos.yml`)

**File Location**: `.github/workflows/build-macos.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Push of version tags (v*)
- Pull requests to `main` or `develop`
- Manual workflow dispatch

**Jobs**:
1. **build** - Creates macOS DMG and App bundle
2. **test** - Runs tests and linting
3. **publish** - Uploads to website and creates GitHub release

**Outputs**:
- `metodo-*.dmg` (DMG installer)
- `metodo-*.app` (App bundle)
- `SHA256SUMS` (Checksums)

## Setup and Configuration

### Prerequisites

1. GitHub repository with Actions enabled
2. Node.js 22.13.0
3. Platform-specific build tools installed
4. Signing certificates and provisioning profiles
5. App store credentials

### Initial Setup

#### 1. Clone Repository

```bash
git clone https://github.com/sanskaryadav/metodo.git
cd metodo
```

#### 2. Create Workflow Secrets

See [Secrets Management](#secrets-management) section below.

#### 3. Enable GitHub Actions

1. Go to repository Settings
2. Click "Actions" in sidebar
3. Select "Allow all actions and reusable workflows"
4. Click "Save"

#### 4. Configure Branch Protection

1. Go to repository Settings
2. Click "Branches"
3. Add branch protection rule for `main`
4. Require status checks to pass before merging
5. Select workflows to require

### Environment Variables

Create `.env` file in project root:

```bash
NODE_VERSION=22.13.0
JAVA_VERSION=17
GRADLE_VERSION=8.0
XCODE_VERSION=15.3
```

## Secrets Management

### Required Secrets

All secrets must be added to GitHub repository settings under "Secrets and variables" → "Actions".

#### Android Secrets

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded keystore file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias in keystore |
| `ANDROID_KEY_PASSWORD` | Key password |
| `GOOGLE_PLAY_JSON` | Google Play service account JSON |

#### Windows Secrets

| Secret | Description |
|--------|-------------|
| `WINDOWS_CERTIFICATE_BASE64` | Base64-encoded code signing certificate |
| `WINDOWS_CERTIFICATE_PASSWORD` | Certificate password |

#### Linux Secrets

| Secret | Description |
|--------|-------------|
| `SNAPCRAFT_STORE_CREDENTIALS` | Snapcraft store credentials |

#### iOS Secrets

| Secret | Description |
|--------|-------------|
| `IOS_PROVISIONING_PROFILE_BASE64` | Base64-encoded provisioning profile |
| `IOS_PROVISIONING_PROFILE_UUID` | Provisioning profile UUID |
| `IOS_SIGNING_CERTIFICATE_BASE64` | Base64-encoded signing certificate |
| `IOS_SIGNING_CERTIFICATE_PASSWORD` | Certificate password |
| `APP_STORE_CONNECT_API_KEY` | App Store Connect API key |
| `APP_STORE_CONNECT_KEY_ID` | API key ID |
| `APP_STORE_CONNECT_USERNAME` | Apple ID username |
| `APP_STORE_CONNECT_PASSWORD` | Apple ID password |

#### macOS Secrets

| Secret | Description |
|--------|-------------|
| `MACOS_CERTIFICATE_BASE64` | Base64-encoded code signing certificate |
| `MACOS_CERTIFICATE_PASSWORD` | Certificate password |
| `APPLE_ID` | Apple ID email |
| `APPLE_ID_PASSWORD` | Apple ID password |
| `APPLE_TEAM_ID` | Apple Team ID |

#### Deployment Secrets

| Secret | Description |
|--------|-------------|
| `DEPLOY_KEY` | SSH private key for deployment |
| `DEPLOY_HOST` | Deployment server hostname |
| `DEPLOY_USER` | Deployment server username |
| `SLACK_WEBHOOK` | Slack webhook URL for notifications |

### Creating Secrets

1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Enter secret name and value
5. Click "Add secret"

### Encoding Secrets

For binary files (certificates, keystores), encode as Base64:

```bash
# macOS/Linux
base64 -i certificate.p12 | pbcopy

# Windows PowerShell
[Convert]::ToBase64String([IO.File]::ReadAllBytes('certificate.p12')) | Set-Clipboard

# Linux
base64 certificate.p12 | xclip -selection clipboard
```

## Build Triggers

### Automatic Triggers

Workflows are automatically triggered by:

1. **Push to main/develop**: Runs build and test jobs
2. **Pull Request**: Runs build and test jobs
3. **Version Tag (v*)**: Runs full pipeline including publish
4. **Manual Dispatch**: Click "Run workflow" in Actions tab

### Manual Trigger

To manually trigger a workflow:

1. Go to repository "Actions" tab
2. Select workflow (e.g., "Build Android")
3. Click "Run workflow"
4. Select branch and options
5. Click "Run workflow"

### Conditional Triggers

Workflows use conditions to run specific jobs:

```yaml
# Only on pull requests
if: github.event_name == 'pull_request'

# Only on version tags
if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')

# Only on main branch
if: github.ref == 'refs/heads/main'
```

## Platform-Specific Details

### Android Build Process

1. **Setup**: Install Java, Android SDK, Gradle
2. **Build**: Compile APK (debug) or AAB (release)
3. **Sign**: Sign with keystore
4. **Test**: Run tests and linting
5. **Publish**: Upload to Google Play Store

**Time**: ~30 minutes
**Storage**: ~2 GB

### Windows Build Process

1. **Setup**: Install Node.js, build tools
2. **Build**: Create installers (NSIS, MSI, portable)
3. **Sign**: Code sign executables
4. **Test**: Run tests and linting
5. **Publish**: Upload to website

**Time**: ~20 minutes
**Storage**: ~1 GB

### Linux Build Process

1. **Setup**: Install build dependencies
2. **Build**: Create packages (AppImage, Snap, Flatpak, DEB, RPM)
3. **Test**: Run tests and linting
4. **Publish**: Upload to Snap Store and website

**Time**: ~25 minutes
**Storage**: ~1.5 GB

### iOS Build Process

1. **Setup**: Install Xcode, CocoaPods
2. **Build**: Compile IPA
3. **Sign**: Code sign with certificate
4. **Test**: Run tests and linting
5. **Publish**: Upload to TestFlight and App Store

**Time**: ~40 minutes
**Storage**: ~3 GB

### macOS Build Process

1. **Setup**: Install Xcode, build tools
2. **Build**: Create DMG and App bundle
3. **Sign**: Code sign and notarize
4. **Test**: Run tests and linting
5. **Publish**: Upload to website

**Time**: ~35 minutes
**Storage**: ~2 GB

## Deployment Process

### Google Play Store Deployment

1. Build AAB file
2. Sign with release keystore
3. Upload to Google Play Console
4. Set track (internal, alpha, beta, production)
5. Create release notes
6. Submit for review

### App Store Deployment

1. Build IPA file
2. Sign with distribution certificate
3. Upload to App Store Connect
4. Create release notes
5. Submit for review

### Website Deployment

1. Build platform-specific packages
2. Generate checksums
3. Upload to deployment server via SSH
4. Update download page
5. Update version information

## Monitoring and Troubleshooting

### Viewing Build Status

1. Go to repository "Actions" tab
2. Click workflow name to view runs
3. Click run to view details
4. Click job to view logs

### Common Issues

#### Build Fails: "Keystore not found"

**Solution**: Verify keystore Base64 encoding and secret name

```bash
# Re-encode keystore
base64 -i release.keystore > keystore.b64

# Update secret with new value
```

#### Build Fails: "Certificate expired"

**Solution**: Renew certificate and update secret

```bash
# Generate new certificate
keytool -genkey -v -keystore release.keystore ...

# Encode and update secret
```

#### Build Fails: "Insufficient permissions"

**Solution**: Verify GitHub token and deployment credentials

```bash
# Check token permissions
# Settings → Developer settings → Personal access tokens

# Verify SSH key
ssh -i ~/.ssh/deploy_key deploy@host
```

#### Build Timeout

**Solution**: Increase timeout in workflow

```yaml
timeout-minutes: 120  # Increase from 60
```

### Build Logs

Access build logs:

1. Go to Actions tab
2. Click workflow run
3. Click job
4. View logs in "Run" section
5. Download logs as artifacts

### Debugging Workflows

Enable debug logging:

1. Go to repository Settings
2. Click "Secrets and variables" → "Actions"
3. Add secret: `ACTIONS_STEP_DEBUG` = `true`
4. Re-run workflow
5. View detailed logs

## Best Practices

1. **Use Branch Protection**: Require status checks on main branch
2. **Semantic Versioning**: Use v1.0.0 format for tags
3. **Release Notes**: Provide detailed release notes
4. **Test Locally**: Test builds locally before pushing
5. **Monitor Costs**: GitHub Actions have free tier limits
6. **Rotate Secrets**: Regularly rotate signing certificates
7. **Backup Artifacts**: Keep backup of signed artifacts
8. **Document Changes**: Update documentation with build changes

## Support

For issues or questions about CI/CD:

- **Documentation**: https://metodo.app/docs/ci-cd
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **Email Support**: supportramsandesh@gmail.com
