# MeTodo Database Persistence Guide

**Copyright © Sanskar Yadav. All rights reserved.**

## Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Tables and Relationships](#tables-and-relationships)
4. [CRUD Operations](#crud-operations)
5. [Query Examples](#query-examples)
6. [Performance Optimization](#performance-optimization)
7. [Migration Guide](#migration-guide)
8. [Backup and Recovery](#backup-and-recovery)

## Overview

MeTodo uses MySQL/MariaDB with Drizzle ORM for persistent storage of release information, download tracking, installation statistics, and user feedback. All data is automatically synchronized across platforms.

### Database Features

- **Relational Schema**: Normalized tables with foreign key relationships
- **Automatic Timestamps**: createdAt and updatedAt fields on all tables
- **Cascade Deletes**: Related records automatically cleaned up
- **Type Safety**: Full TypeScript support via Drizzle ORM
- **Migrations**: Version-controlled schema changes

## Database Schema

### Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `releases` | Release versions and metadata | ~10-50 per year |
| `releasePlatforms` | Platform-specific release info | ~30-250 per year |
| `releaseChangelog` | Changelog entries | ~100-500 per year |
| `downloads` | Download tracking | ~100K-1M per year |
| `installations` | Installation tracking | ~50K-500K per year |
| `updateFeedback` | User feedback | ~10K-100K per year |
| `rollbackRequests` | Rollback requests | ~100-1K per year |
| `updateStats` | Cached statistics | ~100-500 records |

### Storage Estimates

- **Small App** (10K users): ~500 MB
- **Medium App** (100K users): ~5 GB
- **Large App** (1M users): ~50 GB

## Tables and Relationships

### releases Table

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
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Indexes**:
- PRIMARY KEY: `id`
- UNIQUE: `version`
- INDEX: `status`, `releaseDate`

### releasePlatforms Table

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
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);
```

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `releaseId`
- INDEX: `platform`, `releaseId`

### downloads Table

```sql
CREATE TABLE downloads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  releaseId INT NOT NULL,
  platform ENUM('android', 'ios', 'windows', 'linux', 'macos', 'web'),
  downloadTime INT,
  fileSize BIGINT,
  deviceId VARCHAR(256),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);
```

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `releaseId`
- INDEX: `platform`, `releaseId`, `createdAt`, `deviceId`

### installations Table

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
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);
```

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `releaseId`
- INDEX: `platform`, `releaseId`, `status`, `createdAt`, `deviceId`

### updateFeedback Table

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
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);
```

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `releaseId`
- INDEX: `platform`, `releaseId`, `rating`, `createdAt`

### updateStats Table

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
  FOREIGN KEY (releaseId) REFERENCES releases(id) ON DELETE CASCADE
);
```

**Indexes**:
- PRIMARY KEY: `id`
- FOREIGN KEY: `releaseId`
- UNIQUE: `(releaseId, platform)`
- INDEX: `platform`, `lastUpdated`

## CRUD Operations

### Create Operations

#### Create Release

```typescript
import { db } from '@/server/db';
import { releases } from '@/drizzle/schema';

async function createRelease(data: {
  version: string;
  releaseDate: Date;
  status: 'draft' | 'beta' | 'stable' | 'deprecated';
  releaseNotes: string;
  isBreakingChange: boolean;
  requiresRestart: boolean;
}) {
  const result = await db.insert(releases).values(data);
  return result;
}
```

#### Create Download Record

```typescript
import { db } from '@/server/db';
import { downloads } from '@/drizzle/schema';

async function recordDownload(data: {
  releaseId: number;
  platform: string;
  downloadTime: number;
  fileSize: number;
  deviceId?: string;
}) {
  const result = await db.insert(downloads).values(data);
  return result;
}
```

### Read Operations

#### Get Latest Release

```typescript
import { db } from '@/server/db';
import { releases } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';

async function getLatestRelease(platform?: string) {
  const result = await db
    .select()
    .from(releases)
    .where(eq(releases.status, 'stable'))
    .orderBy(desc(releases.releaseDate))
    .limit(1);

  return result[0];
}
```

#### Get Release History

```typescript
import { db } from '@/server/db';
import { releases } from '@/drizzle/schema';
import { desc } from 'drizzle-orm';

async function getReleaseHistory(limit: number = 10, offset: number = 0) {
  const result = await db
    .select()
    .from(releases)
    .orderBy(desc(releases.releaseDate))
    .limit(limit)
    .offset(offset);

  return result;
}
```

#### Get Download Statistics

```typescript
import { db } from '@/server/db';
import { downloads } from '@/drizzle/schema';
import { count, sum, avg } from 'drizzle-orm';

async function getDownloadStats(releaseId: number, platform?: string) {
  const query = db
    .select({
      totalDownloads: count(),
      totalSize: sum(downloads.fileSize),
      avgDownloadTime: avg(downloads.downloadTime),
    })
    .from(downloads)
    .where(eq(downloads.releaseId, releaseId));

  if (platform) {
    query.where(eq(downloads.platform, platform));
  }

  return query;
}
```

### Update Operations

#### Update Release Status

```typescript
import { db } from '@/server/db';
import { releases } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

async function updateReleaseStatus(
  releaseId: number,
  status: 'draft' | 'beta' | 'stable' | 'deprecated'
) {
  const result = await db
    .update(releases)
    .set({ status })
    .where(eq(releases.id, releaseId));

  return result;
}
```

#### Update Installation Status

```typescript
import { db } from '@/server/db';
import { installations } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

async function updateInstallationStatus(
  installationId: number,
  status: string,
  errorMessage?: string
) {
  const result = await db
    .update(installations)
    .set({ status, errorMessage })
    .where(eq(installations.id, installationId));

  return result;
}
```

### Delete Operations

#### Delete Release (cascades to all related records)

```typescript
import { db } from '@/server/db';
import { releases } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';

async function deleteRelease(releaseId: number) {
  const result = await db
    .delete(releases)
    .where(eq(releases.id, releaseId));

  return result;
}
```

## Query Examples

### Complex Queries

#### Get Release with All Data

```typescript
async function getReleaseWithDetails(releaseId: number) {
  const release = await db
    .select()
    .from(releases)
    .where(eq(releases.id, releaseId))
    .leftJoin(releasePlatforms, eq(releases.id, releasePlatforms.releaseId))
    .leftJoin(releaseChangelog, eq(releases.id, releaseChangelog.releaseId));

  return release;
}
```

#### Get Installation Success Rate by Platform

```typescript
async function getSuccessRateByPlatform(releaseId: number) {
  const result = await db
    .select({
      platform: installations.platform,
      total: count(),
      successful: count(
        sql`CASE WHEN status = 'installed' THEN 1 END`
      ),
      failed: count(
        sql`CASE WHEN status = 'failed' THEN 1 END`
      ),
    })
    .from(installations)
    .where(eq(installations.releaseId, releaseId))
    .groupBy(installations.platform);

  return result;
}
```

#### Get Top Feedback Ratings

```typescript
async function getTopRatedReleases(limit: number = 10) {
  const result = await db
    .select({
      version: releases.version,
      avgRating: avg(updateFeedback.rating),
      feedbackCount: count(),
    })
    .from(releases)
    .leftJoin(updateFeedback, eq(releases.id, updateFeedback.releaseId))
    .groupBy(releases.id)
    .orderBy(desc(avg(updateFeedback.rating)))
    .limit(limit);

  return result;
}
```

## Performance Optimization

### Indexing Strategy

```sql
-- Add indexes for common queries
CREATE INDEX idx_downloads_platform_date ON downloads(platform, createdAt);
CREATE INDEX idx_installations_status_date ON installations(status, createdAt);
CREATE INDEX idx_feedback_rating ON updateFeedback(rating);
CREATE INDEX idx_releases_status_date ON releases(status, releaseDate);
```

### Query Optimization Tips

1. **Use Pagination**: Always use LIMIT and OFFSET for large result sets
2. **Select Specific Columns**: Avoid SELECT * when possible
3. **Cache Results**: Use Redis or in-memory caching for frequently accessed data
4. **Archive Old Data**: Move records older than 1 year to archive tables
5. **Batch Operations**: Use batch inserts for bulk data

### Connection Pooling

```typescript
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

## Migration Guide

### Generate Migrations

```bash
pnpm drizzle-kit generate
```

### Review Migrations

```bash
ls -la drizzle/migrations/
cat drizzle/migrations/0001_*.sql
```

### Apply Migrations

```bash
pnpm drizzle-kit migrate
```

### Rollback Migrations

```bash
# Drizzle doesn't support rollback, so manually revert:
# 1. Restore previous schema.ts
# 2. Generate new migration
# 3. Apply migration
```

## Backup and Recovery

### Backup Database

```bash
# Full backup
mysqldump -u root -p metodo_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup specific table
mysqldump -u root -p metodo_db releases > releases_backup.sql
```

### Restore Database

```bash
# Restore full backup
mysql -u root -p metodo_db < backup_20240101_120000.sql

# Restore specific table
mysql -u root -p metodo_db < releases_backup.sql
```

### Point-in-Time Recovery

```bash
# Enable binary logging in my.cnf
[mysqld]
log_bin = /var/log/mysql/mysql-bin.log

# Recover to specific timestamp
mysqlbinlog --stop-datetime="2024-01-15 12:00:00" /var/log/mysql/mysql-bin.* | mysql -u root -p metodo_db
```

## Support

For database-related issues:

- **Email**: supportramsandesh@gmail.com
- **Documentation**: https://metodo.app/docs/database
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
