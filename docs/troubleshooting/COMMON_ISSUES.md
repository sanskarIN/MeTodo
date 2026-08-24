# MeTodo - Common Issues & Solutions

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide provides solutions for common issues users and developers might encounter with MeTodo.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Runtime Issues](#runtime-issues)
3. [Data Issues](#data-issues)
4. [Performance Issues](#performance-issues)
5. [Sync Issues](#sync-issues)
6. [Display Issues](#display-issues)
7. [Notification Issues](#notification-issues)

---

## Installation Issues

### Issue: npm install fails

**Error:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution:**
```bash
# Use legacy peer deps flag
npm install --legacy-peer-deps

# Or upgrade npm
npm install -g npm@latest

# Or use yarn
yarn install

# Or use pnpm
pnpm install
```

### Issue: Node version incompatible

**Error:**
```
The engine "node" is incompatible with this module.
```

**Solution:**
```bash
# Check Node version
node --version

# Should be v18+
# If not, install correct version

# Using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

### Issue: Expo CLI not found

**Error:**
```
expo: command not found
```

**Solution:**
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Or use npx
npx expo start

# Verify installation
expo --version
```

---

## Runtime Issues

### Issue: App crashes on startup

**Error:**
```
TypeError: Cannot read property 'x' of undefined
```

**Solution:**
1. Check console for full error
2. Check app/_layout.tsx for provider wrapping
3. Verify all context providers are present
4. Clear cache: `npm run dev -- --clear`
5. Restart Metro bundler

### Issue: Blank white screen

**Error:**
```
No error, just blank screen
```

**Solution:**
1. Check browser console (F12)
2. Check Metro terminal for errors
3. Verify home screen renders
4. Check for infinite loops
5. Restart app

### Issue: Navigation not working

**Error:**
```
Navigation error or screen doesn't load
```

**Solution:**
1. Verify route exists in app structure
2. Check route name spelling
3. Verify router.push() parameters
4. Check for circular navigation
5. Verify screen component exports

---

## Data Issues

### Issue: Tasks not saving

**Error:**
```
Tasks disappear after app restart
```

**Solution:**
1. Check AsyncStorage is initialized
2. Verify task context provider wrapping
3. Check for errors in console
4. Verify AsyncStorage permissions
5. Test with smaller dataset

### Issue: Data corruption

**Error:**
```
Tasks have invalid data or missing fields
```

**Solution:**
1. Clear app data: Settings → Data & Privacy → Clear All Data
2. Restore from backup if available
3. Verify data structure
4. Check for migration issues
5. Contact support

### Issue: Duplicate tasks

**Error:**
```
Same task appears multiple times
```

**Solution:**
1. Check task IDs are unique
2. Verify no duplicate saves
3. Clear cache
4. Restart app
5. Check for sync issues

---

## Performance Issues

### Issue: App is slow

**Error:**
```
App feels sluggish, slow scrolling
```

**Solution:**
1. Check Developer Options → Performance Monitor
2. Look for high memory usage
3. Check for unnecessary re-renders
4. Clear cache
5. Restart app
6. Reduce number of tasks

### Issue: High memory usage

**Error:**
```
App uses excessive memory
```

**Solution:**
1. Check Developer Options → Memory Monitor
2. Look for memory leaks
3. Clear old data
4. Restart app
5. Check for large images
6. Monitor background processes

### Issue: Stuttering/Frame drops

**Error:**
```
Animations are choppy, scrolling stutters
```

**Solution:**
1. Check FPS in Developer Options
2. Disable animations: Settings → Advanced → Reduce Animations
3. Clear cache
4. Close other apps
5. Restart app
6. Update app to latest version

---

## Sync Issues

### Issue: Data not syncing

**Error:**
```
Changes not appearing on other devices
```

**Solution:**
1. Check internet connection
2. Verify sync is enabled
3. Manual sync: Settings → Data & Privacy → Sync Now
4. Check for sync errors in logs
5. Restart app

### Issue: Sync conflicts

**Error:**
```
Conflicting changes from multiple devices
```

**Solution:**
1. Resolve conflicts manually
2. Keep local version or server version
3. Merge changes if possible
4. Restore from backup if needed
5. Contact support for complex conflicts

---

## Display Issues

### Issue: Text is too small

**Error:**
```
Can't read text on screen
```

**Solution:**
1. Settings → Appearance → Font Size
2. Increase font size slider
3. Use accessibility features
4. Zoom browser (web): Ctrl/Cmd + Plus

### Issue: Colors look wrong

**Error:**
```
Colors don't match theme
```

**Solution:**
1. Check current theme
2. Try different theme
3. Clear cache
4. Restart app
5. Check display settings

### Issue: Layout broken

**Error:**
```
Elements overlapping or misaligned
```

**Solution:**
1. Restart app
2. Check screen orientation
3. Clear cache
4. Try different device size
5. Report issue with screenshot

---

## Notification Issues

### Issue: Notifications not working

**Error:**
```
No notifications received
```

**Solution:**
1. Check Settings → Notifications → Enable Notifications
2. Check device notification settings
3. Check app permissions
4. Verify quiet hours not active
5. Restart app

### Issue: Too many notifications

**Error:**
```
Receiving too many notifications
```

**Solution:**
1. Settings → Notifications → Adjust frequency
2. Enable quiet hours
3. Disable unnecessary notifications
4. Adjust reminder settings
5. Check for duplicate reminders

---

## Getting Help

### Report Issues

**Report Bug:**
1. Go to Settings → Report Error
2. Describe the issue
3. Include steps to reproduce
4. Include device info
5. Submit report

**Email Support:**
- Email: supportramsandesh@gmail.com
- Response time: 24-48 hours
- Include app version
- Include device info
- Include error message

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
