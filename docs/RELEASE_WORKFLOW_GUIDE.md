# MeTodo Automated Release Workflow Guide

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [Release Process](#release-process)
3. [GitHub Actions Workflow](#github-actions-workflow)
4. [Build Jobs](#build-jobs)
5. [Release Creation](#release-creation)
6. [Publishing](#publishing)
7. [Monitoring](#monitoring)
8. [Rollback Procedures](#rollback-procedures)

## Overview

MeTodo uses GitHub Actions to automate the entire release process across all platforms. A single push of a version tag triggers builds for Android, iOS, Windows, Linux, and macOS, with automatic publication to app stores and the update API.

### Release Workflow Features

- **Automated Builds**: Build all platforms from single trigger
- **Multi-Platform Support**: Android, iOS, Windows, Linux, macOS
- **Code Signing**: Automatic code signing for all platforms
- **Artifact Management**: Organize and store build artifacts
- **Release Notes Generation**: Auto-generate from commit history
- **Checksum Verification**: Generate SHA256 checksums
- **API Publishing**: Publish to update API automatically
- **User Notifications**: Notify users of new releases
- **Rollback Support**: Easy rollback to previous versions

## Release Process

### Step-by-Step Release

```
1. Create Release Tag
   └─> git tag -a v1.2.0 -m "Release 1.2.0"
   └─> git push origin v1.2.0

2. GitHub Actions Triggered
   ├─> Prepare Release
   │   ├─ Extract version
   │   ├─ Generate changelog
   │   └─ Generate release notes
   │
   ├─> Build Android
   │   ├─ Build APK
   │   └─ Build AAB
   │
   ├─> Build Windows
   │   ├─ Build EXE
   │   └─ Build MSI
   │
   ├─> Build Linux
   │   ├─ Build AppImage
   │   ├─ Build Snap
   │   └─ Build Flatpak
   │
   ├─> Build iOS
   │   └─ Build IPA
   │
   └─> Build macOS
       └─ Build DMG

3. Create GitHub Release
   ├─ Upload all artifacts
   ├─ Generate checksums
   └─ Publish release notes

4. Publish to Update API
   ├─ Create release record
   ├─ Upload platform files
   └─ Update statistics

5. Notify Users
   ├─ Send push notifications
   ├─ Email notifications
   └─ In-app notifications

6. Cleanup
   └─ Delete temporary artifacts
```

## GitHub Actions Workflow

### Workflow File Location

```
.github/workflows/release-workflow.yml
```

### Workflow Triggers

```yaml
on:
  push:
    tags:
      - 'v*'  # Trigger on version tags (v1.0.0, v1.2.0, etc.)
  workflow_dispatch:  # Manual trigger
    inputs:
      version: '1.0.0'
      releaseChannel: 'stable'  # stable, beta, alpha
```

### Environment Variables

```yaml
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
```

## Build Jobs

### Android Build Job

```yaml
build-android:
  name: Build Android
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
    - name: Setup Node.js
    - name: Setup Java
    - name: Install dependencies
    - name: Build Android APK
    - name: Build Android AAB
    - name: Upload artifacts
```

**Outputs**:
- `metodo-android-apk`: APK file for Google Play Store
- `metodo-android-aab`: AAB file for internal distribution

### Windows Build Job

```yaml
build-windows:
  name: Build Windows
  runs-on: windows-latest
  steps:
    - name: Checkout code
    - name: Setup Node.js
    - name: Install dependencies
    - name: Build Windows EXE
    - name: Build Windows MSI
    - name: Upload artifacts
```

**Outputs**:
- `metodo-windows-exe`: Standalone executable
- `metodo-windows-msi`: Windows installer

### Linux Build Job

```yaml
build-linux:
  name: Build Linux
  runs-on: ubuntu-latest
  steps:
    - name: Checkout code
    - name: Setup Node.js
    - name: Install dependencies
    - name: Build AppImage
    - name: Build Snap
    - name: Build Flatpak
    - name: Upload artifacts
```

**Outputs**:
- `metodo-linux-appimage`: Universal Linux package
- `metodo-linux-snap`: Snap package
- `metodo-linux-flatpak`: Flatpak package

### iOS Build Job

```yaml
build-ios:
  name: Build iOS
  runs-on: macos-latest
  steps:
    - name: Checkout code
    - name: Setup Node.js
    - name: Setup Xcode
    - name: Install dependencies
    - name: Build iOS IPA
    - name: Upload artifacts
```

**Outputs**:
- `metodo-ios-ipa`: iOS app package

### macOS Build Job

```yaml
build-macos:
  name: Build macOS
  runs-on: macos-latest
  steps:
    - name: Checkout code
    - name: Setup Node.js
    - name: Setup Xcode
    - name: Install dependencies
    - name: Build macOS DMG
    - name: Upload artifacts
```

**Outputs**:
- `metodo-macos-dmg`: macOS disk image

## Release Creation

### GitHub Release

The `create-release` job:

1. Downloads all build artifacts
2. Generates SHA256 checksums
3. Creates GitHub Release with:
   - Release notes
   - All platform binaries
   - Checksum file

### Release Notes Format

```markdown
# Release 1.2.0

## Changes

- feat: Added team collaboration features
- fix: Fixed notification issues
- security: Updated security protocols

## Installation

Download the appropriate package for your platform from the Releases page.

## Support

For issues or questions, please visit: https://github.com/sanskaryadav/metodo/issues
```

## Publishing

### Publish to Update API

The `publish-api` job:

1. Collects all build artifacts
2. Generates checksums and file sizes
3. Creates release record in database
4. Publishes to update API endpoint
5. Notifies users via WebSocket

### API Endpoint

```
POST /api/releases/publish
Authorization: Bearer {API_TOKEN}
Content-Type: application/json

{
  "version": "1.2.0",
  "releaseChannel": "stable",
  "releaseDate": "2024-01-15T10:00:00Z",
  "releaseNotes": "...",
  "changelog": [...],
  "isBreakingChange": false,
  "requiresRestart": true,
  "platforms": {
    "android": {...},
    "ios": {...},
    "windows": {...},
    "linux": {...},
    "macos": {...}
  }
}
```

## Monitoring

### Workflow Status

View workflow status in GitHub Actions:
```
https://github.com/sanskaryadav/metodo/actions
```

### Build Logs

Each job produces detailed logs:
- Build output
- Compilation errors
- Test results
- Artifact sizes

### Notifications

Receive notifications for:
- Workflow start
- Job completion
- Build failures
- Release publication

## Rollback Procedures

### Rollback to Previous Version

```bash
# 1. Create rollback tag
git tag -a v1.1.0-rollback -m "Rollback to 1.1.0"
git push origin v1.1.0-rollback

# 2. GitHub Actions will build previous version
# 3. Users will receive rollback notification
# 4. Clients will automatically download previous version
```

### Manual Rollback

```bash
# 1. Delete failed release tag
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0

# 2. Create new tag for rollback
git tag -a v1.2.0-rc1 -m "Release 1.2.0 RC1"
git push origin v1.2.0-rc1

# 3. Workflow will rebuild with new tag
```

### Database Rollback

```sql
-- Mark release as deprecated
UPDATE releases SET status = 'deprecated' WHERE version = '1.2.0';

-- Restore previous release as stable
UPDATE releases SET status = 'stable' WHERE version = '1.1.0';

-- Clear statistics for failed release
DELETE FROM updateStats WHERE releaseId = (SELECT id FROM releases WHERE version = '1.2.0');
```

## Troubleshooting

### Build Failures

**Problem**: Android build fails
- Check Java version (must be 17+)
- Verify Android SDK is installed
- Check gradle cache

**Solution**:
```bash
# Clear gradle cache
./gradlew clean

# Rebuild
./gradlew build
```

**Problem**: iOS build fails
- Check Xcode version
- Verify provisioning profiles
- Check code signing certificates

**Solution**:
```bash
# Update Xcode
xcode-select --install

# Clear build cache
rm -rf ~/Library/Developer/Xcode/DerivedData/*
```

### Artifact Issues

**Problem**: Artifacts not uploading
- Check disk space
- Verify artifact paths
- Check GitHub storage limits

**Solution**:
```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: metodo-android-apk
    path: android/app/build/outputs/apk/release/*.apk
    retention-days: 30  # Auto-delete after 30 days
```

### API Publishing Issues

**Problem**: Failed to publish to API
- Verify API token
- Check API endpoint
- Verify network connectivity

**Solution**:
```bash
# Test API endpoint
curl -X POST https://api.metodo.app/api/releases/publish \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d @release.json
```

## Best Practices

1. **Test Before Release**: Run full test suite before tagging
2. **Update Changelog**: Keep CHANGELOG.md current
3. **Semantic Versioning**: Follow v{MAJOR}.{MINOR}.{PATCH}
4. **Release Notes**: Write clear, user-friendly release notes
5. **Monitor Adoption**: Track update adoption rates
6. **Staged Rollout**: Use staged rollout for large changes
7. **Backup Database**: Backup before major releases
8. **Document Changes**: Document breaking changes

## Support

For release workflow issues:

- **Email**: supportramsandesh@gmail.com
- **Documentation**: https://metodo.app/docs/release-workflow
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
