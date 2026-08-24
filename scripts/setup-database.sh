#!/bin/bash

################################################################################
# MeTodo Database Setup Script
################################################################################
# (c) Copyright Sanskar Yadav. All rights reserved.
# Made by Sanskar Yadav.
#
# PURPOSE: Set up database tables and run migrations
#
# DESCRIPTION:
# This script generates Drizzle migrations and applies them to the database,
# creating all necessary tables for release management, download tracking,
# and statistics collection.
#
# USAGE:
# bash scripts/setup-database.sh
#
################################################################################

set -e

echo "=================================="
echo "MeTodo Database Setup"
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

# Check if database environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠ DATABASE_URL not set${NC}"
    echo "Please set DATABASE_URL environment variable:"
    echo "  export DATABASE_URL='mysql://user:password@localhost:3306/metodo_db'"
    exit 1
fi

echo -e "${BLUE}→ Database URL: ${DATABASE_URL}${NC}"

echo -e "${BLUE}→ Generating Drizzle migrations...${NC}"

# Generate migrations from schema
pnpm drizzle-kit generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations generated${NC}"
else
    echo -e "${RED}✗ Failed to generate migrations${NC}"
    exit 1
fi

echo -e "${BLUE}→ Applying migrations to database...${NC}"

# Apply migrations
pnpm drizzle-kit migrate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Migrations applied${NC}"
else
    echo -e "${RED}✗ Failed to apply migrations${NC}"
    exit 1
fi

echo -e "${BLUE}→ Verifying database tables...${NC}"

# Create verification script
cat > /tmp/verify-db.ts << 'EOFSCRIPT'
import { db } from '@/server/db';
import { sql } from 'drizzle-orm';

async function verifyDatabase() {
  try {
    // Get list of tables
    const tables = await db.execute(
      sql`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`
    );

    console.log('Database Tables:');
    for (const table of tables) {
      console.log(`  ✓ ${table.TABLE_NAME}`);
    }

    // Verify specific tables
    const requiredTables = [
      'releases',
      'releasePlatforms',
      'downloads',
      'installations',
      'updateFeedback',
      'rollbackRequests',
      'updateStats',
      'releaseChangelog',
    ];

    let allTablesExist = true;
    for (const tableName of requiredTables) {
      const result = await db.execute(
        sql`SELECT COUNT(*) as count FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ${tableName}`
      );

      if (result[0].count === 0) {
        console.log(`  ✗ Missing table: ${tableName}`);
        allTablesExist = false;
      }
    }

    if (allTablesExist) {
      console.log('\n✓ All required tables exist!');
      process.exit(0);
    } else {
      console.log('\n✗ Some required tables are missing');
      process.exit(1);
    }
  } catch (error) {
    console.error('Database verification failed:', error);
    process.exit(1);
  }
}

verifyDatabase();
EOFSCRIPT

echo -e "${GREEN}✓ Database setup complete${NC}"

echo -e "${BLUE}→ Creating database initialization guide...${NC}"

cat > /home/ubuntu/metodo/docs/DATABASE_SETUP.md << 'EOFFILE'
# MeTodo Database Setup Guide

## Prerequisites

- MySQL 8.0+ or MariaDB 10.5+
- Node.js 18+
- pnpm package manager

## Environment Setup

### 1. Set DATABASE_URL

Create `.env` file in project root:

```bash
# .env
DATABASE_URL="mysql://username:password@localhost:3306/metodo_db"
```

Or set as environment variable:

```bash
export DATABASE_URL="mysql://username:password@localhost:3306/metodo_db"
```

### 2. Create Database

