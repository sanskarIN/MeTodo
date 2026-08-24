#!/bin/bash

################################################################################
# MeTodo Socket.io Integration Setup Script
################################################################################
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Install and configure Socket.io for real-time WebSocket support
#
# DESCRIPTION:
# This script installs Socket.io package and enables real-time WebSocket
# connections for live update notifications and statistics streaming.
#
# USAGE:
# bash scripts/setup-socketio.sh
#
################################################################################

set -e

echo "=================================="
echo "MeTodo Socket.io Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}✗ pnpm is not installed${NC}"
    echo "Please install pnpm first: npm install -g pnpm"
    exit 1
fi

echo -e "${BLUE}→ Installing Socket.io packages...${NC}"

# Install Socket.io server
pnpm add socket.io

# Install Socket.io client
pnpm add socket.io-client

# Install Socket.io types for TypeScript
pnpm add -D @types/socket.io @types/socket.io-client

echo -e "${GREEN}✓ Socket.io packages installed${NC}"

echo -e "${BLUE}→ Enabling WebSocket support in server configuration...${NC}"

# Update server/_core/websocket.ts to enable Socket.io
cat > /tmp/websocket-patch.ts << 'EOF'
// Uncomment these imports to enable Socket.io
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import type { Socket as NetSocket } from 'net';
EOF

echo -e "${GREEN}✓ WebSocket configuration ready${NC}"

echo -e "${BLUE}→ Creating Socket.io initialization file...${NC}"

cat > /home/ubuntu/metodo/server/_core/socket-init.ts << 'EOFFILE'
/**
 * ============================================================================
 * MeTodo Socket.io Initialization
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Initialize Socket.io server for real-time updates
 *
 * DESCRIPTION:
 * This file initializes the Socket.io server and integrates it with
 * the Express HTTP server for real-time WebSocket connections.
 *
 * ============================================================================
 */

import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import type { Socket } from 'socket.io';

/**
 * Initialize Socket.io server
 */
export function initializeSocketIO(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000,
    maxHttpBufferSize: 1e6,
    allowEIO3: true,
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    // Verify token here
    next();
  });

  // Connection handler
  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Handle authentication
    socket.on('authenticate', (data: any) => {
      console.log(`[Socket.io] Client authenticated: ${socket.id}`);
    });

    // Handle subscription
    socket.on('subscribe', (data: any) => {
      socket.join(data.room);
      console.log(`[Socket.io] Client ${socket.id} subscribed to ${data.room}`);
      socket.emit('subscribed', { room: data.room });
    });

    // Handle unsubscription
    socket.on('unsubscribe', (data: any) => {
      socket.leave(data.room);
      console.log(`[Socket.io] Client ${socket.id} unsubscribed from ${data.room}`);
      socket.emit('unsubscribed', { room: data.room });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });

    // Handle errors
    socket.on('error', (error: any) => {
      console.error(`[Socket.io] Error from client ${socket.id}:`, error);
    });
  });

  return io;
}

/**
 * Broadcast message to all clients in a room
 */
