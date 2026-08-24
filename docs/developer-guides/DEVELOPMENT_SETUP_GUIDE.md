# MeTodo - Development Setup Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains how to set up a complete development environment for MeTodo. It covers prerequisites, installation, configuration, and verification steps for developers wanting to contribute or customize the app.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [System Requirements](#system-requirements)
4. [Installation Steps](#installation-steps)
5. [Configuration](#configuration)
6. [Verification](#verification)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)

---

## Introduction

### What This Guide Covers

This guide covers setting up MeTodo for development on your local machine. You'll learn how to:
- Install required tools
- Clone the repository
- Install dependencies
- Configure the environment
- Run the development server
- Start developing

### Who This Is For

- Developers wanting to contribute
- Developers wanting to customize
- Developers wanting to learn
- Developers wanting to build features
- Developers wanting to fix bugs

### Time Required

- Total setup time: 30-60 minutes
- Depends on internet speed
- Depends on system performance
- First-time setup takes longer

---

## Prerequisites

### Required Knowledge

**Basic Requirements:**
- Command line/terminal experience
- Git version control basics
- JavaScript/TypeScript knowledge
- React/React Native basics
- Mobile app development concepts

**Helpful But Not Required:**
- Expo experience
- React Native experience
- Mobile development experience
- TypeScript experience
- NativeWind/Tailwind experience

### Required Software

**Must Install:**
1. Node.js (v18 or higher)
2. npm or yarn or pnpm
3. Git
4. Code editor (VS Code recommended)
5. Expo CLI

**Optional But Recommended:**
- Android Studio (for Android development)
- Xcode (for iOS development on Mac)
- Expo Go app (for testing)

---

## System Requirements

### Minimum Requirements

**CPU:**
- Dual-core processor
- 2+ GHz speed
- 64-bit architecture

**RAM:**
- 4 GB minimum
- 8 GB recommended
- 16 GB for smooth development

**Storage:**
- 10 GB free space minimum
- 20 GB recommended
- SSD recommended for speed

**Network:**
- Stable internet connection
- 10+ Mbps download speed
- Required for package installation

### Operating System

**Supported OS:**
- macOS 10.15+
- Windows 10/11
- Ubuntu 18.04+
- Debian 10+
- Other Linux distributions

**OS-Specific Notes:**
- macOS: Best for iOS development
- Windows: Use WSL 2 for better experience
- Linux: Excellent for development
- All: Can develop for all platforms

---

## Installation Steps

### Step 1: Install Node.js

**On macOS:**
```bash
# Using Homebrew
brew install node

# Or download from nodejs.org
# Visit https://nodejs.org/
# Download LTS version
# Run installer
```

**On Windows:**
```bash
# Using Chocolatey
choco install nodejs

# Or download from nodejs.org
# Visit https://nodejs.org/
# Download LTS version
# Run installer
```

**On Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nodejs npm

# Or using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify Installation:**
```bash
node --version
npm --version
```

### Step 2: Install Git

**On macOS:**
```bash
# Using Homebrew
brew install git

# Or download from git-scm.com
```

**On Windows:**
```bash
# Using Chocolatey
choco install git

# Or download from git-scm.com
# Run installer
```

**On Linux:**
```bash
# Ubuntu/Debian
sudo apt install git
```

**Verify Installation:**
```bash
git --version
```

### Step 3: Install Code Editor

**Visual Studio Code (Recommended):**
```bash
# Download from code.visualstudio.com
# Or use package manager

# macOS
brew install visual-studio-code

# Windows
choco install vscode

# Linux
sudo snap install code --classic
```

**Recommended VS Code Extensions:**
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- React Native Tools

### Step 4: Install Expo CLI

```bash
# Using npm
npm install -g expo-cli

# Or using yarn
yarn global add expo-cli

# Or using pnpm
pnpm add -g expo-cli

# Verify installation
expo --version
```

### Step 5: Clone Repository

```bash
# Navigate to desired directory
cd ~/projects

# Clone repository
git clone https://github.com/Sanskar-in/MeTodo.git

# Navigate to project
cd MeTodo

# Verify clone
ls -la
```

### Step 6: Install Dependencies

```bash
# Navigate to project directory
cd MeTodo

# Install dependencies using npm
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install

# This may take 5-10 minutes
```

### Step 7: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local

# Or use your editor
code .env.local

# Required variables:
# EXPO_PORT=8081
# NODE_ENV=development
```

---

## Configuration

### Environment Variables

**Create .env.local file:**
```bash
# .env.local

# Development environment
NODE_ENV=development

# Expo configuration
EXPO_PORT=8081
EXPO_USE_METRO_WORKSPACE_ROOT=1

# API configuration
API_URL=http://localhost:3000
API_TIMEOUT=30000

# Feature flags
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false

# Logging
LOG_LEVEL=debug
```

### Git Configuration

**Configure Git:**
```bash
# Set your name
git config user.name "Your Name"

# Set your email
git config user.email "your.email@example.com"

# Set default branch
git config init.defaultBranch main

# Verify configuration
git config --list
```

### Code Editor Setup

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/.expo": true,
    "**/.git": true
  }
}
```

---

## Verification

### Verify Installation

**Check All Tools:**
```bash
# Check Node.js
node --version
# Should show v18.x.x or higher

# Check npm
npm --version
# Should show 9.x.x or higher

# Check Git
git --version
# Should show 2.x.x or higher

# Check Expo CLI
expo --version
# Should show 5.x.x or higher
```

### Verify Project Setup

**Check Project Structure:**
```bash
# List main directories
ls -la

# Should show:
# app/
# components/
# docs/
# lib/
# package.json
# tsconfig.json
# And more...
```

### Run Development Server

**Start Metro Bundler:**
```bash
# Navigate to project
cd MeTodo

# Start development server
npm run dev

# Or
expo start

# Should show:
# Metro Bundler started
# Press 'a' for Android
# Press 'i' for iOS
# Press 'w' for web
```

**Test Web Preview:**
```bash
# In Metro output, press 'w'
# Or open browser to http://localhost:8081

# Should show MeTodo app
# Check that home screen loads
# Test basic navigation
```

---

## Development Workflow

### Daily Development

**Start Development Session:**
```bash
# Navigate to project
cd MeTodo

# Start development server
npm run dev

# Keep running in terminal
# Press 'w' for web preview
# Or 'a' for Android
# Or 'i' for iOS
```

**Make Changes:**
```bash
# Edit files in your editor
# Changes auto-reload in preview
# Check for errors in terminal
```

**Test Changes:**
```bash
# Test in web preview
# Test on physical device (if available)
# Test on emulator (if available)
# Check console for errors
```

**Commit Changes:**
```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to repository
git push origin main
```

### Common Commands

**Development:**
```bash
# Start development server
npm run dev

# Check TypeScript
npm run check

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test
```

**Building:**
```bash
# Build for production
npm run build

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## Troubleshooting

### Common Issues

**Issue: Node modules not installing**
```bash
# Solution 1: Clear cache
npm cache clean --force

# Solution 2: Delete node_modules and reinstall
rm -rf node_modules
npm install

# Solution 3: Use different package manager
pnpm install
```

**Issue: Port already in use**
```bash
# Find process using port 8081
lsof -i :8081

# Kill process
kill -9 <PID>

# Or use different port
EXPO_PORT=8082 npm run dev
```

**Issue: Metro bundler not starting**
```bash
# Solution 1: Restart bundler
# Press Ctrl+C to stop
# Run npm run dev again

# Solution 2: Clear Metro cache
npm run dev -- --clear

# Solution 3: Reset Watchman
watchman watch-del-all
```

**Issue: TypeScript errors**
```bash
# Check TypeScript
npm run check

# Fix errors
# Edit files to resolve errors

# Verify fix
npm run check
```

**Issue: Git conflicts**
```bash
# View conflicts
git status

# Resolve conflicts manually
# Edit conflicting files

# Stage resolved files
git add .

# Commit resolution
git commit -m "fix: resolve merge conflicts"
```

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
