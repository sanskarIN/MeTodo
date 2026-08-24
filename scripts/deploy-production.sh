#!/bin/bash

##############################################################################
# MeTodo Production Deployment Script
# Deploys MeTodo to production server with Socket.io activation
# Usage: bash deploy-production.sh [server-ip] [environment]
##############################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOYMENT_LOG="${PROJECT_ROOT}/.manus-logs/deployment-$(date +%Y%m%d_%H%M%S).log"
BACKUP_DIR="${PROJECT_ROOT}/backups/production"

# Default values
SERVER_IP="${1:-}"
ENVIRONMENT="${2:-production}"
DEPLOY_USER="metodo"
DEPLOY_PORT="22"
REMOTE_APP_DIR="/opt/metodo"
REMOTE_DATA_DIR="/var/metodo"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$DEPLOYMENT_LOG"
}

# Create log directory
mkdir -p "$(dirname "$DEPLOYMENT_LOG")"
mkdir -p "$BACKUP_DIR"

# Print header
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          MeTodo Production Deployment Script              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Validate inputs
if [ -z "$SERVER_IP" ]; then
    log_error "Server IP is required"
    echo "Usage: bash deploy-production.sh <server-ip> [environment]"
    exit 1
fi

log_info "Starting production deployment to $SERVER_IP"
log_info "Environment: $ENVIRONMENT"
log_info "Deployment log: $DEPLOYMENT_LOG"
echo ""

# Phase 1: Pre-deployment checks
log_info "Phase 1: Pre-deployment checks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if server is reachable
log_info "Checking server connectivity..."
if ! ping -c 1 "$SERVER_IP" &> /dev/null; then
    log_error "Cannot reach server at $SERVER_IP"
    exit 1
fi
log_success "Server is reachable"

# Check SSH access
log_info "Checking SSH access..."
if ! ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$DEPLOY_USER@$SERVER_IP" -p "$DEPLOY_PORT" "echo 'SSH connection successful'" &> /dev/null; then
    log_error "Cannot connect via SSH to $SERVER_IP"
    exit 1
fi
log_success "SSH connection successful"

