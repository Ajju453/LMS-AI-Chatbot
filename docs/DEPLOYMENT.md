# 🚀 Deployment Guide - Git VSCode Integration Hub

Guide for deploying the Java/React/MongoDB stack to production environments.

## 📋 Deployment Overview

This guide covers:
- Local Docker Compose deployment
- Production environment setup
- Database migration and backups
- Performance optimization
- Security hardening

## 🐳 Phase 1: Docker Deployment (Development/Staging)

### Step 1: Prepare Environment

```bash
# Clone/navigate to project
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)

# Create .env files for staging
cp backend/.env backend/.env.staging
cp frontend/.env frontend/.env.staging
```

### Step 2: Update Configuration Files

**backend/.env.staging:**
```
SERVER_PORT=8080
SPRING_DATA_MONGODB_URI=mongodb://admin:admin123@mongodb:27017/gitvc_db?authSource=admin
SPRING_PROFILES_ACTIVE=staging
LOGGING_LEVEL_ROOT=INFO
CORS_ALLOWED_ORIGINS=https://staging.yourdomain.com,http://localhost:3000
```

**frontend/.env.staging:**
```
REACT_APP_API_URL=https://staging-api.yourdomain.com
REACT_APP_API_TIMEOUT=45000
NODE_ENV=production
```

### Step 3: Build Docker Images

```bash
# Build all images
docker-compose build

# Verify images built
docker images | grep gitvc

# Expected output:
# git-vscode-hub-backend    latest    XXXXX    XX seconds ago
# git-vscode-hub-frontend   latest    XXXXX    XX seconds ago
```

### Step 4: Push to Docker Registry (Optional)

```bash
# Login to Docker Hub or private registry
docker login

# Tag images
docker tag git-vscode-hub-backend:latest yourregistry/gitvc-backend:latest
docker tag git-vscode-hub-frontend:latest yourregistry/gitvc-frontend:latest

# Push images
docker push yourregistry/gitvc-backend:latest
docker push yourregistry/gitvc-frontend:latest
```

### Step 5: Deploy with Docker Compose

```bash
# Start services
docker-compose up -d

# Verify all services are running
docker-compose ps

# View logs
docker-compose logs -f

# Check health
curl http://localhost:8080/api/health
```

---

## 🔧 Phase 2: Production Deployment

### Option A: AWS EC2

#### Prerequisites
- AWS EC2 instance (t3.medium or larger)
- Ubuntu 22.04 or Amazon Linux 2
- SSH key pair configured

#### Step 1: Create EC2 Instance

```bash
# Launch EC2 instance (via AWS Console or CLI)
# Instance type: t3.medium (minimum)
# Storage: 50GB gp3
# Security group: Allow ports 22, 80, 443
```

#### Step 2: Install Docker

```bash
# SSH to instance
ssh -i your-key.pem ec2-user@<PUBLIC_IP>

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### Step 3: Deploy Application

```bash
# Clone repository
git clone https://code.siemens.com/your-repo.git
cd your-repo

# Create production .env files
cp backend/.env.production backend/.env
cp frontend/.env.production frontend/.env

# Update MongoDB connection for production
# Edit backend/.env to use production MongoDB

# Start services
docker-compose up -d

