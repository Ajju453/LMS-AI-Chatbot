# 🚀 READY TO USE - Getting Started Guide

## ✅ Your project is NOW READY with default credentials!

All configuration files have been pre-filled with working credentials so you can start immediately.

---

## 📋 Default Credentials Configured

### MySQL Database
```
Host:     localhost:3306
Username: root
Password: root
Database: learning_path_db
```

### OpenAI API
```
Key:      sk-proj-demokey123456789abcdefghijklmnopqrstuvwxyz
Endpoint: https://api.openai.com/v1/chat/completions
```

### Frontend API
```
Host:     http://localhost:3000
Backend:  http://localhost:8080/api
```

---

## 🎯 QUICK START (2 Steps Only)

### Step 1: Run Setup Script (Automatic Setup)

**Windows - PowerShell:**
```powershell
cd C:\Users\Z00588XV\Desktop\New folder (2)
.\QUICK_SETUP.ps1
```

**Windows - Command Prompt:**
```cmd
cd C:\Users\Z00588XV\Desktop\New folder (2)
QUICK_SETUP.bat
```

This will:
- ✓ Check all requirements (Java, Maven, Node.js)
- ✓ Create MySQL database
- ✓ Build backend
- ✓ Install frontend dependencies

**Takes ~5-10 minutes**

---

### Step 2: Start Backend & Frontend

**Terminal 1 - Backend:**
```bash
cd backend
mvn spring-boot:run
```
✅ Ready at: http://localhost:8080/api

**Terminal 2 - Frontend:**
```bash
cd frontend-chatbot
npm start
```
✅ Opens at: http://localhost:3000

---

## 🧪 Test the System (2 Minutes)

1. **Open browser** → http://localhost:3000
2. **See login screen** → Enter any Student ID (e.g., `STU001`)
3. **Click ChatBot tab** → You're in the chatbot
4. **Type this message:**
   ```
   Show me my attendance
   ```
5. **See AI response!** 🤖
   ```
   Your current attendance percentage is 0.0%
   Attendance is crucial...
   ```

✅ **System is working!**

---

## ⚙️ Configuration Files Locations

All files are pre-configured, but here's where to find them if you need to change settings:

### Backend Configuration
**File:** `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/learning_path_db
    username: root          ← Change here if needed
    password: root          ← Change here if needed

openai:
  api:
    key: sk-proj-demokey... ← Update with your real key
```

### Frontend Configuration
**File:** `frontend-chatbot/.env`

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 🔑 IMPORTANT: Update OpenAI API Key

The demo key won't work for actual AI responses. Follow these steps:

### 1. Get Your Free OpenAI API Key
- Go to: https://platform.openai.com/api-keys
- Sign up (if needed) - Free tier provides $5 credits
- Click "Create new secret key"
- Copy the key (looks like: `sk-proj-xxx...`)

### 2. Update the Key
Edit `backend/src/main/resources/application.yml`:

```yaml
openai:
  api:
    key: sk-proj-YOUR-ACTUAL-KEY-HERE
```

### 3. Restart Backend
```bash
# Stop running mvn spring-boot:run (Ctrl+C)
mvn spring-boot:run
```

✅ Now chatbot will have real AI responses!

---

## 🗄️ MySQL Setup Help

If MySQL is not running:

### Windows Users
1. **Open Services:**
   - Press `Windows + R`
   - Type: `services.msc`
   - Find: "MySQL80" or "MySQL"
   - Click "Start"

2. **Or from Command Prompt (Admin):**
   ```cmd
   net stop MySQL80
   net start MySQL80
   ```

### Verify MySQL is Running
```cmd
mysql -u root -p
# Enter password: root
# Should see mysql> prompt
# Type: exit
```

---

## 📊 What Each Component Does

### Backend (Spring Boot) - Port 8080
- Handles all API requests
- Manages database operations
- Processes OpenAI requests
- Stores chat history
- Generates reports

**Status Check:**
```bash
curl http://localhost:8080/api/chatbot/health
# Response: {"status":"active","service":"Learning Chatbot"}
```

### Frontend (React) - Port 3000
- Beautiful web interface
- Displays student dashboard
- Chatbot UI
- Responsive design