# Check required files
log_info "Checking required files..."
required_files=(
    "package.json"
    "pnpm-lock.yaml"
    "app.config.ts"
    ".env.example"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        log_error "Required file not found: $file"
        exit 1
    fi
done
log_success "All required files present"

echo ""

# Phase 2: Build application
log_info "Phase 2: Building application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Installing dependencies..."
cd "$PROJECT_ROOT"
pnpm install --frozen-lockfile 2>&1 | tee -a "$DEPLOYMENT_LOG"
log_success "Dependencies installed"

log_info "Building application..."
pnpm build 2>&1 | tee -a "$DEPLOYMENT_LOG"
log_success "Application built"

log_info "Running type checks..."
pnpm check 2>&1 | tee -a "$DEPLOYMENT_LOG"
log_success "Type checks passed"

echo ""

# Phase 3: Create deployment package
log_info "Phase 3: Creating deployment package"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

DEPLOY_PACKAGE="metodo-$(date +%Y%m%d_%H%M%S).tar.gz"
DEPLOY_PACKAGE_PATH="$BACKUP_DIR/$DEPLOY_PACKAGE"

log_info "Creating deployment package: $DEPLOY_PACKAGE"
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='.env' \
    --exclude='.env.local' \
    --exclude='*.log' \
    -czf "$DEPLOY_PACKAGE_PATH" \
    -C "$PROJECT_ROOT" . 2>&1 | tee -a "$DEPLOYMENT_LOG"

if [ ! -f "$DEPLOY_PACKAGE_PATH" ]; then
    log_error "Failed to create deployment package"
    exit 1
fi

PACKAGE_SIZE=$(du -h "$DEPLOY_PACKAGE_PATH" | cut -f1)
log_success "Deployment package created: $PACKAGE_SIZE"

echo ""

# Phase 4: Upload to server
log_info "Phase 4: Uploading to server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Uploading deployment package..."
scp -o ConnectTimeout=10 \
    -P "$DEPLOY_PORT" \
    "$DEPLOY_PACKAGE_PATH" \
    "$DEPLOY_USER@$SERVER_IP:/tmp/" 2>&1 | tee -a "$DEPLOYMENT_LOG"
log_success "Deployment package uploaded"

echo ""

# Phase 5: Deploy on server
log_info "Phase 5: Deploying on server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Create deployment script
REMOTE_DEPLOY_SCRIPT="/tmp/deploy-remote.sh"

cat > "$REMOTE_DEPLOY_SCRIPT" << 'REMOTE_SCRIPT'
#!/bin/bash

set -euo pipefail

DEPLOY_PACKAGE="$1"
REMOTE_APP_DIR="$2"
REMOTE_DATA_DIR="$3"
ENVIRONMENT="$4"

# Create directories
sudo mkdir -p "$REMOTE_APP_DIR"
sudo mkdir -p "$REMOTE_DATA_DIR"
sudo mkdir -p "$REMOTE_DATA_DIR/logs"
sudo mkdir -p "$REMOTE_DATA_DIR/backups"

# Backup current deployment
if [ -d "$REMOTE_APP_DIR/dist" ]; then
    echo "Backing up current deployment..."
    sudo tar -czf "$REMOTE_DATA_DIR/backups/backup-$(date +%Y%m%d_%H%M%S).tar.gz" \
        -C "$REMOTE_APP_DIR" dist node_modules 2>/dev/null || true
fi

# Extract new package
echo "Extracting deployment package..."
sudo tar -xzf "/tmp/$DEPLOY_PACKAGE" -C "$REMOTE_APP_DIR"

# Install dependencies
echo "Installing dependencies..."
cd "$REMOTE_APP_DIR"
sudo pnpm install --frozen-lockfile --prod

# Copy environment file if not exists
if [ ! -f "$REMOTE_APP_DIR/.env.production" ]; then
    echo "Creating .env.production from .env.example..."
    sudo cp "$REMOTE_APP_DIR/.env.example" "$REMOTE_APP_DIR/.env.production"
    echo "Please edit .env.production with production values"
fi

# Set permissions
sudo chown -R metodo:metodo "$REMOTE_APP_DIR"
sudo chown -R metodo:metodo "$REMOTE_DATA_DIR"
sudo chmod -R 755 "$REMOTE_APP_DIR"
sudo chmod -R 755 "$REMOTE_DATA_DIR"

# Clean up
rm -f "/tmp/$DEPLOY_PACKAGE"

echo "Deployment completed successfully"
REMOTE_SCRIPT

# Upload and execute remote script
log_info "Executing remote deployment..."
scp -o ConnectTimeout=10 \
    -P "$DEPLOY_PORT" \
    "$REMOTE_DEPLOY_SCRIPT" \
    "$DEPLOY_USER@$SERVER_IP:/tmp/" 2>&1 | tee -a "$DEPLOYMENT_LOG"

ssh -o ConnectTimeout=10 \
    -p "$DEPLOY_PORT" \
    "$DEPLOY_USER@$SERVER_IP" \
    "bash /tmp/deploy-remote.sh '$DEPLOY_PACKAGE' '$REMOTE_APP_DIR' '$REMOTE_DATA_DIR' '$ENVIRONMENT'" \
    2>&1 | tee -a "$DEPLOYMENT_LOG"

log_success "Remote deployment completed"

echo ""

# Phase 6: Activate Socket.io
log_info "Phase 6: Activating Socket.io"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Running Socket.io activation script..."
ssh -o ConnectTimeout=10 \
    -p "$DEPLOY_PORT" \
    "$DEPLOY_USER@$SERVER_IP" \
    "bash $REMOTE_APP_DIR/scripts/activate-socketio-production.sh" \
    2>&1 | tee -a "$DEPLOYMENT_LOG"

log_success "Socket.io activated"

echo ""

# Phase 7: Verify deployment
log_info "Phase 7: Verifying deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait for services to start
log_info "Waiting for services to start..."
sleep 10

# Check health endpoint
log_info "Checking application health..."
HEALTH_CHECK=$(ssh -o ConnectTimeout=10 \
    -p "$DEPLOY_PORT" \
    "$DEPLOY_USER@$SERVER_IP" \
    "curl -s http://localhost:3000/health || echo 'FAILED'")

if echo "$HEALTH_CHECK" | grep -q "ok"; then
    log_success "Application health check passed"
else
    log_warning "Application health check may have failed"
    log_info "Response: $HEALTH_CHECK"
fi

# Check Socket.io
log_info "Checking Socket.io status..."
SOCKETIO_CHECK=$(ssh -o ConnectTimeout=10 \
    -p "$DEPLOY_PORT" \
    "$DEPLOY_USER@$SERVER_IP" \
    "curl -s http://localhost:3001/stats/socketio || echo 'FAILED'")

if echo "$SOCKETIO_CHECK" | grep -q "connectedClients"; then
    log_success "Socket.io is running"
else
    log_warning "Socket.io status check may have failed"
    log_info "Response: $SOCKETIO_CHECK"
fi

echo ""

# Phase 8: Post-deployment
log_info "Phase 8: Post-deployment tasks"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Generating deployment report..."
cat > "$BACKUP_DIR/deployment-report-$(date +%Y%m%d_%H%M%S).txt" << REPORT
MeTodo Production Deployment Report
====================================

Deployment Date: $(date)
Server IP: $SERVER_IP
Environment: $ENVIRONMENT
Deployment Package: $DEPLOY_PACKAGE
Package Size: $PACKAGE_SIZE

Deployment Status: SUCCESS

Services:
- Application: http://$SERVER_IP:3000
- Socket.io: http://$SERVER_IP:3001
- Health Check: http://$SERVER_IP:3000/health

Next Steps:
1. Configure .env.production with production values
2. Set up SSL/TLS certificates
3. Configure Nginx reverse proxy
4. Set up monitoring and alerts
5. Configure backup schedules

For more information, see:
- PRODUCTION_DEPLOYMENT_GUIDE.md
- GITHUB_ACTIONS_SETUP_GUIDE.md
- PRODUCTION_DATABASE_GUIDE.md
- MONITORING_HEALTH_CHECKS.md

Support: supportramsandesh@gmail.com
REPORT

log_success "Deployment report generated"

# Send notification
if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
    log_info "Sending Slack notification..."
    curl -X POST "$SLACK_WEBHOOK_URL" \
        -H 'Content-Type: application/json' \
        -d "{\"text\": \"✅ MeTodo production deployment completed successfully\n\nServer: $SERVER_IP\nEnvironment: $ENVIRONMENT\nPackage: $DEPLOY_PACKAGE\"}" \
        2>&1 | tee -a "$DEPLOYMENT_LOG" || true
    log_success "Slack notification sent"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Deployment Completed Successfully!               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
log_success "Deployment log: $DEPLOYMENT_LOG"
log_success "Deployment package: $DEPLOY_PACKAGE_PATH"
log_success "All systems operational"
echo ""