# Verify deployment
docker-compose ps
curl http://localhost:8080/api/health
```

#### Step 4: Setup Reverse Proxy (Nginx)

```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx config
sudo tee /etc/nginx/sites-available/gitvc > /dev/null <<EOF
upstream backend {
    server localhost:8080;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/gitvc /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Start Nginx
sudo systemctl restart nginx
```

#### Step 5: Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal (runs automatically)
sudo certbot renew --dry-run
```

---

### Option B: Azure Container Instances

#### Step 1: Create Azure Container Registry

```bash
# Create resource group
az group create --name gitvc-rg --location eastus

# Create ACR
az acr create \
  --resource-group gitvc-rg \
  --name gitvcregistry \
  --sku Basic

# Login to ACR
az acr login --name gitvcregistry
```

#### Step 2: Push Docker Images

```bash
# Tag images
docker tag git-vscode-hub-backend:latest gitvcregistry.azurecr.io/gitvc-backend:latest
docker tag git-vscode-hub-frontend:latest gitvcregistry.azurecr.io/gitvc-frontend:latest

# Push to ACR
docker push gitvcregistry.azurecr.io/gitvc-backend:latest
docker push gitvcregistry.azurecr.io/gitvc-frontend:latest
```

#### Step 3: Create Azure Cosmos DB for MongoDB

```bash
# Create Cosmos DB account
az cosmosdb create \
  --name gitvc-db \
  --resource-group gitvc-rg \
  --kind MongoDB
```

#### Step 4: Deploy with Azure Container Instances

```bash
# Deploy backend container
az container create \
  --resource-group gitvc-rg \
  --name gitvc-backend \
  --image gitvcregistry.azurecr.io/gitvc-backend:latest \
  --registry-login-server gitvcregistry.azurecr.io \
  --memory 2 \
  --cpu 1 \
  --ports 8080 \
  --environment-variables \
    SPRING_DATA_MONGODB_URI="mongodb://connection-string" \
    SPRING_PROFILES_ACTIVE=prod

# Deploy frontend container
az container create \
  --resource-group gitvc-rg \
  --name gitvc-frontend \
  --image gitvcregistry.azurecr.io/gitvc-frontend:latest \
  --registry-login-server gitvcregistry.azurecr.io \
  --memory 1 \
  --cpu 1 \
  --ports 3000 \
  --environment-variables \
    REACT_APP_API_URL="https://your-domain.com/api"
```

---

### Option C: Google Cloud Run

#### Step 1: Setup Google Cloud Project

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable containerregistry.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
```

#### Step 2: Build and Push Images

```bash
# Push to Google Container Registry
docker tag git-vscode-hub-backend:latest gcr.io/YOUR_PROJECT_ID/gitvc-backend:latest
docker tag git-vscode-hub-frontend:latest gcr.io/YOUR_PROJECT_ID/gitvc-frontend:latest

docker push gcr.io/YOUR_PROJECT_ID/gitvc-backend:latest
docker push gcr.io/YOUR_PROJECT_ID/gitvc-frontend:latest
```

#### Step 3: Deploy to Cloud Run

```bash
# Deploy backend
gcloud run deploy gitvc-backend \
  --image gcr.io/YOUR_PROJECT_ID/gitvc-backend:latest \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars SPRING_DATA_MONGODB_URI="mongodb-connection-string"

# Deploy frontend
gcloud run deploy gitvc-frontend \
  --image gcr.io/YOUR_PROJECT_ID/gitvc-frontend:latest \
  --platform managed \
  --region us-central1 \
  --memory 256Mi \
  --cpu 1 \
  --set-env-vars REACT_APP_API_URL="https://backend-url"
```

---

## 📊 Phase 3: Database Migration

### Backup MongoDB Data

```bash
# Local backup
mongodump --uri="mongodb://admin:admin123@localhost:27017/gitvc_db" \
  --out=./backup/gitvc_$(date +%Y%m%d)

# Azure Cosmos DB backup
az cosmosdb database backup list \
  --resource-group gitvc-rg \
  --account-name gitvc-db
```

### Restore MongoDB Data

```bash
# Restore from backup
mongorestore --uri="mongodb://admin:password@production-server:27017/gitvc_db" \
  ./backup/gitvc_20240115
```

---

## 🔒 Phase 4: Security Hardening

### Enable MongoDB Authentication

```bash
# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "STRONG_PASSWORD",
  roles: [{ role: "root", db: "admin" }]
})

