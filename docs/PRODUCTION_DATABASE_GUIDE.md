# Production Database Deployment and Verification Guide

## Table of Contents

1. [Database Architecture](#database-architecture)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Database Installation](#database-installation)
4. [Schema Deployment](#schema-deployment)
5. [Data Migration](#data-migration)
6. [Performance Tuning](#performance-tuning)
7. [Backup and Recovery](#backup-and-recovery)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Disaster Recovery](#disaster-recovery)

---

## Database Architecture

### Database Schema

MeTodo uses MySQL 8.0+ with 8 main tables:

| Table | Purpose | Records |
|-------|---------|---------|
| `releases` | Release information | 100+ |
| `releasePlatforms` | Platform-specific release data | 400+ |
| `downloads` | Download tracking | 10000+ |
| `installations` | Installation tracking | 10000+ |
| `updateFeedback` | User feedback on updates | 1000+ |
| `rollbackRequests` | Rollback request tracking | 100+ |
| `updateStats` | Update statistics | 1000+ |
| `releaseChangelog` | Release notes and changelogs | 100+ |

### Relationships

```
releases (1) ──→ (N) releasePlatforms
releases (1) ──→ (N) downloads
releases (1) ──→ (N) installations
releases (1) ──→ (N) updateFeedback
releases (1) ──→ (N) rollbackRequests
releases (1) ──→ (N) updateStats
releases (1) ──→ (N) releaseChangelog
```

---

## Pre-Deployment Checklist

- [ ] MySQL 8.0+ installed
- [ ] Database user created with proper permissions
- [ ] Network connectivity verified
- [ ] SSL/TLS configured
- [ ] Backup strategy planned
- [ ] Replication configured (if applicable)
- [ ] Monitoring tools installed
- [ ] Disaster recovery plan documented

---

## Database Installation

### 1. Install MySQL Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install MySQL
sudo apt install -y mysql-server

# Verify installation
mysql --version

# Start MySQL service
sudo systemctl start mysql
sudo systemctl enable mysql

# Verify service is running
sudo systemctl status mysql
```

### 2. Secure MySQL Installation

```bash
# Run security script
sudo mysql_secure_installation

# Prompts:
# - Set root password: YES
# - Remove anonymous users: YES
# - Disable remote root login: YES
# - Remove test database: YES
# - Reload privilege tables: YES
```

### 3. Create Database and User

```bash
# Connect to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE metodo_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create user
CREATE USER 'metodo_user'@'localhost' IDENTIFIED BY 'strong_password_min_16_chars';

# Grant privileges
GRANT ALL PRIVILEGES ON metodo_db.* TO 'metodo_user'@'localhost';

# Create backup user
CREATE USER 'metodo_backup'@'localhost' IDENTIFIED BY 'backup_password_min_16_chars';
GRANT SELECT, LOCK TABLES, SHOW VIEW ON metodo_db.* TO 'metodo_backup'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 4. Configure MySQL for Production

```bash
# Edit MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add/modify settings:
[mysqld]
# Performance
max_connections = 1000
max_allowed_packet = 256M
thread_stack = 256K
thread_cache_size = 128
sort_buffer_size = 4M
bulk_insert_buffer_size = 16M
tmp_table_size = 32M
max_heap_table_size = 32M

# InnoDB
innodb_buffer_pool_size = 4G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
innodb_file_per_table = 1

# Replication (if applicable)
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_format = ROW

# Slow query log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2

# Restart MySQL
sudo systemctl restart mysql
```

---

## Schema Deployment

### 1. Generate Drizzle Migrations

```bash
# Set database URL
export DATABASE_URL="mysql://metodo_user:password@localhost:3306/metodo_db"

# Generate migrations
pnpm drizzle-kit generate

# Review generated SQL
cat drizzle/0000_*.sql
```

### 2. Apply Migrations

```bash
# Apply migrations
pnpm drizzle-kit migrate

# Verify tables created
mysql -u metodo_user -p metodo_db -e "SHOW TABLES;"

# Expected output:
# +----------------------+
# | Tables_in_metodo_db  |
# +----------------------+
# | downloads            |
# | installations        |
# | releasePlatforms     |
# | releaseChangelog     |
# | releases             |
# | rollbackRequests     |
# | updateFeedback       |
# | updateStats          |
# +----------------------+
```

### 3. Verify Schema

```bash
# Check table structures
mysql -u metodo_user -p metodo_db -e "DESCRIBE releases;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE releasePlatforms;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE downloads;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE installations;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE updateFeedback;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE rollbackRequests;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE updateStats;"
mysql -u metodo_user -p metodo_db -e "DESCRIBE releaseChangelog;"
```

### 4. Create Indexes

```bash
# Create performance indexes
mysql -u metodo_user -p metodo_db << 'EOF'
CREATE INDEX idx_releases_status ON releases(status);
CREATE INDEX idx_releases_date ON releases(releaseDate);
CREATE INDEX idx_releasePlatforms_platform ON releasePlatforms(platform);
CREATE INDEX idx_downloads_platform ON downloads(platform);
CREATE INDEX idx_downloads_created ON downloads(createdAt);
CREATE INDEX idx_installations_status ON installations(status);
CREATE INDEX idx_installations_platform ON installations(platform);
CREATE INDEX idx_updateFeedback_rating ON updateFeedback(rating);
CREATE INDEX idx_updateStats_platform ON updateStats(platform);
EOF

# Verify indexes
mysql -u metodo_user -p metodo_db -e "SHOW INDEX FROM releases;"
```

---

## Data Migration

### 1. Load Initial Data

```bash
# Create seed data script
cat > /tmp/seed-data.sql << 'EOF'
-- Insert initial release
INSERT INTO releases (version, releaseDate, status, releaseNotes, requiresRestart)
VALUES ('1.0.0', NOW(), 'stable', 'Initial production release', TRUE);

-- Insert platform-specific release info
INSERT INTO releasePlatforms (releaseId, platform, downloadUrl, fileSize, checksum, minOSVersion)
SELECT id, 'android', 'https://play.google.com/store/apps/details?id=space.manus.metodo', 0, '', '8.0'
FROM releases WHERE version = '1.0.0'
UNION ALL
SELECT id, 'ios', 'https://apps.apple.com/app/metodo', 0, '', '12.0'
FROM releases WHERE version = '1.0.0'
UNION ALL
SELECT id, 'windows', 'https://metodo.app/download/windows', 0, '', '10'
FROM releases WHERE version = '1.0.0'
UNION ALL
SELECT id, 'linux', 'https://metodo.app/download/linux', 0, '', 'ubuntu-20.04'
FROM releases WHERE version = '1.0.0'
UNION ALL
SELECT id, 'macos', 'https://metodo.app/download/macos', 0, '', '10.15'
FROM releases WHERE version = '1.0.0';

-- Insert initial changelog
INSERT INTO releaseChangelog (releaseId, section, content)
VALUES
  ((SELECT id FROM releases WHERE version = '1.0.0'), 'features', 'Initial release with core features'),
  ((SELECT id FROM releases WHERE version = '1.0.0'), 'improvements', 'Performance optimizations'),
  ((SELECT id FROM releases WHERE version = '1.0.0'), 'bugfixes', 'Initial stability fixes');
EOF

# Load seed data
mysql -u metodo_user -p metodo_db < /tmp/seed-data.sql
```

### 2. Verify Data

```bash
# Check data loaded
mysql -u metodo_user -p metodo_db -e "SELECT * FROM releases;"
mysql -u metodo_user -p metodo_db -e "SELECT * FROM releasePlatforms;"
mysql -u metodo_user -p metodo_db -e "SELECT COUNT(*) as total_records FROM releases;"
```

---

## Performance Tuning

### 1. Query Optimization

```bash
# Enable slow query log
mysql -u metodo_user -p metodo_db << 'EOF'
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
EOF

# Analyze slow queries
mysqldumpslow -s t -t 10 /var/log/mysql/slow.log
```

### 2. Connection Pool Tuning

```bash
# Adjust connection pool settings in application
# In .env.production:
DATABASE_POOL_SIZE=10
DATABASE_CONNECTION_TIMEOUT=30000
DATABASE_IDLE_TIMEOUT=900000
```

### 3. Table Optimization

```bash
# Optimize tables
mysql -u metodo_user -p metodo_db << 'EOF'
OPTIMIZE TABLE releases;
OPTIMIZE TABLE releasePlatforms;
OPTIMIZE TABLE downloads;
OPTIMIZE TABLE installations;
OPTIMIZE TABLE updateFeedback;
OPTIMIZE TABLE rollbackRequests;
OPTIMIZE TABLE updateStats;
OPTIMIZE TABLE releaseChangelog;
EOF

# Analyze tables
ANALYZE TABLE releases;
ANALYZE TABLE releasePlatforms;
```

### 4. InnoDB Tuning

```bash
# Check InnoDB status
mysql -u metodo_user -p metodo_db -e "SHOW ENGINE INNODB STATUS\G" | head -100

# Adjust buffer pool
# Edit /etc/mysql/mysql.conf.d/mysqld.cnf:
innodb_buffer_pool_size = 4G  # 50-80% of available RAM

# Restart MySQL
sudo systemctl restart mysql
```

---

## Backup and Recovery

### 1. Full Database Backup

```bash
# Create backup directory
mkdir -p ~/backups

# Full backup
mysqldump -u metodo_user -p metodo_db > ~/backups/metodo_full_$(date +%Y%m%d_%H%M%S).sql

# Compress backup
gzip ~/backups/metodo_full_*.sql

# Verify backup
gunzip -c ~/backups/metodo_full_*.sql.gz | head -20
```

### 2. Incremental Backup

```bash
# Enable binary logging (already configured)
# Binary logs are in /var/log/mysql/mysql-bin.*

# Backup binary logs
cp /var/log/mysql/mysql-bin.* ~/backups/

# Flush logs to create new binary log
mysql -u metodo_user -p -e "FLUSH LOGS;"
```

### 3. Automated Backup Script

```bash
# Create backup script
cat > ~/metodo/scripts/backup-database-production.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="$HOME/backups"
DB_NAME="metodo_db"
DB_USER="metodo_user"
DB_PASS="$DATABASE_PASSWORD"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/metodo_$TIMESTAMP.sql"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Create backup
mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_FILE"

# Compress backup
gzip "$BACKUP_FILE"

# Remove old backups (keep 30 days)
find "$BACKUP_DIR" -name "metodo_*.sql.gz" -mtime +30 -delete

# Verify backup
if [ -f "$BACKUP_FILE.gz" ]; then
    echo "Backup successful: $BACKUP_FILE.gz"
    # Send notification
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\": \"Database backup completed: $BACKUP_FILE.gz\"}"
else
    echo "Backup failed!"
    # Send error notification
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\": \"Database backup FAILED!\"}"
    exit 1
fi
EOF

chmod +x ~/metodo/scripts/backup-database-production.sh

# Schedule daily backups
(crontab -l 2>/dev/null; echo "0 2 * * * $HOME/metodo/scripts/backup-database-production.sh") | crontab -
```

### 4. Restore from Backup

```bash
# List available backups
ls -lh ~/backups/metodo_*.sql.gz

# Restore from backup
gunzip < ~/backups/metodo_20240101_020000.sql.gz | mysql -u metodo_user -p metodo_db

# Verify restoration
mysql -u metodo_user -p metodo_db -e "SELECT COUNT(*) as total_records FROM releases;"
```

---

## Monitoring and Maintenance

### 1. Database Health Check

```bash
# Check database size
mysql -u metodo_user -p -e "SELECT table_schema, ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb FROM information_schema.tables WHERE table_schema = 'metodo_db' GROUP BY table_schema;"

# Check table row counts
mysql -u metodo_user -p metodo_db -e "SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = 'metodo_db';"

# Check connection count
mysql -u metodo_user -p -e "SHOW PROCESSLIST;"
```

### 2. Monitor with Prometheus

```bash
# Install MySQL exporter
sudo apt install -y prometheus-mysqld-exporter

# Configure exporter
sudo nano /etc/default/prometheus-mysqld-exporter

# Add:
MYSQLD_EXPORTER_PASSWORD=metodo_password
MYSQLD_EXPORTER_USER=metodo_user

# Start exporter
sudo systemctl start prometheus-mysqld-exporter
sudo systemctl enable prometheus-mysqld-exporter

# Verify metrics
curl http://localhost:9104/metrics
```

### 3. Maintenance Tasks

```bash
# Weekly maintenance
mysql -u metodo_user -p metodo_db << 'EOF'
-- Optimize tables
OPTIMIZE TABLE releases;
OPTIMIZE TABLE releasePlatforms;
OPTIMIZE TABLE downloads;
OPTIMIZE TABLE installations;
OPTIMIZE TABLE updateFeedback;
OPTIMIZE TABLE rollbackRequests;
OPTIMIZE TABLE updateStats;
OPTIMIZE TABLE releaseChangelog;

-- Analyze tables
ANALYZE TABLE releases;
ANALYZE TABLE releasePlatforms;
ANALYZE TABLE downloads;
ANALYZE TABLE installations;
ANALYZE TABLE updateFeedback;
ANALYZE TABLE rollbackRequests;
ANALYZE TABLE updateStats;
ANALYZE TABLE releaseChangelog;
EOF

# Schedule weekly maintenance
(crontab -l 2>/dev/null; echo "0 3 * * 0 mysql -u metodo_user -p'password' metodo_db < /tmp/maintenance.sql") | crontab -
```

---

## Troubleshooting

### Connection Issues

```bash
# Test connection
mysql -u metodo_user -p -h localhost metodo_db -e "SELECT 1;"

# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Restart MySQL
sudo systemctl restart mysql
```

### Performance Issues

```bash
# Check slow queries
tail -f /var/log/mysql/slow.log

# Check InnoDB status
mysql -u metodo_user -p -e "SHOW ENGINE INNODB STATUS\G"

# Check table statistics
mysql -u metodo_user -p metodo_db -e "ANALYZE TABLE releases;"
```

### Disk Space Issues

```bash
# Check disk usage
df -h

# Check database size
du -sh /var/lib/mysql

# Purge old binary logs
mysql -u metodo_user -p -e "PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 7 DAY);"
```

---

## Disaster Recovery

### 1. Recovery Procedure

```bash
# 1. Stop application
sudo systemctl stop metodo

# 2. Backup current database
mysqldump -u metodo_user -p metodo_db > ~/backups/metodo_before_recovery.sql

# 3. Restore from backup
gunzip < ~/backups/metodo_20240101_020000.sql.gz | mysql -u metodo_user -p metodo_db

# 4. Verify restoration
mysql -u metodo_user -p metodo_db -e "SELECT COUNT(*) FROM releases;"

# 5. Start application
sudo systemctl start metodo

# 6. Verify application
curl http://localhost:3000/health
```

### 2. Replication Recovery

```bash
# If using replication, check slave status
mysql -u metodo_user -p -e "SHOW SLAVE STATUS\G"

# Skip failed transaction
mysql -u metodo_user -p -e "SET GLOBAL SQL_SLAVE_SKIP_COUNTER = 1; START SLAVE;"

# Resync slave from master
mysql -u metodo_user -p -e "CHANGE MASTER TO MASTER_LOG_FILE='mysql-bin.000001', MASTER_LOG_POS=0;"
```

---

## Support

For database issues:

- **Email**: supportramsandesh@gmail.com
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **MySQL Docs**: https://dev.mysql.com/doc/

---

## Checklist

- [ ] MySQL installed and secured
- [ ] Database and user created
- [ ] Schema deployed and verified
- [ ] Initial data loaded
- [ ] Indexes created
- [ ] Performance tuned
- [ ] Backup strategy implemented
- [ ] Monitoring configured
- [ ] Disaster recovery tested
- [ ] Team trained

---

**Last Updated**: 2026-07-03
**Version**: 1.0.0
**Author**: Sanskar Yadav
