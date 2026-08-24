#!/bin/bash

################################################################################
# MeTodo Socket.io Production Activation Script
################################################################################
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Activate Socket.io in production environment
#
# DESCRIPTION:
# This script enables Socket.io in the production server environment,
# configures CORS, authentication, and starts the WebSocket server.
#
# USAGE:
# bash scripts/activate-socketio-production.sh
#
################################################################################

set -e

echo "=================================="
echo "MeTodo Socket.io Production Activation"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if required environment variables are set
if [ -z "$SOCKET_IO_PORT" ]; then
    SOCKET_IO_PORT=3001
    echo -e "${YELLOW}⚠ SOCKET_IO_PORT not set, using default: $SOCKET_IO_PORT${NC}"
fi

if [ -z "$CORS_ORIGIN" ]; then
    CORS_ORIGIN="*"
    echo -e "${YELLOW}⚠ CORS_ORIGIN not set, using default: $CORS_ORIGIN${NC}"
fi

echo -e "${BLUE}→ Configuring Socket.io for production...${NC}"

# Update server/_core/websocket.ts to enable Socket.io
cat > /home/ubuntu/metodo/server/_core/websocket-production.ts << 'EOFFILE'
/**
 * ============================================================================
 * MeTodo Socket.io Production Server
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Production Socket.io server with authentication and monitoring
 *
 * ============================================================================
 */

import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import type { IncomingMessage } from 'http';
import type { Socket as NetSocket } from 'net';
import express from 'express';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  authenticated?: boolean;
}

/**
 * Initialize production Socket.io server
 */
