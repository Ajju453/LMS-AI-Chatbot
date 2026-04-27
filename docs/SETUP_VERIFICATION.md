# 🔍 Setup Verification Checklist

Use this checklist to verify your Java/React/MongoDB stack is properly configured and ready to run.

## ✅ Pre-Check (Before Starting)

- [ ] Docker Desktop is installed and running
- [ ] You have at least 4GB free disk space
- [ ] Port 3000, 8080, and 27017 are available (not in use)
- [ ] Git is installed (`git --version`)
- [ ] You can access the project directory

## ✅ File Structure Verification

### Backend Files
```
backend/
├── pom.xml ............................ ✅ Maven configuration
├── Dockerfile ......................... ✅ Container build
├── .env .............................. ✅ Environment variables
├── .gitignore ........................ ✅ Git ignore rules
└── src/main/java/com/gitvc/
    ├── GitVscodeHubApplication.java
    ├── controller/..................... ✅ REST endpoints
    │   ├── GitConfigController.java
    │   ├── SshKeyController.java
    │   ├── TaskController.java
    │   └── HealthController.java
    ├── service/........................ ✅ Business logic
    │   ├── GitConfigService.java
    │   ├── SshKeyService.java
    │   └── TaskService.java
    ├── repository/..................... ✅ Data access
    │   ├── GitConfigRepository.java
    │   ├── SshKeyRepository.java
    │   └── TaskRepository.java
    ├── model/.......................... ✅ Entities
    │   ├── GitConfig.java
    │   ├── SshKey.java
    │   └── Task.java
    └── dto/............................ ✅ DTOs
        ├── GitConfigDTO.java
        ├── SshKeyDTO.java
        └── ApiResponse.java
```

### Frontend Files
```
frontend/
├── package.json ...................... ✅ NPM dependencies
├── Dockerfile ........................ ✅ Container build
├── .env ............................. ✅ Environment variables
├── .gitignore ....................... ✅ Git ignore rules
└── src/
    ├── components/.................... ✅ React components
    │   ├── GitConfigComponent.js
    │   ├── SshKeyGeneratorComponent.js
    │   ├── TaskManagerComponent.js
    │   ├── TaskForm.js
    │   └── TaskItem.js
    ├── context/
    │   └── UserContext.js
    ├── services/
    │   └── api.js
    ├── public/
    │   └── index.html
    ├── App.js
    ├── App.css
    └── index.js
```

### Root Files
```
Project Root/
├── docker-compose.yml ............ ✅ Service orchestration
├── init-mongo.js ................. ✅ MongoDB initialization
├── QUICK_START.md ................. ✅ Setup guide (this file)
├── STACK_MIGRATION.md ............. ✅ Complete documentation
├── backend/.gitignore ............ ✅ Backend git ignore
├── backend/.env .................. ✅ Backend config
├── frontend/.gitignore ........... ✅ Frontend git ignore
├── frontend/.env ................. ✅ Frontend config
└── .gitignore ..................... ✅ Root git ignore
```

**Check**: If any files are missing, they'll need to be created.

## ✅ Configuration Verification

### Backend Configuration (backend/.env)

