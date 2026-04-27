# 🖥️ Command Reference Guide

Quick reference for all common commands needed to work with the Git VSCode Integration Hub.

---

## 🐳 Docker Compose Commands

### Start & Stop Services
```bash
# Start all services in foreground (show logs)
docker-compose up

# Start all services in background
docker-compose up -d

# Stop all services (keep data)
docker-compose down

# Stop all services and delete everything (WARNING: deletes data)
docker-compose down -v

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart mongodb
```

### Build & Rebuild
```bash
# Build all images
docker-compose build

# Rebuild all images (no cache)
docker-compose build --no-cache

# Rebuild and start
docker-compose up --build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### View Status & Logs
```bash
# Show status of all services
docker-compose ps

# Show live logs from all services
docker-compose logs -f

# Show logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Show last 50 lines of logs
docker-compose logs -f --tail=50

# Show logs without timestamps
docker-compose logs -f --no-log-prefix
```

### Access Services
```bash
# Run command in container
docker-compose exec backend bash
docker-compose exec frontend bash
docker-compose exec mongodb mongosh -u admin -p admin123

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# View container info
docker-compose exec backend java -version
docker-compose exec frontend npm --version
```

---

## 🔧 Backend (Java/Spring Boot) Commands

### Build & Run
```bash
# Build project
cd backend
mvn clean install

# Run application
mvn spring-boot:run

# Run with debug logging
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.root=DEBUG"

# Build JAR file
mvn clean package

# Skip tests during build
mvn clean install -DskipTests

# Run specific profile
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=staging"
```

### Testing
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=YourTestClass

# Run with coverage
mvn test jacoco:report

# Skip tests
mvn clean package -DskipTests
```

### Dependency Management
```bash
# Display dependency tree
mvn dependency:tree

# Check for updates
mvn versions:display-dependency-updates

# Display plugin updates
mvn versions:display-plugin-updates

# Install dependencies
mvn install
```

### Clean & Format
```bash
# Clean build directory
mvn clean

# Format code (if formatter configured)
mvn spotless:apply

# Check for issues
mvn spotless:check
```

---

## 📦 Frontend (React/Node.js) Commands

### Installation & Running
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with specific port
PORT=4000 npm start
```

### Dependency Management
```bash
# List outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Install new package
npm install package-name

# Uninstall package
npm uninstall package-name

# Audit dependencies
npm audit

# Fix security vulnerabilities
npm audit fix
```

### Build & Deploy
```bash
# Create optimized production build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Serve production build locally
npx serve -s build -l 3000

# Deploy (as configured)
npm run deploy
```

### Cleaning
```bash
# Remove node_modules
rm -rf node_modules

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

---

## 📊 MongoDB Commands

### Shell Access
```bash
# Connect to MongoDB shell
mongosh -u admin -p admin123

# With Docker
docker-compose exec mongodb mongosh -u admin -p admin123

# Connect to specific database
mongosh -u admin -p admin123 --authenticationDatabase admin --db gitvc_db
```

### Database Operations
```javascript
// In MongoDB shell:

// Show all databases
show dbs

// Use database
use gitvc_db

// Show collections
show collections

// Count documents
db.git_configs.countDocuments()
db.ssh_keys.countDocuments()
db.tasks.countDocuments()

// List all documents
db.git_configs.find()
db.ssh_keys.find()
db.tasks.find()

// Find specific document
db.git_configs.findOne({ userId: "user123" })

// Update document
db.git_configs.updateOne({ userId: "user123" }, { $set: { userName: "New Name" } })

// Delete document
db.git_configs.deleteOne({ userId: "user123" })

// Drop collection
db.git_configs.drop()

// Create index
db.git_configs.createIndex({ userId: 1 })

// Remove index
db.git_configs.dropIndex("userId_1")
```

### Backup & Restore
```bash
# Dump database to file
mongodump --uri="mongodb://admin:admin123@localhost:27017/gitvc_db" --out=./backup

# Restore database
mongorestore --uri="mongodb://admin:admin123@localhost:27017" ./backup/gitvc_db

# With Docker
docker-compose exec mongodb mongodump -u admin -p admin123 -o /backup
docker-compose exec mongodb mongorestore -u admin -p admin123 /backup
```

---

## 🌐 API Testing Commands

### Using curl
```bash
# Test health check
curl http://localhost:8080/api/health

# Get Git configuration
curl http://localhost:8080/api/git-config/user123

# Save Git configuration
curl -X POST http://localhost:8080/api/git-config/save?userId=user123 \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "autoCrlf": true
  }'

# Get all tasks
curl http://localhost:8080/api/tasks/user123

# Create task
curl -X POST http://localhost:8080/api/tasks?userId=user123 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Task",
    "description": "Task description",
    "priority": "high"
  }'

# Update task
curl -X PUT http://localhost:8080/api/tasks/taskId \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task",
    "completed": false
  }'

# Delete task
curl -X DELETE http://localhost:8080/api/tasks/taskId
```

### Using PowerShell
```powershell
# Test health check
Invoke-WebRequest -Uri http://localhost:8080/api/health

# Get configuration
Invoke-WebRequest -Uri http://localhost:8080/api/git-config/user123

# Create task (PowerShell)
$body = @{
    title = "My Task"
    description = "Description"
    priority = "high"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:8080/api/tasks?userId=user123 `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## 📁 File Operations

