# Multi-Platform Deployment Guide

## Overview

This comprehensive guide covers the complete deployment process for MeTodo across all platforms: Android (Google Play Store), Windows (.exe), Linux (.dmg), with preparation for iOS and macOS. Each platform has unique requirements, build processes, and distribution channels.

## Table of Contents

1. [Android Deployment](#android-deployment)
2. [Windows Deployment](#windows-deployment)
3. [Linux Deployment](#linux-deployment)
4. [iOS Deployment (Future)](#ios-deployment-future)
5. [macOS Deployment (Future)](#macos-deployment-future)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Release Management](#release-management)
8. [Troubleshooting](#troubleshooting)

---

## Android Deployment

### Prerequisites

- Google Play Developer Account ($25 one-time fee)
- Android keystore file
- Signing certificate
- EAS Build account
- Fastlane installed and configured

### Build Configuration

Android builds are configured in `build-config/android-build.config.ts` with the following key settings:

**Build Variants:**
- **Debug**: For development and testing
- **Staging**: For pre-release testing with optimization
- **Release**: For production deployment

**Optimization Settings:**
- Minimum SDK: 24 (Android 7.0)
- Target SDK: 34 (Android 14)
- ProGuard enabled for code obfuscation
- R8 compiler for optimization
- Multidex support enabled

### Step-by-Step Deployment

#### 1. Generate Signing Keystore

```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10950 \
  -alias metodo -storepass $KEYSTORE_PASSWORD \
  -keypass $KEY_PASSWORD
```

Store the keystore file securely and set environment variables:

```bash
export ANDROID_KEYSTORE_PATH="./android/app/release.keystore"
export ANDROID_KEYSTORE_PASSWORD="your_keystore_password"
export ANDROID_KEY_ALIAS="metodo"
export ANDROID_KEY_PASSWORD="your_key_password"
```

#### 2. Configure EAS Build

Create `.eas/build.json`:

```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "release",
        "gradleCommand": ":app:bundleRelease"
      }
    }
  }
}
```

#### 3. Build for Google Play

```bash
# Build for internal testing
eas build --platform android --profile preview

# Build for staging
eas build --platform android --profile staging

# Build for production
eas build --platform android --profile production
```

#### 4. Upload to Google Play

Configure Fastlane:

```bash
fastlane android init
```

Update `fastlane/Fastfile`:

```ruby
default_platform(:android)

platform :android do
  desc "Deploy a new version to the Google Play"
  lane :deploy do
    build_android_app(
      task: "bundle",
      project_dir: "android/",
      gradle_path: "gradle"
    )

    upload_to_play_store(
      track: "production",
      aab: "android/app/build/outputs/bundle/release/app-release.aab",
      json_key: ENV["ANDROID_JSON_KEY"]
    )
  end
end
```

Deploy:

```bash
fastlane android deploy
```

### Google Play Store Submission

1. **App Listing**
   - App title: "MeTodo"
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - Screenshots (minimum 2, maximum 8)
   - Feature graphic (1024x500 px)
   - Icon (512x512 px)

2. **Content Rating**
   - Fill out content rating questionnaire
   - Get rating for your app

3. **Pricing & Distribution**
   - Set as free
   - Select countries for distribution
   - Configure content restrictions

4. **Release Management**
   - Create release on "Internal testing" track
   - Test with internal testers
   - Promote to "Closed testing" for beta
   - Promote to "Production" for release

### Monitoring & Updates

After release, monitor:

- Crash reports in Google Play Console
- User ratings and reviews
- Installation statistics
- Performance metrics

---

## Windows Deployment

### Prerequisites

- Windows 10/11 development machine
- Visual Studio Build Tools
- Code signing certificate (optional but recommended)
- Electron Builder installed
- NSIS installer framework

### Build Configuration

Windows builds are configured in `build-config/windows-build.config.ts` with support for:

- **NSIS Installer** (.exe)
- **Portable Executable** (standalone)
- **MSI Installer** (Windows native)
- **AppX** (Microsoft Store)

### Step-by-Step Deployment

#### 1. Set Up Code Signing (Optional)

Generate self-signed certificate:

```bash
# Create certificate
New-SelfSignedCertificate -CertStoreLocation "Cert:\CurrentUser\My" `
  -Subject "CN=MeTodo" -KeyUsage DigitalSignature -Type CodeSigningCert

# Export certificate
Export-PfxCertificate -Cert "Cert:\CurrentUser\My\<thumbprint>" `
  -FilePath "metodo.pfx" -Password (ConvertTo-SecureString -String "password" -AsPlainText -Force)
```

Set environment variables:

```bash
$env:WIN_CERTIFICATE_FILE = "path/to/metodo.pfx"
$env:WIN_CERTIFICATE_PASSWORD = "certificate_password"
```

#### 2. Build for Windows

```bash
# Build all Windows formats
npm run electron:build -- --win

# Build specific format
npm run electron:build -- --win nsis  # NSIS installer
npm run electron:build -- --win portable  # Portable exe
npm run electron:build -- --win msi  # MSI installer
```

#### 3. Create Installer

The NSIS installer is automatically created with:

- Installation wizard
- Desktop shortcut
- Start menu entry
- Uninstaller
- Auto-update capability

#### 4. Sign Executable (Optional)

```bash
# Sign with certificate
signtool sign /f metodo.pfx /p "password" /t http://timestamp.comodoca.com /fd SHA256 "dist/windows/MeTodo-1.0.0-x64-installer.exe"
```

#### 5. Distribute

**Website Distribution:**

```bash
# Upload to website
scp dist/windows/*.exe user@metodo.app:/var/www/downloads/windows/

# Update download page
# Update version in website database
# Notify users of new release
```

**Automatic Updates:**

Configure auto-update in electron main process:

```typescript
import { autoUpdater } from "electron-updater";

autoUpdater.checkForUpdatesAndNotify();
```

### Windows Defender SmartScreen

To avoid SmartScreen warnings:

1. Sign your executable with a valid code signing certificate
2. Build reputation by distributing widely
3. Request reputation review from Microsoft

---

## Linux Deployment

### Prerequisites

- Linux build machine (Ubuntu 20.04+)
- Build tools: `build-essential`, `libgtk-3-dev`
- Electron Builder
- AppImage tools
- Snap tools (optional)
- Flatpak tools (optional)

### Build Configuration

Linux builds are configured in `build-config/linux-build.config.ts` with support for:

- **AppImage** (universal Linux package)
- **Snap** (Ubuntu/Linux package)
- **Flatpak** (universal Linux package)
- **DEB** (Debian/Ubuntu package)
- **RPM** (RedHat/Fedora package)
- **TAR.GZ** (source archive)

### Step-by-Step Deployment

#### 1. Install Dependencies

```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential \
  libgtk-3-dev \
  libnotify-dev \
  libnss3-dev \
  libxss-dev \
  libxtst-dev \
  xdg-utils \
  libappindicator1 \
  libsecret-1-dev \
  fonts-liberation
```

#### 2. Build for Linux

```bash
# Build all formats
npm run electron:build -- --linux

# Build specific format
npm run electron:build -- --linux AppImage  # AppImage
npm run electron:build -- --linux snap      # Snap
npm run electron:build -- --linux flatpak   # Flatpak
npm run electron:build -- --linux deb       # DEB
npm run electron:build -- --linux rpm       # RPM
```

#### 3. AppImage Distribution

AppImage is a universal Linux format:

```bash
# The AppImage is created automatically
# Make it executable
chmod +x dist/linux/MeTodo-1.0.0-x64.AppImage

# Test it
./dist/linux/MeTodo-1.0.0-x64.AppImage

# Upload to website
scp dist/linux/*.AppImage user@metodo.app:/var/www/downloads/linux/
```

#### 4. Snap Distribution

Create `snap/snapcraft.yaml`:

```yaml
name: metodo
version: '1.0.0'
summary: Stay productive with MeTodo
description: |
  MeTodo is a powerful task management application
  designed to help you stay productive and organized.

grade: stable
confinement: strict

apps:
  metodo:
    command: metodo
    plugs:
      - home
      - network
      - network-bind
      - x11
      - unity7
```

Build and publish:

```bash
snapcraft
snapcraft upload metodo_1.0.0_amd64.snap --release=stable
```

#### 5. Flatpak Distribution

Create `metodo.flatpak.yaml`:

```yaml
app-id: space.manus.metodo
runtime: org.freedesktop.Platform
runtime-version: '23.08'
sdk: org.freedesktop.Sdk
```

Build and publish:

```bash
flatpak-builder build space.manus.metodo.json metodo.flatpak.yaml
flatpak build-bundle build metodo.flatpakbundle space.manus.metodo
```

#### 6. DEB/RPM Distribution

Create repositories for package managers:

**DEB Repository:**

```bash
# Create repository structure
mkdir -p metodo-repo/pool/main/m/metodo
cp dist/linux/*.deb metodo-repo/pool/main/m/metodo/

# Generate Release file
cd metodo-repo
apt-ftparchive generate Release.conf
```

**RPM Repository:**

```bash
# Create repository
mkdir -p metodo-repo/RPMS
cp dist/linux/*.rpm metodo-repo/RPMS/

# Generate repository metadata
createrepo metodo-repo/
```

#### 7. Website Distribution

```bash
# Upload all formats
scp dist/linux/* user@metodo.app:/var/www/downloads/linux/

# Update download page with links:
# - AppImage: https://metodo.app/download/linux/appimage
# - Snap: https://snapcraft.io/metodo
# - Flatpak: https://flathub.org/apps/space.manus.metodo
# - DEB: https://metodo.app/apt
# - RPM: https://metodo.app/yum
```

---

## iOS Deployment (Future)

### Prerequisites

- Apple Developer Account ($99/year)
- Mac with Xcode
- iOS Development Certificate
- Provisioning Profiles
- App Store Connect access
- Fastlane installed

### Configuration

iOS builds will be configured in `build-config/ios-macos-build.config.ts` with:

- **App Store Distribution**
- **TestFlight Beta Testing**
- **Ad-hoc Distribution**
- **Enterprise Distribution**

### Future Steps

1. Set up Apple Developer Account
2. Create App Store Connect app record
3. Generate signing certificates
4. Create provisioning profiles
5. Configure Fastlane
6. Build and submit to App Store

---

## macOS Deployment (Future)

### Prerequisites

- Apple Developer Account ($99/year)
- Mac with Xcode
- macOS Development Certificate
- Provisioning Profiles
- App Store Connect access
- Fastlane installed

### Configuration

macOS builds will be configured in `build-config/ios-macos-build.config.ts` with:

- **App Store Distribution**
- **Direct Distribution**
- **Notarization** (required for security)

### Future Steps

1. Set up Apple Developer Account
2. Create App Store Connect app record
3. Generate signing certificates
4. Create provisioning profiles
5. Configure Fastlane
6. Implement notarization
7. Build and submit to App Store

---

## CI/CD Pipeline

### GitHub Actions Workflows

Automated workflows are configured in `.github/workflows/`:

**Build Workflow** (`build.yml`)
- Triggers on push to main/develop
- Runs TypeScript checks
- Runs linting
- Runs tests
- Builds for all platforms

**Android Build Workflow** (`android-build.yml`)
- Triggers on push to main or tag
- Builds APK/AAB
- Signs with keystore
- Uploads to Google Play

**Windows Build Workflow** (`windows-build.yml`)
- Triggers on push to main or tag
- Builds .exe installers
- Signs with certificate
- Uploads artifacts

**Linux Build Workflow** (`linux-build.yml`)
- Triggers on push to main or tag
- Builds AppImage, Snap, Flatpak, DEB, RPM
- Uploads artifacts

**Release Workflow** (`release.yml`)
- Triggers on tag push
- Creates GitHub release
- Publishes to npm
- Notifies users

### Environment Variables

Set the following secrets in GitHub:

```
EAS_TOKEN              # EAS Build token
ANDROID_JSON_KEY       # Google Play service account key
WIN_CERTIFICATE_FILE   # Windows code signing certificate
WIN_CERTIFICATE_PASSWORD # Certificate password
SLACK_WEBHOOK          # Slack notification webhook
NPM_TOKEN              # npm publishing token
DEPLOY_TOKEN           # Deployment token
```

### Running Builds Locally

```bash
# Build all platforms
npm run build:all

# Build specific platform
npm run build:android
npm run build:windows
npm run build:linux

# Run tests
npm run test

# Run linting
npm run lint
```

---

## Release Management

### Version Management

Versions follow semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features
- **PATCH**: Bug fixes

### Release Process

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version**
   ```bash
   npm version minor  # or patch, major
   ```

3. **Update Changelog**
   - Add changes to `CHANGELOG.md`
   - Add release notes to `RELEASE_NOTES.md`

4. **Commit and Tag**
   ```bash
   git commit -am "Release v1.0.0"
   git tag v1.0.0
   git push origin release/v1.0.0 --tags
   ```

5. **Create Pull Request**
   - Create PR to main
   - Get approvals
   - Merge to main

6. **CI/CD Automation**
   - GitHub Actions automatically builds all platforms
   - Uploads to respective stores
   - Creates GitHub release
   - Notifies users

### Rollback Procedure

If issues are found after release:

1. **Identify Issue**
   - Check crash reports
   - Review user feedback
   - Analyze error logs

2. **Create Hotfix**
   ```bash
   git checkout -b hotfix/v1.0.1
   # Fix the issue
   git commit -am "Fix critical issue"
   ```

3. **Release Hotfix**
   ```bash
   npm version patch
   git tag v1.0.1
   git push origin hotfix/v1.0.1 --tags
   ```

4. **Rollback on Stores**
   - Google Play: Unpublish current version, republish previous
   - Windows/Linux: Update website to point to previous version
   - iOS/macOS: Contact Apple Support

---

## Troubleshooting

### Common Issues

**Android Build Fails**
- Check keystore password
- Verify SDK versions
- Check ProGuard rules
- Review build logs

**Windows Build Fails**
- Ensure Visual Studio Build Tools installed
- Check code signing certificate
- Verify NSIS installation
- Check environment variables

**Linux Build Fails**
- Install all dependencies
- Check GTK3 development files
- Verify Electron Builder version
- Review build logs

**Deployment Fails**
- Verify credentials
- Check network connectivity
- Review API rate limits
- Check store account status

### Getting Help

- Check logs in `.manus-logs/`
- Review GitHub Actions logs
- Check platform-specific documentation
- Contact support at support@metodo.app

---

## Security Considerations

### Code Signing

- Always sign production builds
- Use strong passwords for keystores
- Rotate certificates regularly
- Store credentials securely

### Distribution

- Use HTTPS for downloads
- Verify checksums
- Implement auto-update
- Monitor for tampering

### Updates

- Test updates thoroughly
- Implement rollback capability
- Monitor update success rates
- Notify users of critical updates

---

## Performance Optimization

### Build Optimization

- Enable ProGuard/R8 for Android
- Use code splitting for web
- Optimize assets
- Remove unused code

### Distribution Optimization

- Use CDN for downloads
- Implement delta updates
- Compress artifacts
- Monitor download speeds

### Runtime Optimization

- Profile app performance
- Optimize database queries
- Reduce memory usage
- Implement caching

---

## Monitoring & Analytics

### Build Metrics

- Build success rate
- Build duration
- Artifact size
- Deployment time

### Runtime Metrics

- Crash rate
- Error rate
- User retention
- Feature usage

### Distribution Metrics

- Download count
- Installation count
- Update rate
- User feedback

---

## Support & Resources

- **Website**: https://metodo.app
- **Documentation**: https://metodo.app/docs
- **Support**: support@metodo.app
- **Issues**: https://github.com/sanskaryadav/metodo/issues
- **Releases**: https://github.com/sanskaryadav/metodo/releases

---

Last Updated: July 2, 2026
Version: 1.0.0
