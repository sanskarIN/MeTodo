# MeTodo - Quick Reference Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This quick reference guide provides shortcuts, commands, and essential information for MeTodo users and developers.

---

## Table of Contents

1. [User Shortcuts](#user-shortcuts)
2. [Developer Commands](#developer-commands)
3. [File Locations](#file-locations)
4. [Configuration](#configuration)
5. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## User Shortcuts

### Task Management

| Action | Steps |
|--------|-------|
| Create Task | Home → + button → Fill form → Save |
| Edit Task | Task → Edit button → Modify → Save |
| Delete Task | Task → Swipe left → Delete → Confirm |
| Mark Complete | Task → Tap checkbox |
| Set Reminder | Task → Reminder → Select time |
| Add Subtask | Task → Subtasks → + button → Add |
| Change Priority | Task → Priority → Select level |
| Add Tag | Task → Tags → Select or create |

### Navigation

| Screen | Path |
|--------|------|
| Home | Home tab |
| Tasks | Tasks tab |
| Avatar | Avatar tab |
| Settings | Settings tab |
| Task Detail | Task → Tap |
| Create Task | Home → + button |
| Theme Creator | Settings → Themes → + button |
| Developer Options | Settings → Tap version 10 times |

---

## Developer Commands

### Development

```bash
# Start development
npm run dev

# Check TypeScript
npm run check

# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Build for production
npm run build
```

### Building

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for web
npm run build

# Build locally
npm run build:ios
npm run build:android
```

### Debugging

```bash
# Clear cache
npm run dev -- --clear

# View logs
tail -f .manus-logs/devserver.log

# Debug in browser
# Press F12 in web preview

# React DevTools
# Install Chrome extension
```

---

## File Locations

### Important Files

| File | Purpose |
|------|---------|
| `app.config.ts` | App configuration |
| `package.json` | Project metadata |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | Tailwind config |
| `theme.config.js` | Theme colors |
| `.env.local` | Environment variables |

### Important Directories

| Directory | Purpose |
|-----------|---------|
| `app/` | Screens and routes |
| `components/` | Reusable components |
| `hooks/` | Custom hooks |
| `lib/` | Utilities and helpers |
| `types/` | Type definitions |
| `docs/` | Documentation |
| `assets/` | Images and fonts |

---

## Configuration

### Environment Variables

```bash
# .env.local

# Development
NODE_ENV=development
EXPO_PORT=8081

# API
API_URL=http://localhost:3000
API_TIMEOUT=30000

# Features
ENABLE_ANALYTICS=false
ENABLE_CRASH_REPORTING=false

# Logging
LOG_LEVEL=debug
```

### Theme Colors

```javascript
// theme.config.js
const themeColors = {
  primary: { light: '#0a7ea4', dark: '#0a7ea4' },
  background: { light: '#ffffff', dark: '#151718' },
  surface: { light: '#f5f5f5', dark: '#1e2022' },
  foreground: { light: '#11181C', dark: '#ECEDEE' },
  // ... more colors
};
```

---

## Keyboard Shortcuts

### Web Preview

| Shortcut | Action |
|----------|--------|
| F12 | Open DevTools |
| Ctrl+Shift+I | Open DevTools |
| Ctrl+Shift+J | Open Console |
| Ctrl+Shift+C | Inspect Element |
| Ctrl+Plus | Zoom in |
| Ctrl+Minus | Zoom out |
| Ctrl+0 | Reset zoom |

### Metro Bundler

| Key | Action |
|-----|--------|
| a | Open Android |
| i | Open iOS |
| w | Open web |
| r | Reload |
| d | Open debugger |
| q | Quit |

### VS Code

| Shortcut | Action |
|----------|--------|
| Ctrl+K Ctrl+F | Format document |
| Ctrl+Shift+P | Command palette |
| Ctrl+` | Toggle terminal |
| Ctrl+B | Toggle sidebar |
| Ctrl+F | Find |
| Ctrl+H | Find and replace |

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
