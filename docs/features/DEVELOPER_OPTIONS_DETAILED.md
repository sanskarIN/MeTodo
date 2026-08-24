# MeTodo - Developer Options - Comprehensive Guide

## =============================================================================
## (c) Copyright Sanskar Yadav. All rights reserved.
## Made by Sanskar Yadav.
## =============================================================================

## FILE PURPOSE
This document provides comprehensive, in-depth documentation for the Developer Options feature of MeTodo. It covers all 30+ debugging and development tools available to developers and power users.

---

## Table of Contents

1. [Overview](#overview)
2. [Accessing Developer Options](#accessing-developer-options)
3. [Normal Developer Tools](#normal-developer-tools)
4. [Advanced Developer Tools](#advanced-developer-tools)
5. [Performance Tools](#performance-tools)
6. [Debugging Tools](#debugging-tools)
7. [Data Tools](#data-tools)
8. [Network Tools](#network-tools)
9. [Accessibility Tools](#accessibility-tools)
10. [Testing Tools](#testing-tools)
11. [Export and Logs](#export-and-logs)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### What are Developer Options?

Developer Options are advanced tools designed for developers, power users, and QA testers to debug, test, and optimize the MeTodo application.

**Key Features:**
- 30+ debugging tools
- Performance monitoring
- Network inspection
- Data management
- Accessibility testing
- Error simulation
- Log export
- System information

### Why Use Developer Options?

**Benefits:**
- **Debugging** - Find and fix issues
- **Performance** - Optimize app speed
- **Testing** - Test edge cases
- **Monitoring** - Track metrics
- **Development** - Speed up development
- **Optimization** - Improve user experience

### Accessing Developer Options

**Unlock Developer Options:**
1. Go to Settings - Bottom tab
2. Tap "About" - About section
3. Tap "App Version" - Repeatedly (10 times)
4. "Developer Options Unlocked" message appears
5. Developer Options now available

**Accessing Developer Options:**
1. Go to Settings - Bottom tab
2. Scroll to bottom
3. Tap "Developer Options"
4. All tools available

---

## Accessing Developer Options

### Unlock Process

**Step-by-Step Unlock:**
1. Open Settings
2. Find "About" section
3. Locate "App Version" (shows "MeTodo v1.0.0")
4. Tap version number
5. Counter appears (e.g., "3 taps to go")
6. Continue tapping
7. After 10 taps: "Developer Options Unlocked!"
8. Developer Options now visible in Settings

### Developer Options Menu

**Menu Structure:**
```
Settings
├── General
├── Notifications
├── Task Preferences
├── Avatar
├── Themes
├── About
└── Developer Options (After unlock)
    ├── Normal Tools
    ├── Advanced Tools
    ├── Performance
    ├── Debugging
    ├── Data
    ├── Network
    ├── Accessibility
    ├── Testing
    └── Export
```

### Disabling Developer Options

**Lock Developer Options:**
1. Go to Settings - Bottom tab
2. Tap "Developer Options"
3. Tap "Disable Developer Options"
4. Confirm action
5. Developer Options hidden
6. Must unlock again to access

---

## Normal Developer Tools

### 1. Show Layout Bounds

**Purpose:** Visualize component boundaries and layout structure

**How to Use:**
1. Go to Developer Options
2. Toggle "Show Layout Bounds" ON
3. Colored borders appear around all components
4. Each component has different color
5. Helps identify layout issues

**What It Shows:**
- Component boundaries (red borders)
- Text boundaries (blue borders)
- Touch targets (green borders)
- Padding and margins (yellow guides)

**Use Cases:**
- Debugging layout issues
- Checking alignment
- Verifying spacing
- Identifying overlaps

### 2. Toggle Performance Overlay

**Purpose:** Display real-time performance metrics

**How to Use:**
1. Go to Developer Options
2. Toggle "Performance Overlay" ON
3. Overlay appears in top-left corner
4. Shows FPS, memory, CPU
5. Updates in real-time

**Metrics Displayed:**
- FPS (Frames Per Second) - Target: 60 FPS
- Memory Usage - Current RAM usage
- CPU Usage - Processor usage
- Render Time - Time to render frame
- Frame Time - Total frame time

**Interpretation:**
- Green: Good performance (60 FPS)
- Yellow: Acceptable (45-60 FPS)
- Red: Poor performance (<45 FPS)

### 3. Clear Local Cache

**Purpose:** Remove cached data to free storage

**How to Use:**
1. Go to Developer Options
2. Tap "Clear Cache"
3. Confirmation dialog appears
4. Tap "Clear"
5. Cache cleared
6. App may restart

**What Gets Cleared:**
- Image cache
- Network cache
- Temporary files
- Session data
- Not user data

**Use Cases:**
- Free up storage space
- Fix caching issues
- Test fresh app state
- Resolve display issues

### 4. Export App Logs

**Purpose:** Export application logs for debugging

**How to Use:**
1. Go to Developer Options
2. Tap "Export Logs"
3. Logs collected
4. File created
5. Share or save logs

**Log Contents:**
- App startup logs
- Error messages
- Warning messages
- Performance data
- User actions
- Timestamps

**File Format:**
- Text file (.txt)
- Or JSON format (.json)
- Can be opened in text editor
- Shareable with developers

### 5. Force Dark Mode

**Purpose:** Force dark theme regardless of system setting

**How to Use:**
1. Go to Developer Options
2. Toggle "Force Dark Mode" ON
3. App switches to dark theme
4. Remains dark even if system is light
5. Useful for testing

**Use Cases:**
- Test dark theme appearance
- Check contrast and readability
- Verify dark mode functionality
- Test on light devices

### 6. Simulate Network Delay

**Purpose:** Simulate slow network for testing

**How to Use:**
1. Go to Developer Options
2. Tap "Network Delay"
3. Select delay amount:
   - 500ms
   - 1s
   - 2s
   - 5s
   - Custom
4. Network operations delayed
5. Useful for testing loading states

**Use Cases:**
- Test loading indicators
- Check timeout handling
- Verify error states
- Test user experience on slow networks

### 7. View Local Storage Stats

**Purpose:** View storage usage and statistics

**How to Use:**
1. Go to Developer Options
2. Tap "Storage Stats"
3. Detailed breakdown appears:
   - Total storage used
   - Tasks data size
   - Avatar data size
   - Theme data size
   - Cache size
   - Other data

**Information Displayed:**
- Storage breakdown by category
- Percentage of total storage
- Individual item sizes
- Largest items
- Recommendations

### 8. Toggle Animations

**Purpose:** Disable or enable all animations

**How to Use:**
1. Go to Developer Options
2. Toggle "Animations" ON/OFF
3. All animations enabled/disabled
4. Useful for testing without animations

**Use Cases:**
- Test functionality without animation delays
- Check logic without visual distractions
- Faster testing
- Verify non-animated behavior

### 9. Show Touch Targets

**Purpose:** Visualize touch-sensitive areas

**How to Use:**
1. Go to Developer Options
2. Toggle "Show Touch Targets" ON
3. All touchable areas highlighted
4. Shows minimum touch size (48x48 dp)
5. Helps verify accessibility

**What It Shows:**
- Button touch areas (green)
- Link touch areas (blue)
- Interactive element areas (yellow)
- Too-small targets (red warning)

**Use Cases:**
- Verify touch targets are large enough
- Check accessibility compliance
- Identify small targets
- Test on different devices

### 10. Display Frame Rate

**Purpose:** Show current frame rate (FPS)

**How to Use:**
1. Go to Developer Options
2. Toggle "Show FPS" ON
3. FPS counter appears
4. Updates every frame
5. Helps identify performance issues

**Interpretation:**
- 60 FPS: Smooth, optimal
- 45-60 FPS: Good
- 30-45 FPS: Acceptable
- <30 FPS: Poor, needs optimization

### 11. Memory Usage Monitor

**Purpose:** Monitor real-time memory usage

**How to Use:**
1. Go to Developer Options
2. Tap "Memory Monitor"
3. Memory usage graph appears
4. Shows usage over time
5. Identifies memory leaks

**Information:**
- Current memory usage
- Peak memory usage
- Memory trend
- Garbage collection events
- Memory warnings

### 12. Storage Usage Viewer

**Purpose:** Detailed view of storage usage

**How to Use:**
1. Go to Developer Options
2. Tap "Storage Viewer"
3. Detailed breakdown appears
4. Shows all stored data
5. Can delete individual items

**Breakdown:**
- Tasks: Number and size
- Avatars: Number and size
- Themes: Number and size
- Cache: Size and age
- Other: Miscellaneous data

### 13. Gesture Debugger

**Purpose:** Debug gesture recognition

**How to Use:**
1. Go to Developer Options
2. Toggle "Gesture Debugger" ON
3. Perform gestures
4. Gesture information logged
5. Shows gesture type, coordinates, velocity

**Logged Information:**
- Gesture type (tap, swipe, long-press, etc.)
- Start coordinates
- End coordinates
- Duration
- Velocity
- Direction

### 14. Font Size Adjuster

**Purpose:** Adjust font sizes for testing

**How to Use:**
1. Go to Developer Options
2. Tap "Font Size"
3. Slider appears
4. Adjust from 80% to 200%
5. All text resizes
6. Test readability at different sizes

**Use Cases:**
- Test accessibility with large fonts
- Verify text fits in containers
- Check readability
- Test with system font settings

### 15. Accessibility Inspector

**Purpose:** Inspect accessibility properties

**How to Use:**
1. Go to Developer Options
2. Toggle "Accessibility Inspector" ON
3. Tap any element
4. Accessibility properties displayed:
   - Label
   - Hint
   - Role
   - State
   - Value

**Information:**
- Accessibility labels
- Hints and descriptions
- Element roles
- Current state
- Semantic meaning

---

## Advanced Developer Tools

### 16. Database Query Inspector

**Purpose:** Inspect and run database queries

**How to Use:**
1. Go to Developer Options
2. Tap "Database Inspector"
3. Query interface appears
4. Write SQL query
5. Execute query
6. Results displayed

**Supported Queries:**
- SELECT - Query data
- INSERT - Add data
- UPDATE - Modify data
- DELETE - Remove data

**Use Cases:**
- Inspect data directly
- Test queries
- Verify data integrity
- Debug data issues

### 17. Memory Allocation Tracker

**Purpose:** Track memory allocations and deallocations

**How to Use:**
1. Go to Developer Options
2. Tap "Memory Tracker"
3. Tracking starts
4. Perform actions in app
5. View allocation report
6. Identify memory leaks

**Information:**
- Allocations by component
- Deallocations
- Memory leaks
- Allocation timeline
- Peak memory

### 18. UI Jank/Frame Drop Monitor

**Purpose:** Detect frame drops and UI jank

**How to Use:**
1. Go to Developer Options
2. Toggle "Jank Monitor" ON
3. App monitors frame drops
4. Jank events logged
5. Shows when and where jank occurs

**Information:**
- Frame drop events
- Duration of drops
- Frequency
- Affected components
- Severity

### 19. Custom API Endpoint Override

**Purpose:** Override API endpoints for testing

**How to Use:**
1. Go to Developer Options
2. Tap "API Endpoints"
3. List of endpoints appears
4. Tap endpoint to edit
5. Enter custom URL
6. API calls use custom endpoint

**Use Cases:**
- Test with staging server
- Test with local server
- Test with mock server
- Test error scenarios

### 20. Deep Link Tester

**Purpose:** Test deep linking functionality

**How to Use:**
1. Go to Developer Options
2. Tap "Deep Link Tester"
3. Enter deep link URL
4. Tap "Test"
5. App navigates to link
6. Verify navigation works

**Example Deep Links:**
- metodo://task/123
- metodo://avatar/create
- metodo://settings/themes

### 21. State Management Reset

**Purpose:** Reset app state to initial state

**How to Use:**
1. Go to Developer Options
2. Tap "Reset State"
3. Confirmation dialog appears
4. Tap "Reset"
5. All state reset to initial
6. App restarts

**What Gets Reset:**
- Current screen
- Navigation state
- User selections
- Temporary data
- Not user data (tasks, avatars, etc.)

### 22. Performance Profiler

**Purpose:** Profile app performance

**How to Use:**
1. Go to Developer Options
2. Tap "Start Profiling"
3. Perform actions
4. Tap "Stop Profiling"
5. Report generated
6. Shows performance metrics

**Metrics:**
- Render time
- Component render time
- Memory usage
- CPU usage
- Frame rate
- Bottlenecks

### 23. Network Throttler

**Purpose:** Simulate different network speeds

**How to Use:**
1. Go to Developer Options
2. Tap "Network Throttle"
3. Select speed:
   - 4G
   - 3G
   - 2G
   - Custom
4. Network throttled
5. Test on slow connections

**Speed Presets:**
- 4G: 4 Mbps
- 3G: 1 Mbps
- 2G: 100 Kbps
- Custom: Enter speed

### 24. Redux DevTools Integration

**Purpose:** Inspect Redux state (if using Redux)

**How to Use:**
1. Go to Developer Options
2. Tap "Redux DevTools"
3. DevTools interface appears
4. View state tree
5. Inspect actions
6. Time-travel debugging

**Features:**
- State inspection
- Action history
- Time-travel debugging
- State comparison
- Action filtering

### 25. Error Boundary Tester

**Purpose:** Test error boundary functionality

**How to Use:**
1. Go to Developer Options
2. Tap "Test Error Boundary"
3. Simulated error thrown
4. Error boundary catches error
5. Error UI displayed
6. Verify error handling

**Test Scenarios:**
- Component error
- Render error
- State error
- Navigation error

---

## Performance Tools

### 26. Performance Metrics Dashboard

**Purpose:** Comprehensive performance overview

**How to Use:**
1. Go to Developer Options
2. Tap "Performance Dashboard"
3. Dashboard appears with:
   - FPS graph
   - Memory graph
   - CPU graph
   - Network graph
   - Render time graph

**Metrics:**
- Real-time FPS
- Memory usage trend
- CPU usage trend
- Network activity
- Frame render times

### 27. Component Render Counter

**Purpose:** Count component renders

**How to Use:**
1. Go to Developer Options
2. Toggle "Render Counter" ON
3. Number appears on each component
4. Shows render count
5. Identifies over-rendering

**Use Cases:**
- Find unnecessary renders
- Optimize components
- Verify memoization
- Debug performance

### 28. Layout Shift Detector

**Purpose:** Detect cumulative layout shift

**How to Use:**
1. Go to Developer Options
2. Toggle "Layout Shift Detector" ON
3. Unexpected layout shifts highlighted
4. Shows shift amount
5. Helps improve stability

**Information:**
- Shift detection
- Shift amount
- Affected elements
- Shift timeline

---

## Debugging Tools

### 29. Debug Console

**Purpose:** View and filter console logs

**How to Use:**
1. Go to Developer Options
2. Tap "Debug Console"
3. Console appears
4. Shows all logs:
   - Info (blue)
   - Warning (yellow)
   - Error (red)
   - Debug (gray)

**Features:**
- Real-time logging
- Filter by level
- Search logs
- Clear logs
- Export logs

### 30. Error Simulator

**Purpose:** Simulate various error scenarios

**How to Use:**
1. Go to Developer Options
2. Tap "Error Simulator"
3. Select error type:
   - Network error
   - Timeout error
   - Validation error
   - Permission error
   - Storage error
4. Error simulated
5. Verify error handling

**Error Types:**
- Network errors
- Timeout errors
- Validation errors
- Permission errors
- Storage errors
- Crash simulation

---

## Data Tools

### 31. Data Export

**Purpose:** Export all app data

**How to Use:**
1. Go to Developer Options
2. Tap "Export Data"
3. Export format options:
   - JSON
   - CSV
   - XML
4. Select format
5. File created
6. Can be shared or backed up

**Exported Data:**
- All tasks
- All avatars
- All themes
- All settings
- Metadata

### 32. Data Import

**Purpose:** Import previously exported data

**How to Use:**
1. Go to Developer Options
2. Tap "Import Data"
3. Select data file
4. Import options appear
5. Merge or replace
6. Data imported

**Import Options:**
- Merge with existing
- Replace existing
- Selective import

---

## Network Tools

### 33. Network Activity Monitor

**Purpose:** Monitor all network requests

**How to Use:**
1. Go to Developer Options
2. Tap "Network Monitor"
3. Monitor appears
4. Shows all requests:
   - URL
   - Method (GET, POST, etc.)
   - Status code
   - Response time
   - Response size

**Information:**
- Request URL
- HTTP method
- Status code
- Response time
- Request/response headers
- Request/response body

---

## Accessibility Tools

### 34. Accessibility Checker

**Purpose:** Check accessibility compliance

**How to Use:**
1. Go to Developer Options
2. Tap "Accessibility Checker"
3. Checker runs
4. Issues reported:
   - Missing labels
   - Low contrast
   - Small touch targets
   - Missing hints

**Issues Detected:**
- Missing accessibility labels
- Low color contrast
- Small touch targets
- Missing alt text
- Keyboard navigation issues

---

## Testing Tools

### 35. Crash Reporter

**Purpose:** Report and analyze crashes

**How to Use:**
1. Go to Developer Options
2. Tap "Crash Reporter"
3. View crash history
4. Select crash to view details
5. Stack trace displayed
6. Can be exported

**Information:**
- Crash time
- Error message
- Stack trace
- Device info
- App state

---

## Export and Logs

### Exporting Developer Information

**Export All Developer Data:**
1. Go to Developer Options
2. Tap "Export All"
3. Comprehensive report created
4. Includes:
   - Logs
   - Performance data
   - Memory info
   - Network data
   - System info
5. File created
6. Can be shared with developers

**Export Formats:**
- Text file (.txt)
- JSON file (.json)
- HTML report (.html)
- PDF report (.pdf)

### Sharing Logs with Developers

**Share Debug Information:**
1. Export logs or data
2. Share via:
   - Email
   - File transfer
   - Cloud storage
   - Direct message
3. Include device info
4. Include reproduction steps
5. Include screenshots

---

## Troubleshooting

### Common Issues

#### Developer Options Not Unlocking

**Problem:** Cannot unlock developer options

**Solutions:**
1. Verify tapping version 10 times
2. Check for confirmation message
3. Try again slowly
4. Restart app
5. Check app version

#### Tools Not Working

**Problem:** Developer tools not functioning

**Solutions:**
1. Restart app
2. Disable and re-enable tool
3. Clear cache
4. Restart device
5. Update app

#### Performance Data Inaccurate

**Problem:** Performance metrics seem wrong

**Solutions:**
1. Close other apps
2. Restart performance tool
3. Verify device performance
4. Check for background processes
5. Restart device

#### Cannot Export Data

**Problem:** Export failing or stuck

**Solutions:**
1. Check device storage
2. Restart app
3. Try different format
4. Clear cache
5. Restart device

---

**Last Updated:** June 29, 2026  
**Version:** 1.0.0

Made with ❤️ by Sanskar Yadav
