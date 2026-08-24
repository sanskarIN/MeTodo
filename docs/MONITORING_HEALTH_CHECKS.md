# Monitoring and Health Check System

## Table of Contents

1. [Health Check Endpoints](#health-check-endpoints)
2. [Monitoring Setup](#monitoring-setup)
3. [Alerting Configuration](#alerting-configuration)
4. [Performance Metrics](#performance-metrics)
5. [Log Aggregation](#log-aggregation)
6. [Dashboards](#dashboards)
7. [SLA Monitoring](#sla-monitoring)
8. [Incident Response](#incident-response)

---

## Health Check Endpoints

### 1. Application Health

**Endpoint**: `GET /health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": 1234567890,
  "version": "13.0.0",
  "uptime": 3600,
  "memory": {
    "used": 256,
    "total": 512,
    "percentage": 50
  },
  "database": {
    "connected": true,
    "responseTime": 5
  },
  "socketio": {
    "connected": true,
    "connectedClients": 42
  }
}
```

### 2. Socket.io Stats

**Endpoint**: `GET /stats/socketio`

**Response**:
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

### 3. Database Health

**Endpoint**: `GET /stats/database`

**Response**:
```json
{
  "status": "healthy",
  "size": {
    "total": 1024,
    "used": 512,
    "free": 512
  },
  "tables": {
    "releases": 100,
    "releasePlatforms": 400,
    "downloads": 10000,
    "installations": 10000,
    "updateFeedback": 1000,
    "rollbackRequests": 100,
    "updateStats": 1000,
    "releaseChangelog": 100
  },
  "connections": {
    "active": 5,
    "max": 100
  },
  "timestamp": 1234567890
}
```

### 4. API Performance

**Endpoint**: `GET /stats/performance`

**Response**:
```json
{
  "avgResponseTime": 45,
  "p95ResponseTime": 120,
  "p99ResponseTime": 250,
  "requestsPerSecond": 100,
  "errorRate": 0.01,
  "uptime": 99.99,
  "timestamp": 1234567890
}
```

---

## Monitoring Setup

### 1. Prometheus Configuration

```yaml
# /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'metodo-app'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'
    scrape_interval: 15s

  - job_name: 'metodo-socketio'
    static_configs:
      - targets: ['localhost:3001']
    metrics_path: '/metrics'

  - job_name: 'mysql'
    static_configs:
      - targets: ['localhost:9104']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
```

### 2. Grafana Dashboard

```bash
# Install Grafana
sudo apt install -y grafana-server

# Start Grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server

# Access Grafana
# URL: http://localhost:3000
# Default credentials: admin/admin
```

### 3. Exporters Installation

```bash
# MySQL Exporter
sudo apt install -y prometheus-mysqld-exporter

# Redis Exporter
sudo apt install -y prometheus-redis-exporter

# Nginx Exporter
sudo apt install -y prometheus-nginx-exporter

# Node Exporter
sudo apt install -y prometheus-node-exporter
```

---

## Alerting Configuration

### 1. Prometheus Alert Rules

```yaml
# /etc/prometheus/alerts.yml
groups:
  - name: metodo_alerts
    interval: 30s
    rules:
      # Application Alerts
      - alert: ApplicationDown
        expr: up{job="metodo-app"} == 0
        for: 5m
        annotations:
          summary: "MeTodo application is down"
          description: "Application has been down for more than 5 minutes"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
          description: "Error rate is above 5%"

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
        for: 5m
        annotations:
          summary: "High response time"
          description: "95th percentile response time is above 1 second"

      # Database Alerts
      - alert: DatabaseDown
        expr: up{job="mysql"} == 0
        for: 5m
        annotations:
          summary: "Database is down"
          description: "MySQL database has been unreachable for 5 minutes"

      - alert: HighDatabaseConnections
        expr: mysql_global_status_threads_connected / mysql_global_variables_max_connections > 0.8
        for: 5m
        annotations:
          summary: "High database connections"
          description: "Database connection usage is above 80%"

      - alert: SlowQueries
        expr: rate(mysql_global_status_slow_queries[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High slow query rate"
          description: "More than 0.1 slow queries per second"

      # Socket.io Alerts
      - alert: HighSocketioConnections
        expr: socketio_connected_clients > 1000
        for: 5m
        annotations:
          summary: "High Socket.io connections"
          description: "More than 1000 clients connected"

      # System Alerts
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) > 0.9
        for: 5m
        annotations:
          summary: "High memory usage"
          description: "Memory usage is above 90%"

      - alert: HighCPUUsage
        expr: (1 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m]))) > 0.9
        for: 5m
        annotations:
          summary: "High CPU usage"
          description: "CPU usage is above 90%"

      - alert: DiskSpaceLow
        expr: (node_filesystem_avail_bytes / node_filesystem_size_bytes) < 0.1
        for: 5m
        annotations:
          summary: "Low disk space"
          description: "Less than 10% disk space available"
```

### 2. Alertmanager Configuration

```yaml
# /etc/alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m

route:
  receiver: 'team-slack'
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

receivers:
  - name: 'team-slack'
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#alerts'
        title: 'MeTodo Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}\n{{ end }}'
        send_resolved: true

  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
        description: '{{ .GroupLabels.alertname }}'
```

---

## Performance Metrics

### 1. Application Metrics

```typescript
// Track in application
import prometheus from 'prom-client';

// Request duration histogram
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

// Request counter
const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Error counter
const httpErrorsTotal = new prometheus.Counter({
  name: 'http_errors_total',
  help: 'Total HTTP errors',
  labelNames: ['method', 'route', 'error_type']
});

// Database query duration
const dbQueryDuration = new prometheus.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration in seconds',
  labelNames: ['query_type', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1]
});

// Cache hit rate
const cacheHitRate = new prometheus.Gauge({
  name: 'cache_hit_rate',
  help: 'Cache hit rate percentage',
  labelNames: ['cache_name']
});
```

### 2. Business Metrics

```typescript
// Track business metrics
const downloadsTotal = new prometheus.Counter({
  name: 'downloads_total',
  help: 'Total downloads',
  labelNames: ['platform', 'version']
});

const installationsTotal = new prometheus.Counter({
  name: 'installations_total',
  help: 'Total installations',
  labelNames: ['platform', 'version']
});

const updateSuccessRate = new prometheus.Gauge({
  name: 'update_success_rate',
  help: 'Update success rate percentage',
  labelNames: ['platform']
});

const activeUsers = new prometheus.Gauge({
  name: 'active_users',
  help: 'Number of active users',
  labelNames: ['platform']
});
```

---

## Log Aggregation

### 1. ELK Stack Setup

```bash
# Install Elasticsearch
sudo apt install -y elasticsearch

# Install Logstash
sudo apt install -y logstash

# Install Kibana
sudo apt install -y kibana

# Start services
sudo systemctl start elasticsearch
sudo systemctl start logstash
sudo systemctl start kibana
```

### 2. Logstash Configuration

```conf
# /etc/logstash/conf.d/metodo.conf
input {
  file {
    path => "/var/log/metodo/server.log"
    start_position => "beginning"
    codec => json
  }
}

filter {
  if [type] == "metodo" {
    date {
      match => [ "timestamp", "ISO8601" ]
    }
    
    mutate {
      add_field => { "[@metadata][index_name]" => "metodo-%{+YYYY.MM.dd}" }
    }
  }
}

output {
  elasticsearch {
    hosts => ["localhost:9200"]
    index => "%{[@metadata][index_name]}"
  }
}
```

### 3. Kibana Dashboards

Create dashboards for:
- Error logs
- Performance metrics
- User activity
- System health
- API usage

---

## Dashboards

### 1. Application Dashboard

Displays:
- Request rate
- Error rate
- Response time (p50, p95, p99)
- Active connections
- Uptime percentage

### 2. Database Dashboard

Displays:
- Query performance
- Connection pool usage
- Table sizes
- Slow queries
- Replication lag

### 3. System Dashboard

Displays:
- CPU usage
- Memory usage
- Disk space
- Network I/O
- Process count

### 4. Business Dashboard

Displays:
- Downloads by platform
- Installations by platform
- Update success rate
- User feedback
- Rollback requests

---

## SLA Monitoring

### 1. SLA Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | 99.9% | < 99.5% |
| Response Time (p95) | < 500ms | > 1000ms |
| Error Rate | < 0.1% | > 1% |
| Database Availability | 99.99% | < 99.9% |

### 2. SLA Tracking

```sql
-- Calculate monthly uptime
SELECT 
  DATE_TRUNC('month', timestamp) as month,
  COUNT(*) as total_checks,
  SUM(CASE WHEN status = 'ok' THEN 1 ELSE 0 END) as successful_checks,
  ROUND(100.0 * SUM(CASE WHEN status = 'ok' THEN 1 ELSE 0 END) / COUNT(*), 2) as uptime_percentage
FROM health_checks
GROUP BY DATE_TRUNC('month', timestamp)
ORDER BY month DESC;
```

---

## Incident Response

### 1. Incident Severity Levels

| Level | Response Time | Resolution Time | Escalation |
|-------|---------------|-----------------|------------|
| Critical | 15 minutes | 1 hour | VP Engineering |
| High | 30 minutes | 4 hours | Engineering Lead |
| Medium | 1 hour | 24 hours | Team Lead |
| Low | 4 hours | 7 days | Team Member |

### 2. Incident Response Workflow

1. **Detection**: Alert triggered
2. **Notification**: Team notified via Slack/PagerDuty
3. **Investigation**: On-call engineer investigates
4. **Mitigation**: Temporary fix applied if needed
5. **Resolution**: Root cause fixed
6. **Communication**: Status updates sent
7. **Post-Mortem**: Incident reviewed

### 3. Runbooks

Create runbooks for common incidents:
- Application down
- Database unavailable
- High error rate
- Performance degradation
- Memory leak
- Disk space full

---

## Support

For monitoring issues:

- **Email**: supportramsandesh@gmail.com
- **GitHub Issues**: https://github.com/sanskaryadav/metodo/issues
- **Prometheus Docs**: https://prometheus.io/docs/
- **Grafana Docs**: https://grafana.com/docs/

---

**Last Updated**: 2026-07-03
**Version**: 1.0.0
**Author**: Sanskar Yadav
