# MeTodo Update Server API Documentation

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Request/Response Formats](#requestresponse-formats)
4. [Authentication](#authentication)
5. [Error Handling](#error-handling)
6. [Examples](#examples)
7. [Integration Guide](#integration-guide)

## Overview

The MeTodo Update Server API provides endpoints for checking updates, downloading releases, tracking installations, and managing release information. All endpoints are accessible via TRPC (TypeScript RPC) and return JSON responses.

### Base URL

```
https://api.metodo.app/trpc/updates
```

### API Version

Current version: 1.0.0

## API Endpoints

### 1. Check for Updates

**Endpoint**: `updates.check`

**Method**: Query (GET)

**Purpose**: Check if a new version is available for the user's platform and configuration.

**Request Parameters**:

```typescript
{
  currentVersion: string;      // Current app version (e.g., "1.0.0")
  platform: string;             // Platform: "android" | "ios" | "windows" | "linux" | "macos" | "web"
  releaseChannel?: string;      // Release channel: "stable" | "beta" | "alpha" (default: "stable")
  osVersion?: string;           // OS version (e.g., "14.5")
  deviceId?: string;            // Unique device identifier
  locale?: string;              // User locale (e.g., "en-US")
}
```

**Response**:

```typescript
{
  isAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseInfo?: {
    version: string;
    releaseDate: string;
    downloadUrl: string;
    fileSize: number;
    checksum: string;
    releaseNotes: string;
    changelog: Array<{
      type: "feature" | "bugfix" | "improvement" | "breaking" | "security";
      description: string;
    }>;
    isBreakingChange: boolean;
    requiresRestart: boolean;
    platform: string;
  };
  message?: string;
  error?: string;
}
```

**Example**:

```bash
curl -X GET "https://api.metodo.app/trpc/updates.check?input={\"currentVersion\":\"1.0.0\",\"platform\":\"android\",\"releaseChannel\":\"stable\"}"
```

### 2. Get Latest Release

**Endpoint**: `updates.getLatest`

**Method**: Query (GET)

**Purpose**: Get information about the latest release for a specific platform and channel.

**Request Parameters**:

```typescript
{
  platform: string;             // Platform: "android" | "ios" | "windows" | "linux" | "macos" | "web"
  releaseChannel?: string;      // Release channel: "stable" | "beta" | "alpha" (default: "stable")
}
```

**Response**:

```typescript
{
  version: string;
  releaseDate: string;
  downloadUrl: string;
  fileSize: number;
  checksum: string;
  releaseNotes: string;
  changelog: Array<{...}>;
  isBreakingChange: boolean;
  requiresRestart: boolean;
  platform: string;
  error?: string;
}
```

### 3. Get Version History

**Endpoint**: `updates.getHistory`

**Method**: Query (GET)

**Purpose**: Get a paginated list of all releases for a platform.

**Request Parameters**:

```typescript
{
  platform: string;             // Platform identifier
  limit?: number;               // Number of results (default: 10, max: 100)
  offset?: number;              // Pagination offset (default: 0)
}
```

**Response**:

```typescript
{
  history: Array<{
    version: string;
    releaseDate: string;
    releaseNotes: string;
    changelog: Array<{...}>;
    isBreakingChange: boolean;
  }>;
  total: number;
  limit: number;
  offset: number;
  error?: string;
}
```

### 4. Track Download

**Endpoint**: `updates.trackDownload`

**Method**: Mutation (POST)

**Purpose**: Record that a user has downloaded an update.

**Request Parameters**:

```typescript
{
  version: string;              // Downloaded version
  platform: string;             // Platform identifier
  downloadTime: number;         // Download duration in milliseconds
  fileSize: number;             // File size in bytes
  deviceId?: string;            // Device identifier
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### 5. Track Installation

**Endpoint**: `updates.trackInstallation`

**Method**: Mutation (POST)

**Purpose**: Record that a user has installed an update.

**Request Parameters**:

```typescript
{
  version: string;              // Installed version
  platform: string;             // Platform identifier
  installTime: number;          // Installation duration in milliseconds
  status: string;               // Status: "available" | "installed" | "failed" | "skipped" | "rolled_back"
  deviceId?: string;            // Device identifier
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### 6. Submit Feedback

**Endpoint**: `updates.submitFeedback`

**Method**: Mutation (POST)

**Purpose**: Submit user feedback about an update.

**Request Parameters**:

```typescript
{
  version: string;              // Version being reviewed
  platform: string;             // Platform identifier
  status: string;               // Update status
  feedback?: string;            // User feedback text
  errorMessage?: string;        // Error message if installation failed
  installTime?: number;         // Installation duration in milliseconds
  downloadTime?: number;        // Download duration in milliseconds
  fileSize?: number;            // File size in bytes
  rating?: number;              // Rating 1-5
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### 7. Get Statistics

**Endpoint**: `updates.getStats`

**Method**: Query (GET)

**Purpose**: Get update statistics and adoption metrics.

**Request Parameters**:

```typescript
{
  platform?: string;            // Optional platform filter
  startDate?: string;           // Optional start date (ISO 8601)
  endDate?: string;             // Optional end date (ISO 8601)
}
```

**Response**:

```typescript
{
  totalDownloads: number;
  totalInstallations: number;
  successRate: number;          // 0-1
  averageDownloadTime: number;  // milliseconds
  averageInstallTime: number;   // milliseconds
  platformStats: {
    [platform]: {
      downloads: number;
      installations: number;
      successRate: number;
    }
  };
  versionStats: {
    [version]: {
      downloads: number;
      installations: number;
    }
  };
  error?: string;
}
```

### 8. Request Rollback

**Endpoint**: `updates.requestRollback`

**Method**: Mutation (POST)

**Purpose**: Request to rollback to a previous version.

**Request Parameters**:

```typescript
{
  currentVersion: string;       // Current version
  targetVersion: string;        // Version to rollback to
  platform: string;             // Platform identifier
  reason?: string;              // Reason for rollback
  deviceId?: string;            // Device identifier
}
```

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  releaseInfo?: {
    version: string;
    downloadUrl: string;
    fileSize: number;
    checksum: string;
    releaseNotes: string;
  };
  error?: string;
}
```

### 9. Get Compatibility

**Endpoint**: `updates.getCompatibility`

**Method**: Query (GET)

**Purpose**: Check if a version is compatible with the user's device.

**Request Parameters**:

```typescript
{
  version: string;              // Version to check
  platform: string;             // Platform identifier
  osVersion?: string;           // OS version
  deviceMemory?: number;        // Device memory in MB
  deviceStorage?: number;       // Available storage in MB
}
```

**Response**:

```typescript
{
  compatible: boolean;
  issues: string[];             // Compatibility issues
  requirements: {
    minOSVersion?: string;
    minMemory?: number;
    minStorage?: number;
  };
  error?: string;
}
```

### 10. Get Release Notes

**Endpoint**: `updates.getReleaseNotes`

**Method**: Query (GET)

**Purpose**: Get detailed release notes for a specific version.

**Request Parameters**:

```typescript
{
  version: string;              // Version identifier
}
```

**Response**:

```typescript
{
  version: string;
  releaseDate: string;
  releaseNotes: string;
  changelog: Array<{...}>;
  isBreakingChange: boolean;
  requiresRestart: boolean;
  error?: string;
}
```

## Request/Response Formats

### TRPC Query Format

```bash
GET /trpc/updates.check?input=<URL_ENCODED_JSON>
```

### TRPC Mutation Format

```bash
POST /trpc/updates.submitFeedback
Content-Type: application/json

{
  "json": {
    "version": "1.0.0",
    "platform": "android",
    "status": "installed",
    "rating": 5
  }
}
```

### Response Format

All responses follow the TRPC format:

```json
{
  "result": {
    "data": {
      // Response data
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Error description"
  }
}
```

## Authentication

The Update Server API is public and does not require authentication. However, sensitive operations may be rate-limited per IP address.

### Rate Limiting

- **Check Updates**: 100 requests per minute
- **Track Download/Install**: 1000 requests per minute
- **Submit Feedback**: 100 requests per minute
- **Get Statistics**: 10 requests per minute

## Error Handling

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid parameters |
| 404 | Not Found | Version or resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Example

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Version 2.0.0 not found"
  }
}
```

## Examples

### Check for Updates (JavaScript/TypeScript)

```typescript
import { trpc } from '@/lib/trpc';

const checkForUpdates = async () => {
  try {
    const result = await trpc.updates.check.query({
      currentVersion: '1.0.0',
      platform: 'android',
      releaseChannel: 'stable',
    });

    if (result.isAvailable) {
      console.log(`Update available: ${result.latestVersion}`);
      console.log(result.releaseInfo);
    } else {
      console.log('No updates available');
    }
  } catch (error) {
    console.error('Failed to check for updates:', error);
  }
};
```

### Submit Feedback

```typescript
const submitUpdateFeedback = async () => {
  try {
    const result = await trpc.updates.submitFeedback.mutate({
      version: '1.1.0',
      platform: 'android',
      status: 'installed',
      rating: 5,
      feedback: 'Great new features!',
      installTime: 45000,
    });

    console.log('Feedback submitted:', result);
  } catch (error) {
    console.error('Failed to submit feedback:', error);
  }
};
```

### Get Statistics

```typescript
const getUpdateStats = async () => {
  try {
    const stats = await trpc.updates.getStats.query({
      platform: 'android',
    });

    console.log(`Total downloads: ${stats.totalDownloads}`);
    console.log(`Success rate: ${(stats.successRate * 100).toFixed(2)}%`);
  } catch (error) {
    console.error('Failed to get statistics:', error);
  }
};
```

## Integration Guide

### Step 1: Initialize TRPC Client

```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers';

export const trpc = createTRPCReact<AppRouter>();
```

### Step 2: Check for Updates

```typescript
useEffect(() => {
  const checkUpdates = async () => {
    const result = await trpc.updates.check.query({
      currentVersion: APP_VERSION,
      platform: Platform.OS,
      releaseChannel: 'stable',
    });

    if (result.isAvailable) {
      showUpdateDialog(result.releaseInfo);
    }
  };

  checkUpdates();
}, []);
```

### Step 3: Track Download

```typescript
const downloadUpdate = async (releaseInfo) => {
  const startTime = Date.now();

  try {
    // Download update...
    const downloadTime = Date.now() - startTime;

    await trpc.updates.trackDownload.mutate({
      version: releaseInfo.version,
      platform: Platform.OS,
      downloadTime,
      fileSize: releaseInfo.fileSize,
    });
  } catch (error) {
    console.error('Download failed:', error);
  }
};
```

### Step 4: Track Installation

```typescript
const installUpdate = async (releaseInfo) => {
  const startTime = Date.now();

  try {
    // Install update...
    const installTime = Date.now() - startTime;

    await trpc.updates.trackInstallation.mutate({
      version: releaseInfo.version,
      platform: Platform.OS,
      installTime,
      status: 'installed',
    });
  } catch (error) {
    console.error('Installation failed:', error);
  }
};
```

## Support

For API support or issues:

- **Email**: supportramsandesh@gmail.com
- **Documentation**: https://metodo.app/docs/api
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
