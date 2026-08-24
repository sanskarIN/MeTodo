# MeTodo - Debugging & Troubleshooting Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This comprehensive guide explains debugging techniques, common issues, and troubleshooting strategies for MeTodo development.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Debugging Tools](#debugging-tools)
3. [Common Issues](#common-issues)
4. [Error Messages](#error-messages)
5. [Performance Debugging](#performance-debugging)
6. [Memory Debugging](#memory-debugging)
7. [Network Debugging](#network-debugging)
8. [Troubleshooting Workflow](#troubleshooting-workflow)

---

## Introduction

### Debugging Approach

**Systematic Debugging:**
1. Understand the problem
2. Reproduce the issue
3. Isolate the cause
4. Implement fix
5. Verify solution
6. Document learning

### Debugging Tools

- Chrome DevTools
- React DevTools
- React Native Debugger
- Flipper
- Console logging
- Breakpoints

---

## Debugging Tools

### Chrome DevTools

**Access DevTools:**
```bash
# Web preview
Press F12 or Cmd+Option+I

# Or right-click → Inspect
```

**Console Tab:**
```javascript
// Log messages
console.log('Message');

// Log with levels
console.warn('Warning');
console.error('Error');

// Log objects
console.table(tasks);

// Conditional logging
console.assert(condition, 'Assertion failed');
```

**Network Tab:**
- Monitor API requests
- Check response times
- Verify payloads
- Check status codes

**Performance Tab:**
- Record performance
- Analyze bottlenecks
- Check frame rate
- Monitor memory

### React DevTools

**Installation:**
```bash
# Chrome extension
# Firefox extension
# Standalone app
```

**Profiler:**
1. Open React DevTools
2. Go to Profiler tab
3. Record interaction
4. Analyze render times
5. Identify slow components

**Component Inspector:**
- Inspect component props
- Check component state
- View component tree
- Track re-renders

### React Native Debugger

**Installation:**
```bash
# macOS
brew install react-native-debugger

# Or download from GitHub
```

**Usage:**
```bash
# Connect debugger
# Metro will connect automatically

# Or manually
# Press 'd' in Metro terminal
```

---

## Common Issues

### App Won't Start

**Issue: Metro Bundler Error**
```
Error: Unable to resolve module
```

**Solution:**
```bash
# Clear cache
npm run dev -- --clear

# Or manually
rm -rf node_modules/.cache

# Restart Metro
npm run dev
```

### Blank Screen

**Issue: App Shows Blank Screen**

**Solution:**
```bash
# Check console for errors
# Press Cmd+Option+I in web preview

# Check Metro terminal for errors

# Restart app
# Stop Metro (Ctrl+C)
# Start again (npm run dev)
```

### Styling Issues

**Issue: Styles Not Applying**

**Solution:**
```typescript
// Check className syntax
<View className="p-4 bg-primary">
  {/* Correct */}
</View>

// Check Tailwind config
// Verify theme.config.js

// Restart Metro
npm run dev -- --clear
```

### Navigation Issues

**Issue: Screen Not Navigating**

**Solution:**
```typescript
// Check route name
router.push('/task-detail');

// Check route exists
// Verify app/(tabs)/_layout.tsx

// Check params
router.push({
  pathname: '/task-detail',
  params: { id: '123' }
});
```

---

## Error Messages

### Common Errors

**"Cannot find module"**
```
Error: Cannot find module '@/components/TaskCard'

Solution:
- Check file path
- Verify file exists
- Check tsconfig.json paths
- Restart Metro
```

**"Type is not assignable"**
```
Error: Type 'string' is not assignable to type 'Task'

Solution:
- Check type definition
- Verify data structure
- Use type assertion if needed
- Check data transformation
```

**"useContext must be used within Provider"**
```
Error: useTheme must be used within ThemeProvider

Solution:
- Check provider wrapping
- Verify app/_layout.tsx
- Check provider order
- Verify hook usage
```

**"Cannot read property of undefined"**
```
Error: Cannot read property 'title' of undefined

Solution:
- Add null checks
- Use optional chaining (?.)
- Check data loading
- Verify data structure
```

---

## Performance Debugging

### Slow Rendering

**Identify Slow Components:**
```typescript
// Use React DevTools Profiler
// Record interaction
// Check render times
// Look for components > 16ms
```

**Optimize:**
```typescript
// Memoize component
export const TaskCard = memo(TaskCard);

// Memoize callback
const handlePress = useCallback(() => {}, []);

// Memoize value
const value = useMemo(() => ({}), []);
```

### Frame Drops

**Monitor Frame Rate:**
```typescript
// Enable Performance Overlay
// Developer Options → Performance Overlay

// Check for:
// - Dropped frames
// - Long tasks
// - Blocking operations
```

**Fix Frame Drops:**
```typescript
// Use requestAnimationFrame
requestAnimationFrame(() => {
  // Perform animation
});

// Use InteractionManager
InteractionManager.runAfterInteractions(() => {
  // Heavy computation
});
```

---

## Memory Debugging

### Memory Leaks

**Detect Memory Leaks:**
```typescript
// Chrome DevTools → Memory
// Take heap snapshot
// Compare snapshots
// Look for retained objects
```

**Common Causes:**
- Uncleared intervals
- Unremoved event listeners
- Unsubscribed observables
- Circular references

**Fix Memory Leaks:**
```typescript
// Always cleanup effects
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => clearInterval(timer);
}, []);

// Remove event listeners
useEffect(() => {
  const handler = () => {};
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
```

---

## Network Debugging

### API Issues

**Monitor Network Requests:**
```typescript
// Chrome DevTools → Network tab
// Check requests
// Verify responses
// Check status codes
```

**Debug API Calls:**
```typescript
// Add logging
async function fetchTasks() {
  console.log('Fetching tasks...');
  try {
    const response = await fetch('/api/tasks');
    console.log('Response:', response);
    const data = await response.json();
    console.log('Data:', data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

**Test API Endpoints:**
```bash
# Using curl
curl http://localhost:3000/api/tasks

# Using Postman
# Import API collection
# Test endpoints

# Using fetch in console
fetch('/api/tasks')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## Troubleshooting Workflow

### Step-by-Step Process

**Step 1: Understand Problem**
- What is happening?
- What should happen?
- When does it occur?
- How to reproduce?

**Step 2: Gather Information**
- Check console for errors
- Check Metro terminal
- Check network requests
- Check component state

**Step 3: Isolate Issue**
- Narrow down location
- Identify component/function
- Check recent changes
- Review related code

**Step 4: Test Hypothesis**
- Make minimal change
- Test fix
- Verify behavior
- Check for side effects

**Step 5: Implement Fix**
- Apply solution
- Test thoroughly
- Check edge cases
- Document fix

**Step 6: Verify Solution**
- Reproduce original issue
- Confirm fix works
- Test related features
- Monitor for regressions

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav

---

**Need help? Email us at supportramsandesh@gmail.com**
