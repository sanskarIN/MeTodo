# MeTodo Auto-Update System Guide

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Configuration](#configuration)
4. [Update Checking](#update-checking)
5. [Update Installation](#update-installation)
6. [Platform-Specific Details](#platform-specific-details)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)

## Overview

The MeTodo Auto-Update System provides automatic update checking, downloading, and installation across all platforms (Android, iOS, Windows, Linux, macOS). The system is designed to be non-intrusive, efficient, and user-friendly.

### Key Characteristics

- **Automatic**: Checks for updates on a configurable schedule
- **User-Controlled**: Users can configure update preferences
- **Network-Aware**: Respects WiFi/cellular preferences
- **Battery-Aware**: Respects minimum battery level requirements
- **Rollback-Capable**: Can rollback to previous versions if needed
- **History-Tracked**: Maintains detailed update history

## Features

### Core Features

1. **Scheduled Update Checking**
   - Configurable check interval (default: 24 hours)
   - Background checking without interrupting user
   - Respects user preferences for network type

2. **Update Notifications**
   - User-friendly notifications when updates available
   - Optional automatic installation
   - Detailed release notes display

3. **Update Installation**
   - Platform-specific installation mechanisms
   - Automatic restart handling
   - Progress tracking

4. **Rollback Support**
   - Revert to previous version if needed
   - Maintains update history
   - Safe rollback process

5. **Update History**
   - Tracks all update attempts
   - Records success/failure
   - Maintains detailed logs

### Advanced Features

1. **Release Channels**
   - Stable: Production-ready releases
   - Beta: Pre-release testing
   - Alpha: Early development versions

2. **Breaking Change Detection**
   - Warns users about breaking changes
   - Provides migration guides
   - Tracks deprecations

3. **Checksum Verification**
   - Verifies update integrity
   - Prevents corrupted downloads
   - Security validation

4. **Network Management**
   - WiFi-only updates option
   - Cellular data option
   - Bandwidth-aware downloading

## Configuration

### Default Configuration

```typescript
const defaultConfig: UpdateCheckConfig = {
  checkInterval: 86400000,        // 24 hours in milliseconds
  enableAutoCheck: true,          // Enable automatic checking
  notifyUser: true,               // Notify when updates available
  autoInstall: false,             // Don't auto-install
  releaseChannel: 'stable',       // Use stable releases
  checkOnWifi: true,              // Check on WiFi
  checkOnCellular: false,         // Don't check on cellular
  minBatteryPercent: 20,          // Minimum 20% battery
};
```

### Updating Configuration

```typescript
import { autoUpdateService } from '@/lib/auto-update-service';

// Initialize service
await autoUpdateService.initialize();

// Update configuration
await autoUpdateService.updateConfig({
  checkInterval: 3600000,         // Check every hour
  autoInstall: true,              // Auto-install updates
  releaseChannel: 'beta',         // Use beta releases
  minBatteryPercent: 50,          // Require 50% battery
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `checkInterval` | number | 86400000 | Milliseconds between update checks |
| `enableAutoCheck` | boolean | true | Enable automatic update checking |
| `notifyUser` | boolean | true | Notify user when updates available |
| `autoInstall` | boolean | false | Automatically install updates |
| `releaseChannel` | string | 'stable' | Release channel: stable, beta, alpha |
| `checkOnWifi` | boolean | true | Check for updates on WiFi |
| `checkOnCellular` | boolean | false | Check for updates on cellular data |
| `minBatteryPercent` | number | 20 | Minimum battery percentage for updates |

## Update Checking

### Automatic Checking

The service automatically checks for updates based on the configured interval:

```typescript
// Initialize and start automatic checking
await autoUpdateService.initialize();

// Service will now check for updates every 24 hours
// and notify user if updates are available
```

### Manual Checking

Check for updates on demand:

```typescript
const updateStatus = await autoUpdateService.checkForUpdates();

console.log('Update available:', updateStatus.isAvailable);
console.log('Current version:', updateStatus.currentVersion);
console.log('Latest version:', updateStatus.latestVersion);
console.log('Download progress:', updateStatus.downloadProgress);
```

### Update Status

The update status object contains:

```typescript
interface UpdateStatus {
  isAvailable: boolean;           // Update available
  currentVersion: string;         // Current app version
  latestVersion: string;          // Latest available version
  updateInfo?: UpdateInfo;        // Detailed update information
  downloadProgress: number;       // Download progress 0-100
  isDownloading: boolean;         // Currently downloading
  isInstalling: boolean;          // Currently installing
  lastCheckTime: number;          // Last check timestamp
  nextCheckTime: number;          // Next scheduled check
}
```

## Update Installation

### Automatic Installation

If configured, updates are installed automatically:

```typescript
await autoUpdateService.updateConfig({
  autoInstall: true,
});

// Updates will now be downloaded and installed automatically
```

### Manual Installation

Download and install updates manually:

```typescript
const updateStatus = await autoUpdateService.checkForUpdates();

if (updateStatus.isAvailable && updateStatus.updateInfo) {
  // Download update
  await autoUpdateService.downloadUpdate(updateStatus.updateInfo);
  
  // Install update
  await autoUpdateService.installUpdate(updateStatus.updateInfo);
}
```

### Installation Progress

Track installation progress:

```typescript
const status = autoUpdateService.getUpdateStatus();

console.log('Downloading:', status.isDownloading);
console.log('Progress:', status.downloadProgress + '%');
console.log('Installing:', status.isInstalling);
```

## Platform-Specific Details

### Android

**Update Mechanism**: Google Play Store or APK direct download

**Features**:
- Automatic updates through Play Store
- Direct APK installation for sideloading
- Staged rollout support
- Instant App support

**Configuration**:
```typescript
// Android-specific settings
const androidConfig = {
  releaseChannel: 'stable',
  autoInstall: true,
  minBatteryPercent: 20,
};
```

### iOS

**Update Mechanism**: App Store or TestFlight

**Features**:
- Automatic updates through App Store
- TestFlight beta testing
- Staged rollout support
- Over-the-air updates via CodePush

**Configuration**:
```typescript
// iOS-specific settings
const iosConfig = {
  releaseChannel: 'stable',
  autoInstall: false,  // iOS handles auto-install
  minBatteryPercent: 20,
};
```

### Windows

**Update Mechanism**: Direct download or Windows Store

**Features**:
- Direct .exe/.msi installation
- Windows Store updates
- Auto-update with electron-updater
- Staged rollout support

**Configuration**:
```typescript
// Windows-specific settings
const windowsConfig = {
  releaseChannel: 'stable',
  autoInstall: true,
  checkOnWifi: true,
  checkOnCellular: false,
  minBatteryPercent: 30,
};
```

### Linux

**Update Mechanism**: AppImage, Snap, Flatpak, or package managers

**Features**:
- AppImage auto-update
- Snap automatic updates
- Flatpak automatic updates
- Package manager integration

**Configuration**:
```typescript
// Linux-specific settings
const linuxConfig = {
  releaseChannel: 'stable',
  autoInstall: true,
  checkOnWifi: true,
  checkOnCellular: false,
};
```

### macOS

**Update Mechanism**: Direct download or Mac App Store

**Features**:
- Direct .dmg installation
- Mac App Store updates
- Notarization support
- Staged rollout support

**Configuration**:
```typescript
// macOS-specific settings
const macosConfig = {
  releaseChannel: 'stable',
  autoInstall: true,
  minBatteryPercent: 20,
};
```

## Troubleshooting

### Updates Not Checking

**Problem**: Auto-update checking not working

**Solutions**:
1. Verify `enableAutoCheck` is true
2. Check network connectivity
3. Verify minimum battery level
4. Check `checkOnWifi`/`checkOnCellular` settings
5. Review update history for errors

```typescript
const config = autoUpdateService.getConfig();
console.log('Auto-check enabled:', config.enableAutoCheck);

const history = await autoUpdateService.getUpdateHistory();
console.log('Recent updates:', history.slice(0, 5));
```

### Updates Not Installing

**Problem**: Downloaded updates not installing

**Solutions**:
1. Verify sufficient disk space
2. Check file permissions
3. Verify checksum integrity
4. Try manual installation
5. Check system requirements

```typescript
const status = autoUpdateService.getUpdateStatus();
console.log('Installation status:', status.isInstalling);
console.log('Download progress:', status.downloadProgress);
```

### Rollback Issues

**Problem**: Cannot rollback to previous version

**Solutions**:
1. Check update history
2. Verify previous version available
3. Check disk space
4. Try manual rollback
5. Contact support

```typescript
const history = await autoUpdateService.getUpdateHistory();
const previousInstalls = history.filter(h => h.type === 'installed');
console.log('Available versions:', previousInstalls);
```

### Network Issues

**Problem**: Update download failing

**Solutions**:
1. Check network connectivity
2. Verify WiFi/cellular settings
3. Try different network
4. Check firewall settings
5. Verify download URL accessibility

```typescript
const config = autoUpdateService.getConfig();
console.log('Check on WiFi:', config.checkOnWifi);
console.log('Check on cellular:', config.checkOnCellular);
```

## API Reference

### AutoUpdateService Class

#### Methods

**`async initialize(): Promise<void>`**
Initialize the auto-update service and load configuration.

**`startAutoCheck(): void`**
Start automatic update checking.

**`stopAutoCheck(): void`**
Stop automatic update checking.

**`async checkForUpdates(): Promise<UpdateStatus>`**
Check for available updates.

**`async downloadUpdate(updateInfo: UpdateInfo): Promise<void>`**
Download an update.

**`async installUpdate(updateInfo: UpdateInfo): Promise<void>`**
Install a downloaded update.

**`async rollbackToPreviousVersion(): Promise<void>`**
Rollback to the previous version.

**`getConfig(): UpdateCheckConfig`**
Get current configuration.

**`async updateConfig(newConfig: Partial<UpdateCheckConfig>): Promise<void>`**
Update configuration.

**`getUpdateStatus(): UpdateStatus`**
Get current update status.

**`async getUpdateHistory(): Promise<UpdateHistory[]>`**
Get update history.

**`async clearHistory(): Promise<void>`**
Clear update history.

**`cleanup(): void`**
Cleanup and stop auto-update service.

### Type Definitions

**UpdateCheckConfig**
```typescript
interface UpdateCheckConfig {
  checkInterval: number;
  enableAutoCheck: boolean;
  notifyUser: boolean;
  autoInstall: boolean;
  releaseChannel: 'stable' | 'beta' | 'alpha';
  checkOnWifi: boolean;
  checkOnCellular: boolean;
  minBatteryPercent: number;
}
```

**UpdateInfo**
```typescript
interface UpdateInfo {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  fileSize: number;
  checksum: string;
  releaseNotes: string;
  changelog: ChangelogEntry[];
  isBreakingChange: boolean;
  requiresRestart: boolean;
  platform: string;
}
```

**UpdateStatus**
```typescript
interface UpdateStatus {
  isAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  updateInfo?: UpdateInfo;
  downloadProgress: number;
  isDownloading: boolean;
  isInstalling: boolean;
  lastCheckTime: number;
  nextCheckTime: number;
}
```

**UpdateHistory**
```typescript
interface UpdateHistory {
  version: string;
  timestamp: number;
  type: 'installed' | 'failed' | 'skipped' | 'rolled_back';
  details: string;
}
```

## Best Practices

1. **Initialize on App Start**
   ```typescript
   useEffect(() => {
     autoUpdateService.initialize();
     return () => autoUpdateService.cleanup();
   }, []);
   ```

2. **Handle Update Notifications**
   ```typescript
   const status = autoUpdateService.getUpdateStatus();
   if (status.isAvailable) {
     showUpdateNotification(status.updateInfo);
   }
   ```

3. **Respect User Preferences**
   ```typescript
   // Allow users to configure auto-update
   const handleUpdatePreferences = async (prefs) => {
     await autoUpdateService.updateConfig(prefs);
   };
   ```

4. **Monitor Update History**
   ```typescript
   const history = await autoUpdateService.getUpdateHistory();
   logUpdateMetrics(history);
   ```

5. **Implement Rollback UI**
   ```typescript
   const handleRollback = async () => {
     try {
       await autoUpdateService.rollbackToPreviousVersion();
       showSuccessMessage('Rolled back successfully');
     } catch (error) {
       showErrorMessage('Rollback failed: ' + error.message);
     }
   };
   ```

## Support

For issues or questions about the auto-update system:

- **Documentation**: https://metodo.app/docs/auto-update
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **Email Support**: supportramsandesh@gmail.com