Verify `backend/.env` contains:
```
✅ SERVER_PORT=8080
✅ SPRING_DATA_MONGODB_URI=mongodb://admin:admin123@localhost:27017/gitvc_db?authSource=admin
✅ SPRING_PROFILES_ACTIVE=dev
✅ CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Check Command:**
```bash
cat backend/.env
```

### Frontend Configuration (frontend/.env)

Verify `frontend/.env` contains:
```
✅ REACT_APP_API_URL=http://localhost:8080/api
✅ REACT_APP_API_TIMEOUT=30000
```

**Check Command:**
```bash
cat frontend/.env
```

## ✅ Docker Verification

### Step 1: Check Docker Installation
```bash
docker --version
# Should output: Docker version XX.XX.X
```
✅ **Pass** if version is shown | ❌ **Fail** if command not found

### Step 2: Start Docker Desktop (if not running)
- Windows: Open "Docker Desktop" application
- Mac: Open "Docker.app" from Applications
- Linux: `sudo systemctl start docker`

Wait 30 seconds for Docker to fully start.

### Step 3: Check Docker Daemon
```bash
docker ps
# Should output: CONTAINER ID   IMAGE   COMMAND   STATUS   PORTS   NAMES
```
✅ **Pass** if shows container list (empty OK) | ❌ **Fail** if error

### Step 4: Check Docker Compose
```bash
docker-compose --version
# Should output: Docker Compose version XX.XX.X
```
✅ **Pass** if version is shown | ❌ **Fail** if command not found

## ✅ Pre-Startup Testing

### Test 1: Verify docker-compose.yml syntax
```bash
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)
docker-compose config
```
✅ **Pass** if shows YAML output | ❌ **Fail** if syntax error

### Test 2: Check available disk space
```bash
# Windows (PowerShell)
(Get-Volume C:).FreeSpace / 1GB

# Mac/Linux
df -h /
```
✅ **Pass** if > 4GB available | ❌ **Fail** if < 4GB

### Test 3: Verify port availability
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :27017

# Should return nothing if ports are free
```
✅ **Pass** if no results | ❌ **Fail** if ports in use

## ✅ Startup Verification

### Run Docker Compose
```bash
cd c:\Users\Z00588XV\Desktop\New\ folder\ \(2\)
docker-compose up --build
```

### Watch for These Success Indicators:

**MongoDB Container (First)**
```
✅ mongodb | 2024-01-15 10:30:45 I CONTROL  [initandlisten] Successfully waited for the server to start listening on port 27017
✅ mongodb | [init] gitvc_db has already been initialized
✅ mongodb | ✓ MongoDB Initialization Complete
```

**Backend Container (Second)**
```
✅ backend | Started GitVscodeHubApplication in XX.XXX seconds (JVM running for XX.XXX)
✅ backend | Application startup is complete
```

**Frontend Container (Third)**
```
✅ frontend | Compiled successfully!
✅ frontend | webpack compiled...
✅ frontend | Listening on port 3000
```

### Expected Log Output Summary
```
mongodb is healthy ✅
backend is healthy ✅
frontend is healthy ✅
```

**Total startup time**: ~60-90 seconds

## ✅ Connectivity Testing

### Test 1: Backend Health Check
Open a new terminal and run:
```bash
curl http://localhost:8080/api/health
```
Expected response:
```json
{
  "status": "UP"
}
```
✅ **Pass** if JSON response | ❌ **Fail** if no response or error

### Test 2: Frontend Access
Open browser and navigate to:
```
http://localhost:3000
```
Expected: React application loads with navigation bar and tabs
✅ **Pass** if page loads | ❌ **Fail** if blank page or error

### Test 3: MongoDB Connection
```bash
docker-compose exec mongodb mongosh -u admin -p admin123
```
In the MongoDB shell:
```javascript
show dbs
# Should show databases including: gitvc_db
use gitvc_db
show collections
# Should show: git_configs, ssh_keys, tasks
db.git_configs.countDocuments()
# Should show: 1 or more
```
✅ **Pass** if shows collections | ❌ **Fail** if no collections

### Test 4: Git Config API
```bash
curl http://localhost:8080/api/git-config/user123
```
Expected response (may be empty initially):
```json
{}
```
✅ **Pass** if JSON response | ❌ **Fail** if error

## ✅ Functional Testing

### Git Configuration
1. Open http://localhost:3000
2. Click **"Git Setup"** tab
3. Enter username: `TestUser`
4. Enter email: `test@example.com`
5. Click **"Save Configuration"**

Expected:
- ✅ No errors shown
- ✅ Data persists in MongoDB
- ✅ Form can be reloaded with saved data

### SSH Key Generation
1. Click **"SSH Keys"** sub-tab
2. Enter email: `test@example.com`
3. Click **"Generate SSH Key"**

Expected:
- ✅ Key generated successfully
- ✅ Public key displayed
- ✅ Fingerprint calculated