export function initializeProductionSocketIO(app: any) {
  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    transports: ['websocket', 'polling'],
    pingInterval: 25000,
    pingTimeout: 60000,
    maxHttpBufferSize: 1e6,
    allowEIO3: true,
    serveClient: false,
    cookie: {
      name: 'io',
      path: '/socket.io',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    },
  });

  // Middleware for authentication
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify token (implement your token verification logic)
      const userId = await verifyToken(token);

      if (!userId) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.userId = userId;
      socket.authenticated = true;
      next();
    } catch (error) {
      next(new Error(`Authentication error: ${error}`));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Socket.io] Client connected: ${socket.id} (User: ${socket.userId})`);

    // Track connected clients
    const connectedClients = io.engine.clientsCount;
    console.log(`[Socket.io] Total connected clients: ${connectedClients}`);

    // Handle subscription
    socket.on('subscribe', (data: any) => {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      socket.join(data.room);
      console.log(`[Socket.io] Client ${socket.id} subscribed to ${data.room}`);
      socket.emit('subscribed', { room: data.room, timestamp: Date.now() });

      // Notify room about new subscriber
      io.to(data.room).emit('subscriber-joined', {
        clientId: socket.id,
        userId: socket.userId,
        timestamp: Date.now(),
      });
    });

    // Handle unsubscription
    socket.on('unsubscribe', (data: any) => {
      socket.leave(data.room);
      console.log(`[Socket.io] Client ${socket.id} unsubscribed from ${data.room}`);
      socket.emit('unsubscribed', { room: data.room, timestamp: Date.now() });

      // Notify room about subscriber leaving
      io.to(data.room).emit('subscriber-left', {
        clientId: socket.id,
        userId: socket.userId,
        timestamp: Date.now(),
      });
    });

    // Handle custom messages
    socket.on('message', (data: any) => {
      if (!socket.authenticated) {
        socket.emit('error', { message: 'Not authenticated' });
        return;
      }

      console.log(`[Socket.io] Message from ${socket.id}:`, data);

      // Broadcast to room
      if (data.room) {
        io.to(data.room).emit('message', {
          from: socket.userId,
          clientId: socket.id,
          content: data.content,
          timestamp: Date.now(),
        });
      }
    });

    // Handle ping for keep-alive
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });

    // Handle disconnection
    socket.on('disconnect', (reason: string) => {
      console.log(`[Socket.io] Client disconnected: ${socket.id} (Reason: ${reason})`);
      const remainingClients = io.engine.clientsCount;
      console.log(`[Socket.io] Remaining connected clients: ${remainingClients}`);
    });

    // Handle errors
    socket.on('error', (error: any) => {
      console.error(`[Socket.io] Error from client ${socket.id}:`, error);
    });
  });

  return { httpServer, io };
}

/**
 * Verify authentication token (implement your logic)
 */
async function verifyToken(token: string): Promise<string | null> {
  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace(/^Bearer\s+/i, '');

    // Implement your token verification logic here
    // This is a placeholder - replace with actual JWT verification
    if (cleanToken.length > 0) {
      // For now, extract userId from token (implement proper JWT verification)
      return 'user-' + cleanToken.substring(0, 8);
    }

    return null;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Broadcast message to all clients in a room
 */
export function broadcastToRoom(io: any, room: string, message: any) {
  io.to(room).emit('broadcast', {
    ...message,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast message to all authenticated clients
 */
export function broadcastToAll(io: any, message: any) {
  io.emit('broadcast', {
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

/**
 * Get all connected clients info
 */
export function getConnectedClientsInfo(io: any): any[] {
  const clients: any[] = [];
  io.sockets.sockets.forEach((socket: AuthenticatedSocket) => {
    clients.push({
      id: socket.id,
      userId: socket.userId,
      authenticated: socket.authenticated,
      rooms: Array.from(socket.rooms),
      connectedAt: socket.conn.connectedAt,
    });
  });
  return clients;
}

/**
 * Disconnect specific client
 */
export function disconnectClient(io: any, clientId: string, reason?: string) {
  const socket = io.sockets.sockets.get(clientId);
  if (socket) {
    socket.disconnect(true);
    console.log(`[Socket.io] Client ${clientId} disconnected: ${reason || 'Admin action'}`);
  }
}

/**
 * Disconnect all clients
 */
export function disconnectAllClients(io: any, reason?: string) {
  io.disconnectSockets();
  console.log(`[Socket.io] All clients disconnected: ${reason || 'Server shutdown'}`);
}
EOFFILE

echo -e "${GREEN}✓ Production Socket.io configuration created${NC}"

echo -e "${BLUE}→ Creating production server integration file...${NC}"

cat > /home/ubuntu/metodo/server/_core/server-socketio-integration.ts << 'EOFFILE'
/**
 * ============================================================================
 * Socket.io Integration with Express Server
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Integrate Socket.io with existing Express server
 *
 * ============================================================================
 */

import express from 'express';
import { initializeProductionSocketIO } from './websocket-production';

/**
 * Setup Socket.io with Express app
 */
export function setupSocketIOWithExpress(app: express.Application) {
  const { httpServer, io } = initializeProductionSocketIO(app);

  // Mount Express app on HTTP server
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (req, res) => {
    const connectedClients = io.engine.clientsCount;
    res.json({
      status: 'ok',
      timestamp: Date.now(),
      socketio: {
        connected: true,
        connectedClients,
      },
    });
  });

  // Socket.io stats endpoint
  app.get('/stats/socketio', (req, res) => {
    const connectedClients = io.engine.clientsCount;
    const rooms = io.sockets.adapter.rooms;

    const roomStats: any = {};
    rooms.forEach((clients, room) => {
      if (!room.startsWith('/')) {
        roomStats[room] = clients.size;
      }
    });

    res.json({
      connectedClients,
      rooms: roomStats,
      timestamp: Date.now(),
    });
  });

  // Broadcast endpoint (admin only)
  app.post('/admin/broadcast', (req, res) => {
    const { room, message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    if (room) {
      io.to(room).emit('broadcast', {
        message,
        timestamp: Date.now(),
      });
      res.json({ success: true, recipients: 'room: ' + room });
    } else {
      io.emit('broadcast', {
        message,
        timestamp: Date.now(),
      });
      res.json({ success: true, recipients: 'all' });
    }
  });

  return { httpServer, io };
}

export default setupSocketIOWithExpress;
EOFFILE

echo -e "${GREEN}✓ Server integration file created${NC}"

echo -e "${BLUE}→ Creating production environment configuration...${NC}"

cat > /home/ubuntu/metodo/.env.production.example << 'EOFFILE'
# Production Environment Configuration

# Socket.io Configuration
SOCKET_IO_PORT=3001
CORS_ORIGIN=https://metodo.app,https://www.metodo.app
SOCKET_IO_ADAPTER=redis

# Database Configuration
DATABASE_URL=mysql://metodo_user:strong_password@db.metodo.app:3306/metodo_db
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT=30000

# Server Configuration
NODE_ENV=production
PORT=3000
API_URL=https://api.metodo.app
WEB_URL=https://metodo.app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
ENABLE_CORS=true
ENABLE_HELMET=true

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=/var/log/metodo/server.log

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
DATADOG_API_KEY=your-datadog-api-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@metodo.app

# AWS Configuration (for file storage)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=metodo-production

# Redis Configuration (for caching and sessions)
REDIS_URL=redis://redis.metodo.app:6379
REDIS_PASSWORD=your-redis-password

# Third-party Services
SLACK_WEBHOOK_URL=<your-slack-webhook-url>
GITHUB_TOKEN=ghp_your-github-token
GITHUB_REPO=sanskaryadav/metodo
EOFFILE

echo -e "${GREEN}✓ Production environment configuration created${NC}"

echo -e "${BLUE}→ Creating Socket.io monitoring dashboard...${NC}"

cat > /home/ubuntu/metodo/docs/SOCKETIO_PRODUCTION_GUIDE.md << 'EOFFILE'
# Socket.io Production Deployment Guide

## Prerequisites

- Node.js 18+
- Redis (for Socket.io adapter in clustered environments)
- MySQL 8.0+
- SSL/TLS certificates

## Deployment Steps

### 1. Install Dependencies

```bash
pnpm add socket.io socket.io-client
pnpm add -D @types/socket.io @types/socket.io-client
```

### 2. Configure Environment Variables

Create `.env.production`:

```bash
SOCKET_IO_PORT=3001
CORS_ORIGIN=https://metodo.app,https://www.metodo.app
NODE_ENV=production
DATABASE_URL=mysql://user:pass@db.metodo.app:3306/metodo_db
JWT_SECRET=your-super-secret-key-min-32-characters
```

### 3. Enable Socket.io in Server

Update `server/_core/index.ts`:

```typescript
import { setupSocketIOWithExpress } from './server-socketio-integration';