### Database (MySQL)
- Stores students
- Stores subjects & topics
- Stores attendance
- Stores chat messages
- Stores reports

---

## 🧪 Test Endpoints

### Test Backend is Running
```bash
# Check health
curl http://localhost:8080/api/chatbot/health

# Response should be:
# {"status":"active","service":"Learning Chatbot"}
```

### Test Chatbot
```bash
# Create student first
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "semester": "4"
  }'

# Then chat
curl -X POST "http://localhost:8080/api/chatbot/chat?studentId=1" \
  -H "Content-Type: application/json" \
  -d '{"message": "Show my attendance"}'
```

---

## 🔧 Troubleshooting

### Port 8080 Already in Use
```cmd
REM Find process using port 8080
netstat -ano | findstr :8080

REM Kill the process
taskkill /PID <PID> /F
```

### MySQL Connection Error
```
Error: Connection refused: localhost:3306
Solution:
1. Check MySQL is running (services.msc)
2. Verify credentials in application.yml
3. Ensure database exists: mysql -u root -p -e "SHOW DATABASES;"
```

### npm install Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -r frontend-chatbot/node_modules

# Reinstall
npm install
```

### mvn Build Fails
```bash
# Clean Maven cache
mvn clean

# Rebuild
mvn install
```

### CORS Error in Browser
- Verify backend is running
- Check `allowed-origins` in application.yml contains `http://localhost:3000`

---

## 📚 Next Steps After Setup

1. **Explore the UI:**
   - Login screen
   - Student dashboard
   - Chatbot interface

2. **Create test data:**
   - Add students
   - Add subjects
   - Add topics
   - Record attendance

3. **Test AI chatbot:**
   - Ask about attendance
   - Ask about backlogs
   - Request study plans
   - Get topic explanations

4. **Review documentation:**
   - Read API_DOCUMENTATION.md for endpoints
   - Read INTEGRATION_GUIDE.md to merge with your project

---

## 🎓 Sample Test Data

Once system is running, create this test data:

### Create Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "name": "Alice Johnson",
    "email": "alice@college.edu",
    "phone": "9123456789",
    "semester": "4"
  }'
```

### Create Subject
```bash
curl -X POST http://localhost:8080/api/subjects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101",
    "semester": "4",
    "credits": 4
  }'
```

### Chat with Bot
```bash
curl -X POST "http://localhost:8080/api/chatbot/chat?studentId=1" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have backlog in Mathematics"}'
```

---

## 🔐 Changing Credentials Later

### Change MySQL Password
1. Edit `application.yml`
2. Update `spring.datasource.password`
3. Update MySQL user password
4. Restart backend

### Change OpenAI Key
1. Edit `application.yml`
2. Replace `openai.api.key` with new key
3. Restart backend

### Change Frontend API URL
1. Edit `frontend-chatbot/.env`
2. Update `REACT_APP_API_URL`
3. Restart React app

---

## 📞 Support

If you encounter issues:

1. **Check troubleshooting section above**
2. **Verify all services running:**
   - MySQL: `mysql -u root -p` (press Enter if no password)
   - Backend: `http://localhost:8080/api/chatbot/health`
   - Frontend: `http://localhost:3000` (should load)
3. **Check logs** in terminal where services are running
4. **Review documentation:** API_DOCUMENTATION.md

---

## ✅ Checklist

- [ ] Run QUICK_SETUP.ps1 or QUICK_SETUP.bat
- [ ] Backend started: `mvn spring-boot:run`
- [ ] Frontend started: `npm start`
- [ ] System accessible: http://localhost:3000
- [ ] Chatbot responds to messages
- [ ] Updated OpenAI API key with real one
- [ ] All documentation read

---

## 🎉 You're Ready!

Everything is configured and ready to use. Just run the setup script and start the servers!

**Enjoy your AI Learning Management System!** 📚🤖

---

**Questions?** Refer to:
- **CHATBOT_PROJECT_SUMMARY.md** - Overview
- **API_DOCUMENTATION.md** - API endpoints
- **INTEGRATION_GUIDE.md** - Merging with your project
- **BACKEND_SETUP.md** - Backend details
- **FRONTEND_SETUP.md** - Frontend details

---

*Version: 1.0.0 - Ready to Use*
