# Developer Options Guide

## Overview

Developer Options provides 30+ advanced tools for debugging, optimizing, and testing MeTodo. Access these tools by tapping the app version in Settings 10 times.

## Unlocking Developer Options

1. Navigate to **Settings** tab
2. Scroll to **App Version** section
3. Tap the version display 10 times
4. Developer Options screen unlocks
5. Tap to access the Developer Options screen

## Normal Developer Tools

### Layout & Display Tools

#### Show Layout Bounds
- Visualizes component boundaries
- Helps identify layout issues
- Shows spacing and alignment
- Useful for UI debugging

#### Show Touch Targets
- Displays interactive element boundaries
- Ensures minimum 44x44pt touch targets
- Identifies accessibility issues
- Highlights clickable areas

#### Performance Overlay
- Real-time performance metrics
- Shows rendering performance
- Displays frame drops
- Monitors app responsiveness

### Performance Monitoring

#### Frame Rate Monitor
- Displays current FPS
- Tracks frame consistency
- Identifies jank
- Shows performance dips

#### Memory Monitor
- Tracks memory usage
- Shows memory peaks
- Identifies memory leaks
- Displays heap size

#### Jank Monitor
- Detects UI frame drops
- Measures jank duration
- Tracks jank frequency
- Identifies performance bottlenecks

### Debugging Tools

#### Debug Console
- View console logs
- Monitor warnings and errors
- Track app events
- Debug state changes

#### Network Activity Monitor
- View network requests
- Monitor request/response times
- Track data transfer
- Identify network issues

#### Device Info Display
- Show device specifications
- Display OS version
- Show app version
- Display device capabilities

### Customization Tools

#### Force Dark Mode
- Toggle dark mode on/off
- Test dark mode appearance
- Verify contrast ratios
- Check color schemes

#### Animation Speed
- Adjust animation duration
- Slow down animations for testing
- Speed up for efficiency
- Test animation performance

### Accessibility Tools

#### Color Contrast Checker
- Verify WCAG compliance
- Check text contrast ratios
- Identify accessibility issues
- Suggest improvements

#### Accessibility Inspector
- Analyze accessibility tree
- Check semantic structure
- Verify labels and hints
- Test screen reader support

### Storage & Cache

#### Storage Stats Viewer
- Display storage usage
- Show cache size
- Monitor data storage
- Identify storage issues

#### Clear Cache
- Remove cached data
- Free up storage space
- Reset app state
- Start fresh

## Advanced Developer Tools

### Database Tools

#### Database Query Inspector
- View database structure
- Run custom queries
- Inspect data
- Test database operations

### Performance Analysis

#### Memory Allocation Tracker
- Track memory allocation
- Monitor memory patterns
- Identify leaks
- Analyze memory usage

#### Performance Profiler
- Profile app performance
- Measure function execution time
- Identify bottlenecks
- Optimize code

#### UI Jank/Frame Drop Monitor
- Detailed jank analysis
- Frame-by-frame debugging
- Performance metrics
- Optimization suggestions

### Network Testing

#### Network Throttler
- Simulate slow networks
- Test 3G/4G conditions
- Verify offline handling
- Check timeout behavior

#### API Endpoint Override
- Change API endpoints
- Test against staging servers
- Debug API issues
- Test error handling

### State Management

#### State Management Reset
- Reset app state
- Clear all data
- Return to initial state
- Test state initialization

#### Redux DevTools Integration
- Connect to Redux DevTools
- Time-travel debugging
- Action history
- State inspection

### Testing Tools

#### Deep Link Tester
- Test deep link handling
- Verify URL schemes
- Test navigation
- Debug routing

#### Error Boundary Tester
- Trigger error boundaries
- Test error handling
- Verify error recovery
- Debug error states

## Utility Actions

### Export Logs
- Export debug logs to file
- Share logs for debugging
- Archive logs
- Analyze log history

### View Device Info
- Display device specifications
- Show OS version
- Display app version
- Show device capabilities

## Best Practices

### Using Developer Tools

1. **Enable One Tool at a Time** - Avoid overwhelming output
2. **Monitor Performance** - Use performance tools regularly
3. **Test Accessibility** - Check contrast and touch targets
4. **Debug Systematically** - Use tools to isolate issues
5. **Document Findings** - Note issues for fixing

### Performance Optimization

1. **Monitor Frame Rate** - Aim for consistent 60 FPS
2. **Track Memory** - Watch for memory leaks
3. **Analyze Jank** - Identify and fix frame drops
4. **Profile Code** - Find performance bottlenecks
5. **Test Networks** - Verify offline functionality

### Debugging Workflow

1. **Enable Debug Console** - Monitor logs
2. **Use Layout Bounds** - Check layout issues
3. **Monitor Performance** - Track metrics
4. **Inspect Network** - Check requests
5. **Export Logs** - Save for analysis

## Troubleshooting

### Developer Options Not Unlocking

- Ensure you've tapped 10 times
- Tap on the version number specifically
- Try tapping faster or slower
- Restart the app
- Check Settings > App Version

### Tools Not Working

- Ensure tool is toggled ON
- Restart the app
- Clear cache
- Check device permissions
- Verify app storage

### Performance Issues While Debugging

- Disable unnecessary tools
- Clear cache
- Restart the app
- Close other apps
- Restart device

## Advanced Debugging

### Analyzing Performance Data

1. Enable Frame Rate Monitor
2. Perform actions in app
3. Note FPS drops
4. Identify problematic screens
5. Optimize identified areas

### Memory Leak Detection

1. Enable Memory Monitor
2. Perform repeated actions
3. Monitor memory growth
4. Check for leaks
5. Investigate suspicious patterns

### Network Debugging

1. Enable Network Activity Monitor
2. Perform network operations
3. Monitor request/response times
4. Check for failures
5. Optimize slow requests

## Developer Tips

### Testing Offline Functionality

1. Enable Network Throttler
2. Set to Offline mode
3. Test app features
4. Verify offline behavior
5. Check data persistence

### Testing Error Handling

1. Enable Error Boundary Tester
2. Trigger errors intentionally
3. Verify error recovery
4. Check error messages
5. Test user guidance

### Accessibility Testing

1. Enable Accessibility Inspector
2. Enable Color Contrast Checker
3. Navigate through app
4. Check all interactive elements
5. Verify screen reader support

## Future Developer Tools

Planned additions include:
- Advanced profiling tools
- Network simulation
- Device emulation
- Automated testing
- Performance benchmarks
- Analytics dashboard

---

**Important:** Developer Options are for testing and debugging only. Disable all tools before regular use for optimal performance.
