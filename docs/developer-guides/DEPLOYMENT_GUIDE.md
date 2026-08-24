# MeTodo - Deployment & Release Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains how to build, deploy, and release MeTodo for iOS, Android, and web platforms.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Pre-Release Checklist](#pre-release-checklist)
3. [Building for iOS](#building-for-ios)
4. [Building for Android](#building-for-android)
5. [Web Deployment](#web-deployment)
6. [Release Process](#release-process)
7. [Post-Release](#post-release)

---

## Introduction

### Release Platforms

- **iOS:** Apple App Store
- **Android:** Google Play Store
- **Web:** Vercel, Netlify, or custom server

### Release Cycle

1. Development
2. Testing
3. Version bump
4. Build
5. Submit
6. Review
7. Release
8. Monitor

---

## Pre-Release Checklist

### Code Quality

- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Code formatted
- [ ] Linting passed
- [ ] No security issues

### Features

- [ ] All features working
- [ ] No known bugs
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Cross-platform tested

### Documentation

- [ ] README updated
- [ ] CHANGELOG updated
- [ ] API docs updated
- [ ] User guides updated
- [ ] Deployment docs updated

### Version

- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Git tag created
- [ ] Release notes written

---

## Building for iOS

### Prerequisites

**Requirements:**
- macOS
- Xcode
- Apple Developer Account
- Provisioning profiles
- Certificates

### Build Process

**Step 1: Update Version**
```bash
# Update app.config.ts
version: "1.0.0"

# Update CHANGELOG.md
# Update package.json
```

**Step 2: Build for iOS**
```bash
# Using Expo
eas build --platform ios

# Or locally with Xcode
npm run build:ios
```

**Step 3: Submit to App Store**
```bash
# Using Expo
eas submit --platform ios

# Or manually
# Open Xcode
# Product → Archive
# Distribute App
```

### App Store Review

**Review Guidelines:**
- No crashes
- Functional
- Privacy policy
- Age rating
- Screenshots
- Description

**Common Rejection Reasons:**
- Crashes on launch
- Incomplete features
- Privacy issues
- Misleading content
- Broken links

---

## Building for Android

### Prerequisites

**Requirements:**
- Android SDK
- Keystore file
- Google Play Developer Account
- Signing key

### Build Process

**Step 1: Create Keystore**
```bash
# Generate keystore (one time)
keytool -genkey -v -keystore metodo.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias metodo
```

**Step 2: Build for Android**
```bash
# Using Expo
eas build --platform android

# Or locally
npm run build:android
```

**Step 3: Submit to Play Store**
```bash
# Using Expo
eas submit --platform android

# Or manually
# Open Google Play Console
# Create release
# Upload APK/AAB
```

### Play Store Review

**Review Guidelines:**
- No crashes
- Functional
- Privacy policy
- Content rating
- Screenshots
- Description

**Common Rejection Reasons:**
- Crashes
- Incomplete features
- Privacy violations
- Misleading content
- Policy violations

---

## Web Deployment

### Build for Web

**Step 1: Build**
```bash
# Build for production
npm run build

# Or using Expo
expo export --platform web
```

**Step 2: Output**
```
dist/
├── index.html
├── bundle.js
├── styles.css
└── assets/
```

### Deploy to Vercel

**Step 1: Connect Repository**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel
```

**Step 2: Configure**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "REACT_APP_API_URL": "https://api.metodo.app"
  }
}
```

### Deploy to Netlify

**Step 1: Connect Repository**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Step 2: Configure**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[env]
  REACT_APP_API_URL = "https://api.metodo.app"
```

---

## Release Process

### Version Numbering

**Semantic Versioning:**
```
MAJOR.MINOR.PATCH
1.0.0

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes
```

### Update Version

**Step 1: Update Files**
```bash
# app.config.ts
version: "1.1.0"

# package.json
"version": "1.1.0"

# CHANGELOG.md
## [1.1.0] - 2026-06-29
### Added
- New feature 1
- New feature 2

### Fixed
- Bug fix 1
- Bug fix 2
```

**Step 2: Commit Changes**
```bash
git add .
git commit -m "chore: bump version to 1.1.0"
```

**Step 3: Create Tag**
```bash
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### Create Release Notes

**Format:**
```markdown
# MeTodo v1.1.0

## What's New

### Features
- Feature 1 description
- Feature 2 description

### Improvements
- Improvement 1
- Improvement 2

### Bug Fixes
- Bug fix 1
- Bug fix 2

### Known Issues
- Known issue 1
- Known issue 2

## Installation

### iOS
Download from App Store

### Android
Download from Google Play Store

### Web
Visit https://metodo.app

## Support
Email: supportramsandesh@gmail.com
```

---

## Post-Release

### Monitor

**Check Metrics:**
- Crash rates
- User feedback
- Performance metrics
- Error rates
- User engagement

**Monitor Tools:**
- Sentry (error tracking)
- Firebase Analytics
- App Store Analytics
- Play Store Analytics

### Hotfix

**If Critical Bug Found:**
```bash
# Create hotfix branch
git checkout -b hotfix/critical-bug

# Fix bug
# Test thoroughly

# Merge to main
git checkout main
git merge hotfix/critical-bug

# Create patch release
# v1.1.1
```

### Communication

**Announce Release:**
- GitHub Releases
- Email newsletter
- Social media
- In-app notification
- Documentation

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