### Git Commands
```bash
# Initialize git (if needed)
git init

# Add files
git add .

# Commit changes
git commit -m "Your message"

# Check status
git status

# View log
git log --oneline

# Create branch
git checkout -b feature-name

# Switch branch
git checkout branch-name

# Merge branch
git merge branch-name
```

### Directory Navigation
```bash
# Navigate to project
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)

# Navigate to backend
cd backend

# Navigate to frontend
cd frontend

# Show current directory
pwd (Mac/Linux) or cd (Windows)

# List files
ls (Mac/Linux) or dir (Windows)

# Create directory
mkdir directory-name
```

### File Management
```bash
# Copy file
cp source.txt destination.txt

# Move/rename file
mv old-name.txt new-name.txt

# Delete file
rm file-name.txt

# View file content
cat file-name.txt

# Edit file
nano file-name.txt
```

---

## 🐛 Debugging & Monitoring

### Docker Monitoring
```bash
# Watch resource usage
docker stats

# View container details
docker inspect container-id

# View network
docker network ls

# Network inspect
docker network inspect gitvc-network
```

### Java Debugging
```bash
# Debug on port 5005
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005"

# Check Java version
java -version

# Check running Java processes
jps -l
```

### Node.js Debugging
```bash
# Run with inspector
node --inspect-brk ./node_modules/.bin/react-scripts start

# Check Node version
node --version

# Check npm version
npm --version
```

### Network Testing
```bash
# Check if port is open
netstat -ano | findstr :8080 (Windows)
lsof -i :8080 (Mac/Linux)

# Kill process on port
taskkill /PID <PID> /F (Windows)
kill -9 <PID> (Mac/Linux)

# Test connectivity
ping localhost
curl http://localhost:8080
```

---

## 🔧 Configuration Management

### Update Environment Variables
```bash
# Edit backend configuration
nano backend/.env

# Edit frontend configuration
nano frontend/.env

# Edit staging configuration
nano backend/.env.staging

# Edit production configuration
nano backend/.env.production
```

### View Configuration
```bash
# View backend config
cat backend/.env

# View frontend config
cat frontend/.env

# Check Spring Boot properties
cat backend/src/main/resources/application.yml
```

---

## 🧹 Cleanup & Maintenance

### Clear Cache & Rebuild
```bash
# Docker cleanup
docker system prune
docker system prune -a
docker volume prune

# Maven cleanup
mvn clean

# Node.js cleanup
npm cache clean --force
rm -rf node_modules
npm install

# Full reset
docker-compose down -v
docker-compose up --build
```

### Remove Old Containers
```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove volumes
docker volume prune

# Complete cleanup
docker system prune -a --volumes
```

---

## 📋 Useful Aliases (Optional)

Add these to your `.bashrc` or equivalent for shortcuts:

```bash
alias dc='docker-compose'
alias up='docker-compose up -d'
alias down='docker-compose down'
alias logs='docker-compose logs -f'
alias restart='docker-compose restart'
alias mvn-build='mvn clean install'
alias npm-start='npm start'
alias npm-build='npm run build'
```

---

## 🎯 Common Workflows

### Complete Setup & Start
```bash
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)
docker-compose down -v
docker-compose up --build
# Wait 90 seconds
curl http://localhost:8080/api/health
# Open http://localhost:3000
```

### Backend Development
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend Development
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Test Everything
```bash
# Terminal 1
docker-compose up

# Terminal 2
curl http://localhost:8080/api/health
curl http://localhost:3000

# Terminal 3
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Clean Start
```bash
docker-compose down -v
rm -rf backend/target
rm -rf frontend/node_modules
rm -rf frontend/build
docker-compose up --build
```

---

## 📌 Quick Reference Card

| Task | Windows | Mac/Linux |
|------|---------|----------|
| Start App | `docker-compose up` | `docker-compose up` |
| View Logs | `docker-compose logs -f` | `docker-compose logs -f` |
| Stop App | `docker-compose down` | `docker-compose down` |
| Test API | `curl http://localhost:8080/api/health` | `curl http://localhost:8080/api/health` |
| Check Ports | `netstat -ano \| findstr :8080` | `lsof -i :8080` |
| Navigate | `cd path\to\folder` | `cd path/to/folder` |
| List Files | `dir` | `ls` |
| Edit File | `notepad file.txt` | `nano file.txt` |
| Copy File | `copy source dest` | `cp source dest` |
| Delete File | `del file.txt` | `rm file.txt` |

---

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web application |
| Backend API | http://localhost:8080/api | REST endpoints |
| Health Check | http://localhost:8080/api/health | Service status |
| MongoDB | mongodb://localhost:27017 | Database |
| MongoDB Shell | mongosh connection | Direct database access |

---

## ✅ Pre-Startup Checklist

```bash
# 1. Check Docker
docker --version
docker-compose --version

# 2. Check Java (if local dev)
java -version
mvn --version

# 3. Check Node (if local dev)
node --version
npm --version

# 4. Check ports available
# Windows: netstat -ano | findstr :8080
# Mac/Linux: lsof -i :8080

# 5. Navigate to project
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)

# 6. Start application
docker-compose up --build

# 7. Verify health
curl http://localhost:8080/api/health
```

---

**Bookmark this page for quick reference!**

Last Updated: January 2024