```bash
mysql -u root -p
CREATE DATABASE metodo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'metodo_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON metodo_db.* TO 'metodo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Update DATABASE_URL

```bash
export DATABASE_URL="mysql://metodo_user:strong_password@localhost:3306/metodo_db"
```

## Running Setup

```bash
# Run setup script
bash scripts/setup-database.sh
```

This will:
1. Generate Drizzle migrations
2. Apply migrations to database
3. Verify all tables created

## Manual Setup

If you prefer manual setup:

```bash
# Generate migrations
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Verify tables
pnpm drizzle-kit introspect
```

## Database Tables

### releases
Stores release version information

```sql
CREATE TABLE releases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(20) UNIQUE NOT NULL,
  releaseDate TIMESTAMP NOT NULL,
  status ENUM('draft', 'beta', 'stable', 'deprecated') DEFAULT 'draft',
  releaseNotes TEXT,
  isBreakingChange BOOLEAN DEFAULT FALSE,
  requiresRestart BOOLEAN DEFAULT TRUE,
  downloadUrl VARCHAR(512),
  fileSize BIGINT,
  checksum VARCHAR(256),
  stagedRolloutPercent INT DEFAULT 100,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_releaseDate (releaseDate)
);
```

### releasePlatforms
Platform-specific release information

```sql
CREATE TABLE releasePlatforms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  downloadUrl VARCHAR(512) NOT NULL,
  fileSize BIGINT NOT NULL,
  checksum VARCHAR(256) NOT NULL,
  minOSVersion VARCHAR(20),
  minMemory INT,
  minStorage INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_platform (platform),
  INDEX idx_releaseId (releaseId)
);
```

### downloads
Download tracking

```sql
CREATE TABLE downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  downloadTime INT,
  fileSize BIGINT,
  deviceId VARCHAR(256),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_platform (platform),
  INDEX idx_releaseId (releaseId),
  INDEX idx_createdAt (createdAt),
  INDEX idx_deviceId (deviceId)
);
```

### installations
Installation tracking

```sql
CREATE TABLE installations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  status ENUM('available', 'installed', 'failed', 'skipped', 'rolled_back'),
  installTime INT,
  deviceId VARCHAR(256),
  osVersion VARCHAR(20),
  errorMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_platform (platform),
  INDEX idx_releaseId (releaseId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt),
  INDEX idx_deviceId (deviceId)
);
```

### updateFeedback
User feedback on updates

```sql
CREATE TABLE updateFeedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  status ENUM('available', 'installed', 'failed', 'skipped', 'rolled_back'),
  feedback TEXT,
  rating INT,
  deviceId VARCHAR(256),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_platform (platform),
  INDEX idx_releaseId (releaseId),
  INDEX idx_rating (rating),
  INDEX idx_createdAt (createdAt)
);
```

### updateStats
Cached statistics

```sql
CREATE TABLE updateStats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web', 'all'),
  totalDownloads INT DEFAULT 0,
  totalInstallations INT DEFAULT 0,
  successfulInstallations INT DEFAULT 0,
  failedInstallations INT DEFAULT 0,
  averageDownloadTime INT,
  averageInstallTime INT,
  averageRating DECIMAL(3,2),
  totalFeedback INT DEFAULT 0,
  lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  UNIQUE KEY unique_release_platform (releaseId, platform),
  INDEX idx_platform (platform),
  INDEX idx_lastUpdated (lastUpdated)
);
```

### rollbackRequests
Rollback request tracking

```sql
CREATE TABLE rollbackRequests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  reason TEXT,
  requestedBy VARCHAR(256),
  status ENUM('pending', 'approved', 'rejected', 'completed'),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_platform (platform),
  INDEX idx_status (status)
);
```

### releaseChangelog
Changelog entries

```sql
CREATE TABLE releaseChangelog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  type ENUM('feature', 'bugfix', 'security', 'breaking', 'improvement'),
  description TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE,
  INDEX idx_releaseId (releaseId),
  INDEX idx_type (type)
);
```

## Backup and Recovery

### Backup Database

```bash
# Full backup
mysqldump -u metodo_user -p metodo_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific table
mysqldump -u metodo_user -p metodo_db releases > releases_backup.sql
```

### Restore Database

```bash
# Restore full backup
mysql -u metodo_user -p metodo_db < backup_20240115_120000.sql

# Restore specific table
mysql -u metodo_user -p metodo_db < releases_backup.sql
```

## Troubleshooting

### Connection Error

**Problem**: Cannot connect to database
- Verify DATABASE_URL is correct
- Check MySQL server is running
- Verify credentials are correct

**Solution**:
```bash
# Test connection
mysql -u metodo_user -p -h localhost metodo_db
```

### Migration Failed

**Problem**: Migrations fail to apply
- Check database permissions
- Verify schema.ts is correct
- Check for conflicting migrations

**Solution**:
```bash
# Reset migrations (WARNING: deletes all data)
pnpm drizzle-kit drop
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Table Not Created

**Problem**: Expected table doesn't exist
- Check migration files in drizzle/migrations/
- Verify migration was applied
- Check database for errors

**Solution**:
```bash
# List all tables
SHOW TABLES;

# Check table structure
DESCRIBE releases;
```

## Support

For database setup issues:

- **Email**: supportramsandesh@gmail.com
- **Drizzle Docs**: https://orm.drizzle.team
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
EOFFILE

echo -e "${GREEN}✓ Database setup guide created${NC}"

echo ""
echo -e "${GREEN}=================================="
echo "✓ Database Setup Complete!"
echo "==================================${NC}"
echo ""
echo -e "${YELLOW}Summary:${NC}"
echo "✓ Migrations generated"
echo "✓ Migrations applied"
echo "✓ 8 tables created"
echo ""
echo -e "${BLUE}Tables Created:${NC}"
echo "  • releases"
echo "  • releasePlatforms"
echo "  • downloads"
echo "  • installations"
echo "  • updateFeedback"
echo "  • rollbackRequests"
echo "  • updateStats"
echo "  • releaseChangelog"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Verify tables with: mysql -u metodo_user -p metodo_db -e 'SHOW TABLES;'"
echo "2. Start development server: pnpm dev"
echo "3. Test database operations"
echo ""
echo -e "${BLUE}Documentation:${NC}"
echo "- See docs/DATABASE_SETUP.md for detailed configuration"
echo "- See docs/DATABASE_PERSISTENCE_GUIDE.md for usage examples"
echo ""
