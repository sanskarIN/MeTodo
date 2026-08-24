# MeTodo - Build Guide for Executable Files

## Table of Contents

1. [Overview](#overview)
2. [Web Build](#web-build)
3. [iOS Build (.ipa)](#ios-build-ipa)
4. [Android Build (.apk & .aab)](#android-build-apk--aab)
5. [Desktop Build (.exe, .dmg, .deb)](#desktop-build-exe-dmg-deb)
6. [Build Optimization](#build-optimization)
7. [Troubleshooting](#troubleshooting)

---

## Overview

MeTodo can be built into executable files for different platforms:

| Platform | Format | Size | Distribution |
|----------|--------|------|--------------|
| Web | HTML/JS | 40MB | Browser |
| iOS | .ipa | 80MB | App Store |
| Android | .apk | 60MB | Google Play / Direct |
| Android | .aab | 50MB | Google Play |
| macOS | .dmg | 90MB | Direct / Mac App Store |
| Windows | .exe | 100MB | Direct |
| Linux | .deb | 85MB | Direct / Package Manager |

---

## Web Build

### Build for Web

```bash
# Build web version
pnpm build

# Or use Expo build
expo build:web
```

**Output:** `dist/` directory containing:
- `index.html` - Main HTML file
- `index.js` - Bundled JavaScript
- `index.css` - Bundled CSS
- Static assets

### Deploy Web Build

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel dist/
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 3: GitHub Pages

```bash
# Build
pnpm build

# Push to GitHub
git add dist/
git commit -m "Deploy web build"
git push origin main
```

#### Option 4: Self-Hosted

```bash
# Copy dist/ to your server
scp -r dist/ user@server:/var/www/metodo

# Or use FTP/SFTP
```

---

## iOS Build (.ipa)

### Prerequisites

- macOS with Xcode 13.0+
- Apple Developer Account
- Development certificate
- Provisioning profile
- App ID

### Build Steps

#### Step 1: Prepare for iOS Build

```bash
# Update app.config.ts with iOS settings
# Ensure bundleIdentifier is set correctly
# Example: space.manus.metodo

# Install iOS dependencies
cd ios
pod install
cd ..
```

#### Step 2: Build for iOS

```bash
# Using Expo Cloud Build (Recommended)
eas build --platform ios

# Or build locally
xcodebuild -workspace ios/MeTodo.xcworkspace \
  -scheme MeTodo \
  -configuration Release \
  -archivePath build/MeTodo.xcarchive \
  archive

# Export archive to .ipa
xcodebuild -exportArchive \
  -archivePath build/MeTodo.xcarchive \
  -exportOptionsPlist ios/ExportOptions.plist \
  -exportPath build/
```

#### Step 3: Sign the App

```bash
# Signing is handled automatically by Xcode
# Or manually sign using:
codesign -s "iPhone Developer" build/MeTodo.ipa
```

#### Step 4: Upload to App Store

```bash
# Using Transporter (Apple's official tool)
# Download from App Store

# Or use xcrun
xcrun altool --upload-app \
  --file build/MeTodo.ipa \
  --type ios \
  --apiKey your_api_key \
  --apiIssuer your_issuer_id
```

### Output

- **File:** `build/MeTodo.ipa`
- **Size:** ~80MB
- **Installation:** App Store or direct installation via Xcode

---

## Android Build (.apk & .aab)

### Prerequisites

- Android SDK 24+
- Android Build Tools
- Java Development Kit (JDK) 11+
- Keystore file for signing

### Create Keystore File

```bash
# Generate keystore (one-time only)
keytool -genkey -v \
  -keystore metodo-keystore.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias metodo-key

# You'll be prompted for:
# - Keystore password
# - Key password
# - Name, organization, etc.
```

### Build APK

```bash
# Using Expo Cloud Build (Recommended)
eas build --platform android

# Or build locally
./gradlew assembleRelease

# Output: android/app/build/outputs/apk/release/app-release.apk
```

### Build AAB (Android App Bundle)

```bash
# Using Expo Cloud Build
eas build --platform android --app-variant aab

# Or build locally
./gradlew bundleRelease

# Output: android/app/build/outputs/bundle/release/app-release.aab
```

### Sign APK

```bash
# If not automatically signed, sign manually
jarsigner -verbose \
  -sigalg SHA1withRSA \
  -digestalg SHA1 \
  -keystore metodo-keystore.jks \
  android/app/build/outputs/apk/release/app-release-unsigned.apk \
  metodo-key

# Zipalign for optimization
zipalign -v 4 \
  app-release-unsigned.apk \
  app-release.apk
```

### Upload to Google Play

```bash
# Using Play Console (Web UI)
# 1. Go to https://play.google.com/console
# 2. Select your app
# 3. Go to Release > Production
# 4. Upload AAB file

# Or use Play Console API
# Documentation: https://developers.google.com/play/console/api
```

### Direct APK Distribution

```bash
# Share APK directly
# Users can install with:
adb install app-release.apk

# Or via email/download link
```

---

## Desktop Build (.exe, .dmg, .deb)

### Prerequisites

- Electron (for desktop apps)
- Platform-specific build tools
- Code signing certificates

### Build for macOS (.dmg)

```bash
# Install Electron
npm install electron --save-dev

# Build macOS app
npm run build:mac

# Output: dist/MeTodo-1.0.0.dmg
```

### Build for Windows (.exe)

```bash
# Install Electron
npm install electron --save-dev

# Build Windows app
npm run build:win

# Output: dist/MeTodo-1.0.0-Setup.exe
```

### Build for Linux (.deb)

```bash
# Install Electron
npm install electron --save-dev

# Build Linux app
npm run build:linux

# Output: dist/metodo_1.0.0_amd64.deb
```

---

## Build Optimization

### Reduce App Size

```bash
# Analyze bundle size
npm run analyze

# Remove unused dependencies
npm prune --production

# Optimize images
npx imagemin assets/images/* --out-dir=assets/images-optimized
```

### Performance Optimization

```bash
# Enable code splitting
# In webpack.config.js or similar

# Minify code
npm run build -- --minify

# Enable gzip compression
npm run build -- --compress
```

### Build Caching

```bash
# Clear build cache
rm -rf dist/
rm -rf .expo/

# Rebuild
pnpm build
```

---

## Automated Build Pipeline

### GitHub Actions

Create `.github/workflows/build.yml`:

```yaml
name: Build MeTodo

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build web
        run: npm run build
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v2
        with:
          name: build
          path: dist/
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - dist/
```

---

## Build Configuration

### app.config.ts Settings

```typescript
export default {
  // App metadata
  name: "MeTodo",
  slug: "metodo",
  version: "1.0.0",
  
  // iOS settings
  ios: {
    bundleIdentifier: "space.manus.metodo",
    supportsTablet: true,
  },
  
  // Android settings
  android: {
    package: "space.manus.metodo",
    versionCode: 1,
  },
  
  // Build options
  plugins: [
    "expo-router",
    "expo-build-properties",
  ],
};
```

---

## Signing & Certificates

### iOS Certificates

```bash
# Create certificate signing request
# In Xcode: Xcode > Preferences > Accounts

# Download from Apple Developer
# https://developer.apple.com/account/resources/certificates/

# Install certificate
# Double-click .cer file
```

### Android Keystore

```bash
# List keystore contents
keytool -list -v -keystore metodo-keystore.jks

# Change keystore password
keytool -storepasswd -keystore metodo-keystore.jks

# Change key password
keytool -keypasswd -keystore metodo-keystore.jks -alias metodo-key
```

---

## Distribution Channels

### App Stores

| Store | Platform | Requirements |
|-------|----------|--------------|
| App Store | iOS | Apple Developer Account |
| Google Play | Android | Google Developer Account |
| Mac App Store | macOS | Apple Developer Account |
| Microsoft Store | Windows | Microsoft Developer Account |

### Direct Distribution

```bash
# Web: Host on server
# iOS: Share .ipa via email/link
# Android: Share .apk via email/link
# Desktop: Host .exe/.dmg/.deb on server
```

---

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules
rm -rf .expo
pnpm install

# Check Node version
node --version

# Check dependencies
pnpm check
```

### Signing Issues

```bash
# iOS: Check provisioning profile
# Android: Check keystore file exists and password is correct

# Regenerate if needed
keytool -genkey -v -keystore metodo-keystore.jks ...
```

### Size Issues

```bash
# Analyze bundle
npm run analyze

# Remove unused packages
npm prune

# Optimize images
npx imagemin assets/images/* --out-dir=assets/images-optimized
```

### Upload Failures

```bash
# Check file format
file app-release.apk

# Check file size
ls -lh app-release.apk

# Verify signing
jarsigner -verify -verbose app-release.apk
```

---

## Version Management

### Update Version

```bash
# In app.config.ts
export default {
  version: "1.1.0",  // Change this
  ios: {
    buildNumber: "2",  // iOS build number
  },
  android: {
    versionCode: 2,  // Android version code
  },
};

# Commit version change
git add app.config.ts
git commit -m "Bump version to 1.1.0"
git tag v1.1.0
```

---

## Performance Metrics

### Build Times

| Platform | Time | Notes |
|----------|------|-------|
| Web | 2-3 min | Fastest |
| iOS | 10-15 min | Requires Xcode |
| Android | 8-12 min | Requires Android SDK |
| Desktop | 5-10 min | Requires Electron |

### File Sizes

| Format | Size | Compressed |
|--------|------|-----------|
| Web | 40MB | 8MB (gzipped) |
| iOS | 80MB | N/A |
| Android APK | 60MB | N/A |
| Android AAB | 50MB | N/A |

---

## Resources

### Official Documentation

- [Expo Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Build Guide](https://reactnative.dev/docs/signed-apk-android)
- [Electron Documentation](https://www.electronjs.org/docs)

### Tools

- [Expo CLI](https://docs.expo.dev/more/expo-cli/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [Xcode](https://developer.apple.com/xcode/)
- [Android Studio](https://developer.android.com/studio)

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