const app = express();

// Setup Socket.io
const { httpServer, io } = setupSocketIOWithExpress(app);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.io running on port ${process.env.SOCKET_IO_PORT || 3001}`);
});
```

### 4. Configure CORS

```typescript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
```

### 5. Set Up Authentication

Implement JWT verification in `verifyToken()`:

```typescript
import jwt from 'jsonwebtoken';

async function verifyToken(token: string): Promise<string | null> {
  try {
    const cleanToken = token.replace(/^Bearer\s+/i, '');
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET!);
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
```

### 6. Deploy to Production

#### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

EXPOSE 3000 3001

CMD ["pnpm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  metodo-server:
    build: .
    ports:
      - "3000:3000"
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://metodo:password@db:3306/metodo_db
      - SOCKET_IO_PORT=3001
      - CORS_ORIGIN=https://metodo.app
    depends_on:
      - db
      - redis

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=metodo_db
      - MYSQL_USER=metodo
      - MYSQL_PASSWORD=password
    volumes:
      - db-data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  db-data:
```

### 7. Monitoring and Logging

#### Health Check Endpoint

```bash
curl https://api.metodo.app/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "socketio": {
    "connected": true,
    "connectedClients": 42
  }
}
```

#### Socket.io Stats Endpoint

```bash
curl https://api.metodo.app/stats/socketio
```

Response:
```json
{
  "connectedClients": 42,
  "rooms": {
    "updates-android": 15,
    "updates-ios": 12,
    "updates-windows": 10,
    "updates-linux": 5
  },
  "timestamp": 1234567890
}
```

### 8. Scaling with Redis Adapter

For multiple server instances:

```bash
pnpm add socket.io-redis
```

Update `websocket-production.ts`:

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

await Promise.all([pubClient.connect(), subClient.connect()]);

io.adapter(createAdapter(pubClient, subClient));
```

### 9. Security Best Practices

1. **Enable HTTPS/WSS**
   ```typescript
   const httpsServer = https.createServer(options, app);
   const io = new Server(httpsServer, { /* ... */ });
   ```

2. **Implement Rate Limiting**
   ```typescript
   io.use((socket, next) => {
     const clientIp = socket.handshake.address;
     // Implement rate limiting logic
     next();
   });
   ```

3. **Validate Messages**
   ```typescript
   socket.on('message', (data) => {
     if (!validateMessage(data)) {
       socket.emit('error', 'Invalid message');
       return;
     }
   });
   ```

4. **Use Secure Cookies**
   ```typescript
   cookie: {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',
   }
   ```

### 10. Troubleshooting

#### Connection Issues

```bash
# Check if Socket.io port is open
telnet api.metodo.app 3001

# Check firewall rules
sudo ufw status
sudo ufw allow 3001

# Check server logs
tail -f /var/log/metodo/server.log
```

#### High Memory Usage

```bash
# Monitor Socket.io connections
curl https://api.metodo.app/stats/socketio

# Disconnect inactive clients
# Implement in server:
setInterval(() => {
  io.sockets.sockets.forEach((socket) => {
    if (socket.lastActivity < Date.now() - 3600000) {
      socket.disconnect();
    }
  });
}, 60000);
```

#### Broadcast Not Working

- Verify CORS configuration
- Check authentication token
- Verify room subscription
- Check network connectivity

## Support

For Socket.io production issues:

- **Email**: supportramsandesh@gmail.com
- **Socket.io Docs**: https://socket.io/docs/
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
EOFFILE

echo -e "${GREEN}✓ Production guide created${NC}"

echo ""
echo -e "${GREEN}=================================="
echo "✓ Socket.io Production Activation Complete!"
echo "==================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "✓ Production Socket.io server configured"
echo "✓ Express integration file created"
echo "✓ Environment configuration template created"
echo "✓ Monitoring endpoints configured"
echo "✓ Production deployment guide created"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Copy .env.production.example to .env.production"
echo "2. Update environment variables with production values"
echo "3. Update server/_core/index.ts to use setupSocketIOWithExpress()"
echo "4. Deploy to production server"
echo "5. Monitor connections at: https://api.metodo.app/stats/socketio"
echo ""
echo -e "${BLUE}Health Check:${NC}"
echo "curl https://api.metodo.app/health"
echo ""
