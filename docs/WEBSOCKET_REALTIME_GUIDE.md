# MeTodo WebSocket Real-Time Updates Guide

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Connection Management](#connection-management)
4. [Message Types](#message-types)
5. [Room Subscriptions](#room-subscriptions)
6. [Client Implementation](#client-implementation)
7. [Server Implementation](#server-implementation)
8. [Performance Considerations](#performance-considerations)
9. [Troubleshooting](#troubleshooting)

## Overview

MeTodo uses WebSocket connections for real-time updates and live statistics streaming. This enables instant notifications when releases are available, installations complete, or statistics update.

### Key Features

- **Real-Time Notifications**: Instant update availability alerts
- **Live Statistics**: Stream statistics to connected clients
- **Room-Based Subscriptions**: Subscribe to specific platforms or releases
- **Automatic Reconnection**: Built-in reconnection logic
- **Message Queuing**: Queue messages when clients are offline
- **Heartbeat Monitoring**: Detect and clean up dead connections

### Benefits

- **Instant User Feedback**: No polling delays
- **Reduced Server Load**: Efficient bidirectional communication
- **Scalable Architecture**: Support thousands of concurrent connections
- **Low Latency**: Millisecond-level message delivery

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    WebSocket Server                         │
│                  (port 3001, Node.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Connection Manager                                  │   │
│  │  - Track active connections                          │   │
│  │  - Manage subscriptions                              │   │
│  │  - Handle authentication                             │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Message Router                                      │   │
│  │  - Route messages to rooms                           │   │
│  │  - Broadcast to all clients                          │   │
│  │  - Queue offline messages                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Heartbeat Monitor                                   │   │
│  │  - Ping clients every 25 seconds                     │   │
│  │  - Remove dead connections                           │   │
│  │  - Track connection health                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         ↑                                          ↑
         │ WebSocket                                │ HTTP Fallback
         │ (Preferred)                              │ (Polling)
         │                                          │
    ┌────┴────────────────────────────────────────┴────┐
    │         Client Applications                       │
    │  ┌──────────────────────────────────────────┐    │
    │  │  Android App                             │    │
    │  │  - Subscribe to updates-android          │    │
    │  │  - Receive release notifications         │    │
    │  │  - Stream installation status            │    │
    │  └──────────────────────────────────────────┘    │
    │  ┌──────────────────────────────────────────┐    │
    │  │  iOS App                                 │    │
    │  │  - Subscribe to updates-ios              │    │
    │  │  - Receive release notifications         │    │
    │  │  - Stream installation status            │    │
    │  └──────────────────────────────────────────┘    │
    │  ┌──────────────────────────────────────────┐    │
    │  │  Windows/Linux/macOS Clients             │    │
    │  │  - Subscribe to updates-windows, etc.    │    │
    │  │  - Receive release notifications         │    │
    │  │  - Stream installation status            │    │
    │  └──────────────────────────────────────────┘    │
    └────────────────────────────────────────────────────┘
```

## Connection Management

### Connection Lifecycle

1. **Initialization**: Client connects to WebSocket server
2. **Authentication**: Client sends authentication credentials
3. **Subscription**: Client subscribes to relevant rooms
4. **Active**: Client receives messages from subscribed rooms
5. **Heartbeat**: Server pings client every 25 seconds
6. **Disconnection**: Client disconnects or connection times out

### Connection States

```typescript
enum ConnectionState {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  AUTHENTICATED = 'authenticated',
  SUBSCRIBED = 'subscribed',
  DISCONNECTING = 'disconnecting',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}
```

## Message Types

### Release Available

Sent when a new release is available for a platform.

```json
{
  "type": "release-available",
  "data": {
    "version": "1.2.0",
    "platform": "android",
    "releaseDate": "2024-01-15T10:00:00Z",
    "releaseNotes": "New features and bug fixes",
    "downloadUrl": "https://...",
    "fileSize": 52428800,
    "isBreakingChange": false,
    "requiresRestart": true,
    "changelog": [
      {
        "type": "feature",
        "description": "Added team collaboration"
      }
    ]
  },
  "timestamp": 1705318800000
}
```

### Installation Status

Sent when installation status changes.

```json
{
  "type": "installation-status",
  "data": {
    "deviceId": "device-123",
    "releaseId": 5,
    "version": "1.2.0",
    "platform": "android",
    "status": "installed",
    "installTime": 45000,
    "timestamp": "2024-01-15T10:05:00Z"
  },
  "timestamp": 1705318800000
}
```

### Statistics Update

Sent with live statistics.

```json
{
  "type": "stats-update",
  "data": {
    "platform": "android",
    "releaseId": 5,
    "totalDownloads": 50000,
    "totalInstallations": 40000,
    "successRate": 0.95,
    "averageDownloadTime": 120000,
    "averageInstallTime": 45000,
    "timestamp": "2024-01-15T10:05:00Z"
  },
  "timestamp": 1705318800000
}
```

### Deployment Status

Sent during release deployment.

```json
{
  "type": "deployment-status",
  "data": {
    "releaseId": 5,
    "version": "1.2.0",
    "status": "deploying",
    "progress": 45,
    "platform": "android",
    "stagedRolloutPercent": 50,
    "timestamp": "2024-01-15T10:05:00Z"
  },
  "timestamp": 1705318800000
}
```

## Room Subscriptions

### Available Rooms

| Room | Purpose | Subscribers |
|------|---------|-------------|
| `updates-android` | Android updates | Android clients |
| `updates-ios` | iOS updates | iOS clients |
| `updates-windows` | Windows updates | Windows clients |
| `updates-linux` | Linux updates | Linux clients |
| `updates-macos` | macOS updates | macOS clients |
| `updates-web` | Web updates | Web clients |
| `updates-all` | All platform updates | Admin/monitoring |
| `stats-android` | Android statistics | Analytics clients |
| `stats-ios` | iOS statistics | Analytics clients |
| `stats-all` | All statistics | Admin/monitoring |
| `deployments` | Deployment status | Admin/monitoring |
| `device-{deviceId}` | Device-specific | Specific device |

### Subscribe to Room

```typescript
socket.emit('subscribe', { room: 'updates-android' });
```

### Unsubscribe from Room

```typescript
socket.emit('unsubscribe', { room: 'updates-android' });
```

## Client Implementation

### React Native Client

```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Platform } from 'react-native';

export function useUpdateNotifications() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    const newSocket = io('https://api.metodo.app', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Handle connection
    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);

      // Authenticate
      newSocket.emit('authenticate', {
        userId: 'user-123',
        platform: Platform.OS,
        version: '1.0.0',
      });

      // Subscribe to platform updates
      newSocket.emit('subscribe', {
        room: `updates-${Platform.OS}`,
      });
    });

    // Handle messages
    newSocket.on('message', (message) => {
      if (message.type === 'release-available') {
        setUpdates((prev) => [...prev, message.data]);
        showUpdateNotification(message.data);
      }
    });

    // Handle disconnection
    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    // Handle errors
    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected, updates };
}
```

### Web Client

```typescript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useUpdateNotifications() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const newSocket = io('https://api.metodo.app', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('authenticate', {
        userId: 'user-123',
        platform: 'web',
        version: '1.0.0',
      });
      newSocket.emit('subscribe', { room: 'updates-web' });
    });

    newSocket.on('message', (message) => {
      if (message.type === 'release-available') {
        setUpdates((prev) => [...prev, message.data]);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected, updates };
}
```

## Server Implementation

### Broadcasting Release

```typescript
import { wsService } from '@/server/_core/websocket';

async function publishRelease(releaseInfo) {
  // Broadcast to platform-specific room
  wsService.notifyReleaseAvailable(releaseInfo.platform, releaseInfo);

  // Broadcast to all clients
  wsService.broadcastToRoom('updates-all', {
    type: 'release-available',
    data: releaseInfo,
    timestamp: Date.now(),
  });
}
```

### Broadcasting Statistics

```typescript
async function updateStatistics(stats) {
  // Broadcast to platform-specific room
  wsService.notifyStatsUpdate(stats.platform, stats);

  // Broadcast to all clients
  wsService.broadcastToAll({
    type: 'stats-update',
    data: stats,
    timestamp: Date.now(),
  });
}
```

### Sending Device-Specific Message

```typescript
async function notifyDeviceInstallation(deviceId, status) {
  wsService.notifyInstallationStatus(deviceId, status);
}
```

## Performance Considerations

### Scalability

- **Connection Limit**: ~10,000 concurrent connections per server
- **Message Throughput**: ~100,000 messages/second
- **Memory Usage**: ~1-2 MB per connection

### Optimization Strategies

1. **Message Compression**: Compress large messages
2. **Room Batching**: Batch messages to rooms
3. **Connection Pooling**: Use connection pools
4. **Load Balancing**: Distribute connections across servers
5. **Message Queuing**: Queue messages during peak load

### Monitoring

```typescript
// Get server statistics
const stats = wsService.getStats();
console.log(`Connected clients: ${stats.connectedClients}`);
console.log(`Active rooms: ${stats.activeRooms}`);
console.log(`Message queue size: ${stats.messageQueueSize}`);
```

## Troubleshooting

### Connection Issues

**Problem**: Client cannot connect
- Check firewall rules
- Verify server is running on port 3001
- Check CORS configuration
- Verify WebSocket protocol support

**Solution**:
```typescript
const socket = io('https://api.metodo.app', {
  transports: ['websocket', 'polling'], // Fallback to polling
  reconnection: true,
  reconnectionDelay: 1000,
});
```

### Message Delivery

**Problem**: Messages not received
- Verify client is subscribed to correct room
- Check message type matches handler
- Verify server is broadcasting to correct room

**Solution**:
```typescript
// Verify subscription
socket.on('subscribed', (data) => {
  console.log(`Subscribed to room: ${data.room}`);
});

// Add message handler
socket.on('message', (message) => {
  console.log('Received message:', message);
});
```

### Performance Issues

**Problem**: High latency or message loss
- Reduce message size
- Batch messages
- Increase server resources
- Use load balancing

**Solution**:
```typescript
// Compress messages
const compressedMessage = zlib.gzipSync(JSON.stringify(message));

// Batch messages
const batchedMessages = messages.slice(0, 100);
wsService.broadcastToRoom(room, batchedMessages);
```

## Support

For WebSocket-related issues:

- **Email**: supportramsandesh@gmail.com
- **Documentation**: https://metodo.app/docs/websocket
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