### Task Management
1. Click **"Tasks"** tab
2. Enter title: `Test Task`
3. Click **"Add Task"**

Expected:
- ✅ Task appears in list
- ✅ Can mark as complete
- ✅ Can delete task

## ✅ Troubleshooting Checklist

### If Backend Won't Start
- [ ] Check port 8080 is free: `netstat -ano | findstr :8080`
- [ ] Check MongoDB is running: `docker-compose logs mongodb`
- [ ] Check connection string in `backend/.env`
- [ ] Clear Docker cache: `docker-compose down -v && docker-compose up --build`

### If Frontend Won't Start
- [ ] Check port 3000 is free: `netstat -ano | findstr :3000`
- [ ] Check `frontend/.env` has correct API_URL
- [ ] Clear npm cache: `rm -rf frontend/node_modules && npm install`
- [ ] Check console for JavaScript errors (F12)

### If MongoDB Won't Initialize
- [ ] Check init-mongo.js exists in root directory
- [ ] Check MongoDB logs: `docker-compose logs mongodb`
- [ ] Verify credentials in docker-compose.yml
- [ ] Remove volume: `docker-compose down -v`

### If API Returns 503/502
- [ ] Check backend logs: `docker-compose logs backend`
- [ ] Verify MongoDB is running: `docker-compose ps mongodb`
- [ ] Check CORS configuration in application.yml
- [ ] Restart backend: `docker-compose restart backend`

## ✅ Performance Verification

### Expected Performance Metrics:
- **Frontend load time**: < 3 seconds
- **Backend response time**: < 500ms
- **API health check**: < 100ms
- **Database query**: < 200ms
- **Startup time**: 60-90 seconds total

### Monitor Performance:
```bash
# Watch container resource usage
docker stats

# Expected:
# MongoDB: ~50-100MB memory
# Backend: ~300MB memory
# Frontend: ~150MB memory
```

## ✅ Security Verification

- [ ] `.env` files are in `.gitignore` (not committed)
- [ ] `node_modules/` is in `.gitignore`
- [ ] `target/` is in `.gitignore`
- [ ] MongoDB credentials not hardcoded in code
- [ ] CORS only allows localhost for development
- [ ] SSH keys never stored in repository

## ✅ Final Checklist Before Production

Before deploying to production, ensure:

- [ ] All unit tests pass: `mvn test` (backend), `npm test` (frontend)
- [ ] No console errors in browser
- [ ] All API endpoints tested manually
- [ ] Logs configured for production
- [ ] CORS updated for production domain
- [ ] MongoDB backups configured
- [ ] SSL/TLS certificates installed
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] CORS origins updated

## 📝 Verification Report Template

```
═══════════════════════════════════════════════════════════════
         SETUP VERIFICATION REPORT
═══════════════════════════════════════════════════════════════

Date: [TODAY]
System: [Windows/Mac/Linux]
Docker Version: [VERSION]

FILE STRUCTURE: ✅ PASS / ❌ FAIL
CONFIGURATION: ✅ PASS / ❌ FAIL
DOCKER SETUP: ✅ PASS / ❌ FAIL
CONNECTIVITY: ✅ PASS / ❌ FAIL
FUNCTIONALITY: ✅ PASS / ❌ FAIL
PERFORMANCE: ✅ PASS / ❌ FAIL
SECURITY: ✅ PASS / ❌ FAIL

OVERALL STATUS: ✅ READY FOR PRODUCTION / ⚠️ NEEDS FIXES

Issues Found:
- [List any issues]

Next Steps:
- [List next steps]

═══════════════════════════════════════════════════════════════
```

## 🎯 Success Criteria

All checks pass ✅ if:
1. All required files exist
2. `docker-compose up --build` completes without errors
3. Frontend loads at http://localhost:3000
4. Backend API responds at http://localhost:8080/api/health
5. MongoDB contains collections
6. Git config can be saved and retrieved
7. SSH keys can be generated
8. Tasks can be created and managed

---

**Status**: Ready for deployment once all items are checked! 🚀
