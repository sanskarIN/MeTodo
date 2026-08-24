# MeTodo Production Deployment Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Server Setup](#server-setup)
4. [Database Deployment](#database-deployment)
5. [Application Deployment](#application-deployment)
6. [Socket.io Configuration](#socketio-configuration)
7. [Monitoring and Health Checks](#monitoring-and-health-checks)
8. [Backup and Recovery](#backup-and-recovery)
9. [Troubleshooting](#troubleshooting)
10. [Support](#support)

---

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04 LTS or later (recommended for production)
- **CPU**: 2+ cores (4+ recommended for high traffic)
- **RAM**: 4GB minimum (8GB+ recommended)
- **Storage**: 50GB+ SSD (for database and application)
- **Network**: Static IP address, 100 Mbps+ bandwidth

### Software Requirements

- Node.js 18.0.0 or later
- npm 9.0.0 or later
- pnpm 8.0.0 or later
- MySQL 8.0 or later
- Redis 6.0 or later (for Socket.io adapter)
- Git 2.30 or later
- Docker 20.10+ (optional, for containerized deployment)

### Access Requirements

- SSH access to production server
- GitHub repository access
- Domain name registered and DNS configured
- SSL/TLS certificate (Let's Encrypt recommended)
- GitHub CLI installed and authenticated

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing: `pnpm test`
- [ ] TypeScript compilation successful: `pnpm check`
- [ ] Linting passed: `pnpm lint`
- [ ] No console errors or warnings
- [ ] Code review completed
- [ ] Security audit passed

### Configuration

- [ ] Environment variables documented
- [ ] Database credentials secured
- [ ] API keys rotated
- [ ] CORS origins configured
- [ ] SSL certificates obtained
- [ ] Firewall rules configured

### Database

- [ ] Database backup created
- [ ] Migration scripts tested
- [ ] Indexes optimized
- [ ] Replication configured (if applicable)
- [ ] Backup strategy documented

### Documentation

- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment steps documented
- [ ] Rollback procedures documented
- [ ] Contact information provided

### Monitoring

- [ ] Monitoring tools configured
- [ ] Alert thresholds set
- [ ] Log aggregation configured
- [ ] Performance baselines established
- [ ] Incident response plan created

---

## Server Setup

### 1. Initial Server Configuration

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git build-essential

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MySQL
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server

# Install Nginx (reverse proxy)
sudo apt install -y nginx

# Install Certbot (SSL certificates)
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Create Application User

```bash
# Create non-root user for application
sudo useradd -m -s /bin/bash metodo

# Add user to sudo group
sudo usermod -aG sudo metodo

# Switch to metodo user
sudo su - metodo
```

### 3. Clone Repository

```bash
# Clone MeTodo repository
git clone https://github.com/sanskaryadav/metodo.git
cd metodo

# Install dependencies
pnpm install

# Build application
pnpm build
```

### 4. Configure Nginx Reverse Proxy

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/metodo > /dev/null << 'EOF'
upstream metodo_app {
    server 127.0.0.1:3000;
}

upstream metodo_socket {
    server 127.0.0.1:3001;
}

server {
    listen 80;
    server_name metodo.app www.metodo.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name metodo.app www.metodo.app;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/metodo.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/metodo.app/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json;

    # API Routes
    location /api {
        proxy_pass http://metodo_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io Routes
    location /socket.io {
        proxy_pass http://metodo_socket;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static Files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health Check
    location /health {
        proxy_pass http://metodo_app;
        access_log off;
    }

    # Root
    location / {
        proxy_pass http://metodo_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/metodo /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 5. Configure SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot certonly --nginx -d metodo.app -d www.metodo.app

# Set up auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Database Deployment

### 1. Initialize MySQL Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE metodo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'metodo_user'@'localhost' IDENTIFIED BY 'strong_password_here';

# Grant privileges
GRANT ALL PRIVILEGES ON metodo_db.* TO 'metodo_user'@'localhost';
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 2. Run Database Migrations

```bash
# Set database URL
export DATABASE_URL="mysql://metodo_user:strong_password_here@localhost:3306/metodo_db"

# Run migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Verify tables
mysql -u metodo_user -p metodo_db -e "SHOW TABLES;"
```

### 3. Create Database Backups

```bash
# Create backup directory
mkdir -p ~/backups

# Create initial backup
mysqldump -u metodo_user -p metodo_db > ~/backups/metodo_initial_backup.sql

# Set up automated backups (cron)
(crontab -l 2>/dev/null; echo "0 2 * * * mysqldump -u metodo_user -p'password' metodo_db > ~/backups/metodo_\$(date +\%Y\%m\%d).sql") | crontab -
```

---

## Application Deployment

### 1. Create Environment Configuration

```bash
# Create .env.production file
cat > ~/metodo/.env.production << 'EOF'
# Production Environment
NODE_ENV=production
PORT=3000
SOCKET_IO_PORT=3001

# Database
DATABASE_URL=mysql://metodo_user:strong_password@localhost:3306/metodo_db
DATABASE_POOL_SIZE=10

# API Configuration
API_URL=https://api.metodo.app
WEB_URL=https://metodo.app
CORS_ORIGIN=https://metodo.app,https://www.metodo.app

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRY=7d

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/metodo/server.log

# Redis (for Socket.io adapter)
REDIS_URL=redis://localhost:6379
EOF

# Set permissions
chmod 600 ~/metodo/.env.production
```

### 2. Create Systemd Service

```bash
# Create service file
sudo tee /etc/systemd/system/metodo.service > /dev/null << 'EOF'
[Unit]
Description=MeTodo Application Server
After=network.target mysql.service redis.service

[Service]
Type=simple
User=metodo
WorkingDirectory=/home/metodo/metodo
Environment="NODE_ENV=production"
EnvironmentFile=/home/metodo/metodo/.env.production
ExecStart=/usr/local/bin/node dist/index.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable metodo
sudo systemctl start metodo

# Check status
sudo systemctl status metodo
```

### 3. Set Up Log Rotation

```bash
# Create log rotation configuration
sudo tee /etc/logrotate.d/metodo > /dev/null << 'EOF'
/var/log/metodo/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 metodo metodo
    sharedscripts
    postrotate
        systemctl reload metodo > /dev/null 2>&1 || true
    endscript
}
EOF

# Create log directory
sudo mkdir -p /var/log/metodo
sudo chown metodo:metodo /var/log/metodo
```

---

## Socket.io Configuration

### 1. Enable Socket.io in Production

```bash
# Run Socket.io activation script
bash ~/metodo/scripts/activate-socketio-production.sh

# Verify Socket.io is running
curl https://api.metodo.app/health
```

### 2. Configure Redis Adapter

```bash
# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify Redis is running
redis-cli ping
```

### 3. Monitor Socket.io Connections

```bash
# Check Socket.io stats
curl https://api.metodo.app/stats/socketio

# Monitor in real-time
watch -n 5 'curl -s https://api.metodo.app/stats/socketio | jq .'
```

---

## Monitoring and Health Checks

### 1. Application Health Check

```bash
# Check application health
curl https://api.metodo.app/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": 1234567890,
#   "socketio": {
#     "connected": true,
#     "connectedClients": 42
#   }
# }
```

### 2. Set Up Monitoring with Prometheus

```bash
# Install Prometheus
sudo apt install -y prometheus

# Configure Prometheus
sudo tee /etc/prometheus/prometheus.yml > /dev/null << 'EOF'
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'metodo'
    static_configs:
      - targets: ['localhost:3000']
EOF

# Start Prometheus
sudo systemctl start prometheus
sudo systemctl enable prometheus
```

### 3. Set Up Alerting with Alertmanager

```bash
# Install Alertmanager
sudo apt install -y alertmanager

# Configure alerts
sudo tee /etc/prometheus/alerts.yml > /dev/null << 'EOF'
groups:
  - name: metodo
    rules:
      - alert: HighErrorRate
        expr: rate(errors_total[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes > 1000000000
        for: 5m
        annotations:
          summary: "High memory usage detected"
EOF

# Start Alertmanager
sudo systemctl start alertmanager
sudo systemctl enable alertmanager
```

---

## Backup and Recovery

### 1. Automated Database Backups

```bash
# Create backup script
cat > ~/metodo/scripts/backup-database.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/backups"
DB_NAME="metodo_db"
DB_USER="metodo_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/metodo_$TIMESTAMP.sql"

mkdir -p "$BACKUP_DIR"

mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

# Keep only last 30 days
find "$BACKUP_DIR" -name "metodo_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x ~/metodo/scripts/backup-database.sh

# Schedule daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * $HOME/metodo/scripts/backup-database.sh") | crontab -
```

### 2. Restore from Backup

```bash
# Restore database from backup
gunzip < ~/backups/metodo_20240101_020000.sql.gz | mysql -u metodo_user -p metodo_db

# Verify restoration
mysql -u metodo_user -p metodo_db -e "SELECT COUNT(*) FROM releases;"
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check service status
sudo systemctl status metodo

# View logs
sudo journalctl -u metodo -n 100

# Check port availability
sudo lsof -i :3000
sudo lsof -i :3001

# Restart service
sudo systemctl restart metodo
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u metodo_user -p -h localhost

# Check MySQL status
sudo systemctl status mysql

# View MySQL logs
sudo tail -f /var/log/mysql/error.log
```

### Socket.io Connection Issues

```bash
# Check Redis status
redis-cli ping

# Monitor Socket.io connections
curl https://api.metodo.app/stats/socketio

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

### High Memory Usage

```bash
# Monitor memory usage
free -h
top -b -n 1 | head -20

# Check process memory
ps aux | grep node

# Restart application
sudo systemctl restart metodo
```

---

## Support

For production deployment issues:

- **Email**: supportramsandesh@gmail.com
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **Documentation**: https://metodo.app/docs
- **Status Page**: https://status.metodo.app

---

## Deployment Checklist

- [ ] Server prerequisites installed
- [ ] Application user created
- [ ] Repository cloned and dependencies installed
- [ ] Nginx configured and SSL certificate obtained
- [ ] MySQL database created and migrations run
- [ ] Redis installed and configured
- [ ] Environment variables configured
- [ ] Systemd service created and started
- [ ] Socket.io activated and verified
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation reviewed
- [ ] Team notified of deployment
- [ ] Rollback plan documented

---

**Last Updated**: 2026-07-03
**Version**: 1.0.0
**Author**: Sanskar Yadav
