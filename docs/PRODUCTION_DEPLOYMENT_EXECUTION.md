# Production Deployment Execution Guide

## Overview

This guide provides step-by-step instructions for executing the production deployment of the MeTodo application. It covers all phases from pre-deployment verification through post-deployment monitoring.

**Last Updated:** July 4, 2026  
**Version:** 1.0.0  
**Status:** Production Ready

---

## Table of Contents

1. [Pre-Deployment Phase](#pre-deployment-phase)
2. [Deployment Phase](#deployment-phase)
3. [Post-Deployment Phase](#post-deployment-phase)
4. [Verification Phase](#verification-phase)
5. [Monitoring Phase](#monitoring-phase)
6. [Rollback Procedures](#rollback-procedures)

---

## Pre-Deployment Phase

### Step 1: Complete Verification Checklist

Before beginning deployment, ensure all items in the `PRODUCTION_DEPLOYMENT_VERIFICATION.md` checklist are completed.

```bash
# Review the checklist
cat /home/ubuntu/metodo/docs/PRODUCTION_DEPLOYMENT_VERIFICATION.md

# Verify all critical items are checked
```

### Step 2: Prepare Deployment Environment

Ensure the deployment environment is properly configured with all required credentials and access.

```bash
# Set environment variables
export SERVER_IP="your-server-ip"
export DATABASE_URL="mysql://user:password@host:port/database"
export GITHUB_TOKEN="your-github-token"
export API_ENDPOINT="http://localhost:3000"

# Verify environment
echo "Server IP: $SERVER_IP"
echo "Database URL: ${DATABASE_URL:0:20}...***"
```

### Step 3: Create Backup

Create a complete backup of the current system state before deployment.

```bash
# Create backup directory
mkdir -p /home/ubuntu/metodo/backups

# Backup database (if existing)
# mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME > backups/pre-deployment-$(date +%Y%m%d_%H%M%S).sql

# Backup application files
tar -czf /home/ubuntu/metodo/backups/app-pre-deployment-$(date +%Y%m%d_%H%M%S).tar.gz \
    /home/ubuntu/metodo --exclude=node_modules --exclude=.next --exclude=dist

echo "Backup completed"
```

### Step 4: Run Pre-Deployment Tests

Execute all pre-deployment testing scripts to verify system readiness.

```bash
# Test deployment readiness
bash /home/ubuntu/metodo/scripts/test-deployment.sh "$SERVER_IP" "$API_ENDPOINT"

# Test GitHub Actions configuration
bash /home/ubuntu/metodo/scripts/test-github-actions.sh "$GITHUB_TOKEN" "owner" "repo"

# Test database initialization
bash /home/ubuntu/metodo/scripts/test-database-init.sh "$DATABASE_URL" "production"

# Review test results
ls -lh /home/ubuntu/metodo/.manus-logs/
```

---

## Deployment Phase

### Step 1: Execute Production Deployment

Run the main production deployment script to deploy the application.

```bash
# Execute production deployment
bash /home/ubuntu/metodo/scripts/deploy-production.sh

# Monitor deployment progress
tail -f /home/ubuntu/metodo/.manus-logs/deployment-*.log
```

### Step 2: Verify GitHub Secrets

Ensure all required GitHub secrets are properly configured.

```bash
# Verify GitHub secrets
bash /home/ubuntu/metodo/scripts/verify-github-secrets.sh "$GITHUB_TOKEN" "owner" "repo"

# Review verification results
cat /home/ubuntu/metodo/.manus-logs/github-secrets-verification-*.txt
```

### Step 3: Initialize Database

Initialize the production database with schema and seed data.

```bash
# Initialize database
bash /home/ubuntu/metodo/scripts/init-database-production.sh "$DATABASE_URL"

# Verify database initialization
bash /home/ubuntu/metodo/scripts/test-database-init.sh "$DATABASE_URL" "production"
```

### Step 4: Activate Socket.io

Activate real-time communication features.

```bash
# Activate Socket.io production
bash /home/ubuntu/metodo/scripts/activate-socketio-production.sh

# Verify Socket.io is running
curl -s http://localhost:3001/health | jq .
```

---

## Post-Deployment Phase

### Step 1: Verify Application Startup

Confirm that the application has started successfully.

```bash
# Check if API server is running
curl -s http://localhost:3000/health | jq .

# Check if Socket.io is running
curl -s http://localhost:3001/health | jq .

# Check application logs
tail -f /home/ubuntu/metodo/.manus-logs/app-*.log
```

### Step 2: Run Integration Tests

Execute comprehensive integration tests to verify all components are working together.

```bash
# Run integration tests
bash /home/ubuntu/metodo/scripts/test-integration.sh "http://localhost:3000" "$DATABASE_URL" "$GITHUB_TOKEN"

# Review integration test results
cat /home/ubuntu/metodo/.manus-logs/integration-test-report-*.txt
```

### Step 3: Verify Database Connectivity

Ensure the database is properly connected and accessible.

```bash
# Test database connection
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;"

# Verify tables exist
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES;"

# Check data integrity
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SELECT COUNT(*) FROM tasks;"
```

### Step 4: Verify Real-Time Features

Test real-time communication and synchronization.

```bash
# Test Socket.io connection
curl -s "http://localhost:3001/socket.io/?EIO=4&transport=polling"

# Test real-time updates
# Create a task and verify it appears in real-time
curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Task","description":"Real-time test"}'
```

---

## Verification Phase

### Step 1: Run Smoke Tests

Execute smoke tests to verify critical functionality.

```bash
# Test API endpoints
echo "Testing API endpoints..."
curl -s http://localhost:3000/health
curl -s http://localhost:3000/api/tasks
curl -s http://localhost:3000/api/users

# Test authentication
echo "Testing authentication..."
curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}'
```

### Step 2: Verify User-Facing Features

Test all user-facing features to ensure they work correctly.

```bash
# Test task creation
curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Verification Task","priority":"high"}'

# Test task retrieval
curl -s http://localhost:3000/api/tasks | jq '.[]' | head -5

# Test task update
# curl -X PUT http://localhost:3000/api/tasks/{id} ...

# Test task deletion
# curl -X DELETE http://localhost:3000/api/tasks/{id}
```

### Step 3: Performance Verification

Verify that performance meets requirements.

```bash
# Measure response time
time curl -s http://localhost:3000/api/tasks > /dev/null

# Test concurrent requests
for i in {1..10}; do
    curl -s http://localhost:3000/api/tasks > /dev/null &
done
wait

# Check resource usage
ps aux | grep node
free -h
df -h
```

### Step 4: Security Verification

Verify security measures are in place.

```bash
# Check HTTPS redirect
curl -I http://localhost:3000

# Check security headers
curl -I https://your-domain.com | grep -i "X-Frame-Options\|X-Content-Type-Options"

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -showcerts
```

---

## Monitoring Phase

### Step 1: Start Monitoring

Begin continuous monitoring of the production deployment.

```bash
# Start production monitoring
bash /home/ubuntu/metodo/scripts/monitor-production.sh "http://localhost:3000" 60 "webhook-url"

# Monitor in background
nohup bash /home/ubuntu/metodo/scripts/monitor-production.sh "http://localhost:3000" 60 > /tmp/monitor.log 2>&1 &

# Check monitoring status
tail -f /home/ubuntu/metodo/.manus-logs/monitor-production-*.log
```

### Step 2: Configure Alerts

Set up alerts for critical issues.

```bash
# Configure Slack alerts
export SLACK_WEBHOOK_URL="your-slack-webhook-url"

# Configure email alerts
# Configure your email service

# Test alerts
curl -X POST "$SLACK_WEBHOOK_URL" \
    -H "Content-Type: application/json" \
    -d '{"text":"Deployment verification complete"}'
```

### Step 3: Monitor Key Metrics

Track key performance and health metrics.

```bash
# Check API response time
curl -w "Response time: %{time_total}s\n" -o /dev/null -s http://localhost:3000/api/tasks

# Check error rate
tail -f /home/ubuntu/metodo/.manus-logs/app-error-*.log

# Check database performance
# Monitor slow query log
# Monitor connection pool

# Check resource usage
# Monitor CPU usage
# Monitor memory usage
# Monitor disk usage
```

### Step 4: Review Logs

Regularly review application and system logs.

```bash
# View application logs
tail -f /home/ubuntu/metodo/.manus-logs/app-*.log

# View error logs
tail -f /home/ubuntu/metodo/.manus-logs/error-*.log

# View access logs
tail -f /var/log/nginx/access.log

# Search for specific errors
grep "ERROR\|CRITICAL" /home/ubuntu/metodo/.manus-logs/app-*.log
```

---

## Rollback Procedures

### Scenario 1: Critical Error Detected

If a critical error is detected during deployment, follow these steps:

```bash
# Step 1: Stop the application
systemctl stop metodo-app
systemctl stop metodo-api

# Step 2: Restore from backup
tar -xzf /home/ubuntu/metodo/backups/app-pre-deployment-*.tar.gz -C /

# Step 3: Restore database
# mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < backups/pre-deployment-*.sql

# Step 4: Restart application
systemctl start metodo-api
systemctl start metodo-app

# Step 5: Verify restoration
curl -s http://localhost:3000/health
```

### Scenario 2: Performance Issues

If performance issues are detected:

```bash
# Step 1: Identify bottleneck
# Check CPU usage
# Check memory usage
# Check database queries
# Check network latency

# Step 2: Scale resources
# Increase CPU allocation
# Increase memory allocation
# Add database replicas
# Add application instances

# Step 3: Optimize configuration
# Tune database parameters
# Optimize cache settings
# Adjust connection pools
# Enable compression

# Step 4: Monitor improvements
bash /home/ubuntu/metodo/scripts/monitor-production.sh "http://localhost:3000" 30
```

### Scenario 3: Database Issues

If database issues are detected:

```bash
# Step 1: Check database status
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SHOW STATUS;"

# Step 2: Check for locks
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SHOW PROCESSLIST;"

# Step 3: Kill long-running queries
# mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "KILL QUERY process_id;"

# Step 4: Restart database if necessary
systemctl restart mysql

# Step 5: Verify recovery
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;"
```

### Scenario 4: Complete Rollback

If a complete rollback is necessary:

```bash
# Step 1: Stop all services
systemctl stop metodo-app
systemctl stop metodo-api
systemctl stop nginx

# Step 2: Restore all backups
tar -xzf /home/ubuntu/metodo/backups/app-pre-deployment-*.tar.gz -C /
# mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < backups/pre-deployment-*.sql

# Step 3: Restore configuration
cp /home/ubuntu/metodo/backups/config-pre-deployment.tar.gz /tmp/
tar -xzf /tmp/config-pre-deployment.tar.gz -C /

# Step 4: Restart all services
systemctl start nginx
systemctl start metodo-api
systemctl start metodo-app

# Step 5: Verify rollback
curl -s http://localhost:3000/health
bash /home/ubuntu/metodo/scripts/test-integration.sh "http://localhost:3000"

# Step 6: Notify stakeholders
echo "Rollback completed at $(date)" | mail -s "Deployment Rollback" team@example.com
```

---

## Deployment Checklist

Use this checklist to track deployment progress:

```
Pre-Deployment Phase:
  [ ] Verification checklist completed
  [ ] Environment prepared
  [ ] Backup created
  [ ] Pre-deployment tests passed

Deployment Phase:
  [ ] Production deployment executed
  [ ] GitHub secrets verified
  [ ] Database initialized
  [ ] Socket.io activated

Post-Deployment Phase:
  [ ] Application startup verified
  [ ] Integration tests passed
  [ ] Database connectivity verified
  [ ] Real-time features verified

Verification Phase:
  [ ] Smoke tests passed
  [ ] User-facing features verified
  [ ] Performance verified
  [ ] Security verified

Monitoring Phase:
  [ ] Monitoring started
  [ ] Alerts configured
  [ ] Key metrics tracked
  [ ] Logs reviewed

Deployment Complete:
  [ ] All phases completed
  [ ] All tests passed
  [ ] All systems operational
  [ ] Stakeholders notified
```

---

## Deployment Timeline

Typical deployment timeline:

| Phase | Duration | Notes |
|-------|----------|-------|
| Pre-Deployment | 30-60 min | Verification and backup |
| Deployment | 15-30 min | Deploy and initialize |
| Post-Deployment | 15-30 min | Verify and test |
| Verification | 30-60 min | Comprehensive testing |
| Monitoring | Ongoing | Continuous monitoring |

**Total Estimated Time:** 2-3 hours

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
tail -f /home/ubuntu/metodo/.manus-logs/app-*.log

# Check port availability
lsof -i :3000
lsof -i :3001

# Check environment variables
env | grep DATABASE_URL
env | grep API_

# Restart application
systemctl restart metodo-app
```

### Database Connection Failed

```bash
# Test connection
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1;"

# Check credentials
echo "Host: $DB_HOST"
echo "User: $DB_USER"
echo "Database: $DB_NAME"

# Check firewall
telnet "$DB_HOST" 3306

# Restart database
systemctl restart mysql
```

### Performance Issues

```bash
# Check resource usage
top -b -n 1 | head -20
free -h
df -h

# Check database performance
mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SHOW PROCESSLIST;"

# Check application metrics
curl -s http://localhost:3000/metrics | head -20
```

### Real-Time Features Not Working

```bash
# Check Socket.io status
curl -s http://localhost:3001/health

# Check WebSocket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" http://localhost:3001

# Check logs
tail -f /home/ubuntu/metodo/.manus-logs/socket-*.log

# Restart Socket.io
systemctl restart metodo-socket
```

---

## Support

For deployment assistance, contact:

**Email:** supportramsandesh@gmail.com  
**Documentation:** See `/home/ubuntu/metodo/docs/`  
**Scripts:** See `/home/ubuntu/metodo/scripts/`

---

## Related Documentation

- [PRODUCTION_DEPLOYMENT_VERIFICATION.md](./PRODUCTION_DEPLOYMENT_VERIFICATION.md)
- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [GITHUB_ACTIONS_SETUP_GUIDE.md](./GITHUB_ACTIONS_SETUP_GUIDE.md)
- [PRODUCTION_DATABASE_GUIDE.md](./PRODUCTION_DATABASE_GUIDE.md)
- [MONITORING_HEALTH_CHECKS.md](./MONITORING_HEALTH_CHECKS.md)
- [DISASTER_RECOVERY_PLAN.md](./DISASTER_RECOVERY_PLAN.md)

---

**Version:** 1.0.0  
**Last Updated:** July 4, 2026  
**Status:** Production Ready