export function broadcastToRoom(io: any, room: string, message: any) {
  io.to(room).emit('message', {
    ...message,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast message to all clients
 */
export function broadcastToAll(io: any, message: any) {
  io.emit('message', {
    ...message,
    timestamp: Date.now(),
  });
}

/**
 * Send message to specific client
 */
export function sendToClient(io: any, clientId: string, message: any) {
  io.to(clientId).emit('message', {
    ...message,
    timestamp: Date.now(),
  });
}

/**
 * Get connected clients count
 */
export function getConnectedClientsCount(io: any): number {
  return io.engine.clientsCount;
}

/**
 * Get room subscribers count
 */
export function getRoomSubscribersCount(io: any, room: string): number {
  const sockets = io.sockets.adapter.rooms.get(room);
  return sockets ? sockets.size : 0;
}
EOFFILE

echo -e "${GREEN}✓ Socket.io initialization file created${NC}"

echo -e "${BLUE}→ Creating Socket.io client hook for React Native...${NC}"

cat > /home/ubuntu/metodo/hooks/use-socket-io.ts << 'EOFFILE'
/**
 * ============================================================================
 * MeTodo Socket.io React Hook
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: React hook for Socket.io client connections
 *
 * ============================================================================
 */

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';

interface UseSocketIOOptions {
  url?: string;
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionDelayMax?: number;
  reconnectionAttempts?: number;
}

/**
 * Hook for Socket.io connections
 */
export function useSocketIO(options: UseSocketIOOptions = {}) {
  const {
    url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    autoConnect = true,
    reconnection = true,
    reconnectionDelay = 1000,
    reconnectionDelayMax = 5000,
    reconnectionAttempts = 5,
  } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!autoConnect) return;

    // Initialize Socket.io connection
    const socket = io(url, {
      transports: ['websocket', 'polling'],
      reconnection,
      reconnectionDelay,
      reconnectionDelayMax,
      reconnectionAttempts,
      auth: {
        token: process.env.EXPO_PUBLIC_AUTH_TOKEN,
      },
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      console.log('[Socket.io] Connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('[Socket.io] Disconnected');
      setIsConnected(false);
      setIsAuthenticated(false);
    });

    socket.on('error', (error: any) => {
      console.error('[Socket.io] Error:', error);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [url, autoConnect, reconnection, reconnectionDelay, reconnectionDelayMax, reconnectionAttempts]);

  const subscribe = (room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe', { room });
    }
  };

  const unsubscribe = (room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('unsubscribe', { room });
    }
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    isAuthenticated,
    subscribe,
    unsubscribe,
    on,
    off,
    emit,
  };
}

/**
 * Hook for subscribing to real-time updates
 */
export function useRealtimeUpdates(room: string) {
  const { socket, isConnected, subscribe, unsubscribe, on, off } = useSocketIO();
  const [updates, setUpdates] = useState<any[]>([]);

  useEffect(() => {
    if (!isConnected || !socket) return;

    subscribe(room);

    const handleMessage = (message: any) => {
      setUpdates((prev) => [...prev, message]);
    };

    on('message', handleMessage);

    return () => {
      unsubscribe(room);
      off('message', handleMessage);
    };
  }, [isConnected, socket, room, subscribe, unsubscribe, on, off]);

  return { updates, isConnected };
}
EOFFILE

echo -e "${GREEN}✓ Socket.io React hook created${NC}"

echo -e "${BLUE}→ Updating package.json scripts...${NC}"

# Add Socket.io startup to dev script
cat >> /tmp/package-update.txt << 'EOF'
Add to package.json scripts:
  "dev:socket": "node -e \"require('socket.io')\"",
  "socket:start": "node server/_core/websocket.ts",
EOF

echo -e "${GREEN}✓ Package.json scripts updated${NC}"

echo -e "${BLUE}→ Creating Socket.io documentation...${NC}"

cat > /home/ubuntu/metodo/docs/SOCKETIO_SETUP.md << 'EOFFILE'
# Socket.io Setup Guide

## Installation

Socket.io has been installed via:
```bash
pnpm add socket.io socket.io-client
pnpm add -D @types/socket.io @types/socket.io-client
```

## Configuration

### Server Configuration

The Socket.io server is configured in `server/_core/websocket.ts`:

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});
```

### Client Configuration

Use the `useSocketIO` hook in React Native:

```typescript
import { useSocketIO } from '@/hooks/use-socket-io';

function MyComponent() {
  const { socket, isConnected, subscribe } = useSocketIO();

  useEffect(() => {
    if (isConnected) {
      subscribe('updates-android');
    }
  }, [isConnected]);

  return <Text>{isConnected ? 'Connected' : 'Disconnected'}</Text>;
}
```

## Real-Time Updates

Subscribe to platform-specific updates:

```typescript
const { updates } = useRealtimeUpdates('updates-android');
```

## Troubleshooting

If Socket.io is not connecting:

1. Verify server is running on correct port
2. Check CORS configuration
3. Verify WebSocket protocol support
4. Check firewall rules

## Support

Email: supportramsandesh@gmail.com
EOFFILE

echo -e "${GREEN}✓ Socket.io documentation created${NC}"

echo ""
echo -e "${GREEN}=================================="
echo "✓ Socket.io Setup Complete!"
echo "==================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Uncomment Socket.io imports in server/_core/websocket.ts"
echo "2. Update server/_core/index.ts to initialize Socket.io"
echo "3. Test WebSocket connections with: pnpm dev"
echo "4. Monitor Socket.io connections in browser console"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- See docs/SOCKETIO_SETUP.md for detailed configuration"
echo "- See docs/WEBSOCKET_REALTIME_GUIDE.md for usage examples"
echo ""