# Create application user
db.createUser({
  user: "gitvc",
  pwd: "APP_PASSWORD",
  roles: [{ role: "readWrite", db: "gitvc_db" }]
})
```

### Configure SSL/TLS

```bash
# Generate certificates
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout server.key \
  -out server.crt

# Configure MongoDB with SSL
mongod --tlsMode requireTLS \
  --tlsCertificateKeyFile /path/to/server.pem
```

### Configure Firewall

```bash
# Allow only necessary ports
# SSH: 22 (admin only)
# HTTP: 80 (everyone)
# HTTPS: 443 (everyone)
# MongoDB: 27017 (internal only)

# AWS Security Group example
aws ec2 authorize-security-group-ingress \
  --group-id sg-XXXXX \
  --protocol tcp --port 22 --cidr X.X.X.X/32 \
  --protocol tcp --port 80 --cidr 0.0.0.0/0 \
  --protocol tcp --port 443 --cidr 0.0.0.0/0
```

### Setup Secrets Management

```bash
# Create .env.production with secrets
export MONGODB_PASSWORD="secure-password"
export JWT_SECRET="secure-jwt-secret"
export CORS_ORIGINS="https://yourdomain.com"

# Use in docker-compose
docker-compose --env-file .env.production up -d
```

---

## 📈 Phase 5: Monitoring & Scaling

### Setup Health Checks

```bash
# Docker health checks
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1
```

### Configure Auto-Scaling

```yaml
# AWS Auto Scaling Group
MinSize: 2
MaxSize: 10
DesiredCapacity: 2
HealthCheckType: ELB
HealthCheckGracePeriod: 300

# Scaling policy: CPU > 70%
```

### Setup Monitoring

```bash
# CloudWatch monitoring
aws cloudwatch put-metric-alarm \
  --alarm-name gitvc-cpu-high \
  --alarm-description "Alert when CPU > 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

---

## 🧪 Phase 6: Testing & Validation

### Smoke Tests

```bash
#!/bin/bash
# Test all critical endpoints

echo "Testing health endpoint..."
curl -f https://yourdomain.com/api/health || exit 1

echo "Testing frontend..."
curl -f https://yourdomain.com/ || exit 1

echo "Testing API creation..."
curl -f -X POST https://yourdomain.com/api/git-config/save \
  -H "Content-Type: application/json" \
  -d '{"userName":"test","userEmail":"test@example.com"}' || exit 1

echo "✅ All smoke tests passed!"
```

### Performance Testing

```bash
# Load testing with k6
k6 run - <<EOF
import http from 'k6/http';

export default function () {
  http.get('https://yourdomain.com');
}
EOF
```

---

## 📋 Pre-Launch Checklist

- [ ] All containers build without errors
- [ ] Health checks pass
- [ ] Database migrations complete
- [ ] SSL certificates installed
- [ ] Backup strategy configured
- [ ] Monitoring and alerting active
- [ ] Load testing completed
- [ ] Security scan passed
- [ ] Documentation updated
- [ ] Team trained on deployment

---

## 🚨 Emergency Procedures

### Rollback Deployment

```bash
# Restore previous Docker image
docker-compose down
docker pull yourregistry/gitvc-backend:previous-version
docker-compose up -d
```

### Data Recovery

```bash
# Restore from MongoDB backup
mongorestore --drop \
  --uri="mongodb://admin:password@server:27017/gitvc_db" \
  ./backup/gitvc_backup
```

### Service Restart

```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

---

## 📞 Support & Monitoring

### View Logs

```bash
# All containers
docker-compose logs -f --tail=100

# Specific container
docker-compose logs -f backend --tail=50
```

### Monitor Resources

```bash
# Real-time monitoring
docker stats

# Container info
docker inspect container-name
```

### Update Container

```bash
# Pull latest image
docker-compose pull

# Rebuild and restart
docker-compose up -d --build
```

---

**Deployment Guide Complete!** 🚀

For questions or issues, refer to the main documentation in `STACK_MIGRATION.md`.
