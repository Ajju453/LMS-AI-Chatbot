# ⚡ QUICK REFERENCE CARD

## 🚀 Quick Start (Copy-Paste Ready)

### Terminal 1 - Backend
```bash
cd backend
mvn spring-boot:run
```
✅ Ready at: **http://localhost:8080/api**

### Terminal 2 - Frontend  
```bash
cd frontend-chatbot
npm start
```
✅ Opens at: **http://localhost:3000**

---

## 🔑 Credentials

| Service | Host | User | Password |
|---------|------|------|----------|
| **MySQL** | localhost:3306 | root | root |
| **Backend API** | localhost:8080/api | - | - |
| **Frontend** | localhost:3000 | Any ID | - |
| **OpenAI** | api.openai.com | sk-proj-demo... | ⚠ Update needed |

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/src/main/resources/application.yml` | DB & OpenAI config |
| `frontend-chatbot/.env` | Frontend API URL |
| `GETTING_STARTED.md` | Complete setup guide |
| `API_DOCUMENTATION.md` | All endpoints |

---

## 💻 Common Commands

```bash
# Build backend
cd backend && mvn clean install

# Build frontend
cd frontend-chatbot && npm install

# Start backend
mvn spring-boot:run

# Start frontend
npm start

# Test backend
curl http://localhost:8080/api/chatbot/health

# Test MySQL
mysql -u root -p -e "USE learning_path_db; SHOW TABLES;"
```

---

## 🤖 Test Chatbot

**Create Student:**
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"studentId":"STU001","name":"John","email":"john@college.edu","phone":"9876543210","semester":"4"}'
```

**Chat:**
```bash
curl -X POST "http://localhost:8080/api/chatbot/chat?studentId=1" \
  -H "Content-Type: application/json" \
  -d '{"message":"Show my attendance"}'
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | `taskkill /PID <PID> /F` |
| MySQL not running | Start MySQL service |
| npm error | `npm cache clean --force` |
| CORS error | Check MySQL, restart backend |
| AI not responding | Update OpenAI API key |

---

## 📌 Update OpenAI Key

1. Get key: https://platform.openai.com/api-keys
2. Edit: `backend/src/main/resources/application.yml`
3. Replace: `openai.api.key: sk-proj-YOUR-KEY`
4. Restart backend: `mvn spring-boot:run`

---

## 🧪 Test URLs

- **Health:** http://localhost:8080/api/chatbot/health
- **Frontend:** http://localhost:3000
- **API Docs:** See API_DOCUMENTATION.md

---

## 📊 Database

```yaml
Database: learning_path_db
User: root
Password: root
Tables: 7 (students, subjects, topics, attendance, student_subjects, chat_messages, student_reports)
```

---

## ✅ TODO

- [ ] Run `QUICK_SETUP.ps1` or `QUICK_SETUP.bat`
- [ ] Start backend: `mvn spring-boot:run`
- [ ] Start frontend: `npm start`
- [ ] Test: http://localhost:3000
- [ ] Get real OpenAI key
- [ ] Update key in `application.yml`
- [ ] Enjoy! 🎉

---

**Read GETTING_STARTED.md for detailed steps**
