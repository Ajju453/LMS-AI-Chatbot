# 🚀 QUICK START GUIDE - Git VSCode Integration Hub (Java/React/MongoDB Stack)

## What Was Created

Your application has been completely rebuilt with:

✅ **Spring Boot Backend** (Java 17) - REST API for Git/SSH/Task management  
✅ **React Frontend** (React 18) - Beautiful, responsive user interface  
✅ **MongoDB Database** (MongoDB 7.0) - Scalable data persistence  
✅ **Docker Containerization** - One-command deployment  

Features:
- 🔧 **Git Configuration Manager** - Configure Git settings for Siemens server
- 🔑 **SSH Key Generator** - Create ED25519 or RSA SSH keys
- ✅ **Task Manager** - Organize and track development tasks
- 🐳 **Production Ready** - Full-stack application with best practices

## ⚡ 5-Minute Setup (Docker - Recommended)

### Step 1: Navigate to Project
```bash
cd "c:\Users\Z00588XV\Desktop\New folder (2)"
```

### Step 2: Start All Services
```bash
docker-compose up --build
```

This command orchestrates:
- Spring Boot backend (port 8080)
- React frontend (port 3000)
- MongoDB database (port 27017)

Wait for all services to start (look for "Compiled successfully!" in output).

### Step 3: Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/api/health

### Step 4: Configure Git
1. Open http://localhost:3000 in your browser
2. Click **"Git Setup"** tab
3. Fill in your Git username and email
4. Click **"Save Configuration"**
5. Download or copy the `.gitconfig` file

### Step 5: Generate SSH Keys
1. Go to **"SSH Keys"** sub-tab
2. Enter your email address
3. Click **"Generate SSH Key"**
4. Copy the public key and add it to code.siemens.com

### Step 6: Manage Tasks
1. Click **"Tasks"** tab
2. Create, update, or complete your development tasks
3. Filter by status (All/Active/Completed)

## 📁 Project Structure

```
project/
├── backend/                    # Spring Boot Java Application
│   ├── src/main/java/com/gitvc/
│   │   ├── controller/         # REST endpoints
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Data access
│   │   ├── model/              # MongoDB documents
│   │   └── dto/                # Data transfer objects
│   ├── pom.xml                 # Maven dependencies
│   ├── Dockerfile              # Container build
│   └── .env                    # Configuration
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── services/           # API client (axios)
│   │   ├── context/            # State management
│   │   ├── App.js              # Main component
│   │   └── App.css             # Styling
│   ├── package.json            # NPM dependencies
│   ├── Dockerfile              # Container build
│   └── .env                    # Configuration
│
├── docker-compose.yml          # Orchestration
├── init-mongo.js               # Database initialization
├── STACK_MIGRATION.md          # Complete documentation
└── QUICK_START.md              # This file
```

## 🐳 Docker Commands

## 🐳 Docker Commands

```bash
# View status of all services
docker-compose ps

# View live logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Restart a service
docker-compose restart backend

# Stop all services (keeps data)
docker-compose down

# Stop all services and delete everything
docker-compose down -v

# Rebuild specific service
docker-compose up --build backend
```

## 📋 Local Development Setup (Without Docker)

### Backend Setup (Java Spring Boot)

**Prerequisites:**
- Java 17+ (check with `java -version`)
- Maven 3.9+ (check with `mvn -version`)

```bash
cd backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run

# Backend runs at: http://localhost:8080/api
```

### MongoDB Setup

```bash
# Using Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:7.0

# Update backend/.env with:
# SPRING_DATA_MONGODB_URI=mongodb://admin:admin123@localhost:27017/gitvc_db?authSource=admin
```

### Frontend Setup (React)

**Prerequisites:**
- Node.js 18+ (check with `node -version`)
- npm 9+ (check with `npm -version`)

```bash
cd frontend

# Install dependencies
npm install

# Start development server with hot reload
npm start

# Frontend runs at: http://localhost:3000
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port (Windows)
netstat -ano | findstr :8080

# Kill the process (Windows)
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :8080
kill -9 <PID>
```

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
docker-compose logs mongodb

# Verify connection string in backend/.env
# Should be: mongodb://admin:admin123@localhost:27017/gitvc_db?authSource=admin
```

### Frontend Can't Connect to Backend
1. Verify backend is running: `curl http://localhost:8080/api/health`
2. Check `REACT_APP_API_URL` in `frontend/.env`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Hard refresh browser (Ctrl+F5)

### "Cannot connect to Docker daemon"
- Ensure Docker Desktop is running
- On Linux: `sudo systemctl start docker`

### Build Fails
```bash
# Clean and rebuild everything
docker-compose down -v
docker-compose up --build --no-cache
```

## 📝 Configuration Files

### Backend Configuration: `backend/.env`
```
SERVER_PORT=8080
SPRING_DATA_MONGODB_URI=mongodb://admin:admin123@localhost:27017/gitvc_db?authSource=admin
SPRING_PROFILES_ACTIVE=dev
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration: `frontend/.env`
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_API_TIMEOUT=30000
```

Change these to match your environment (development/staging/production).

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START.md` | Getting started (this file) |
| `STACK_MIGRATION.md` | Complete technical documentation |
| `docker-compose.yml` | Service orchestration |
| `init-mongo.js` | Database initialization |
| `backend/pom.xml` | Java dependencies |
| `frontend/package.json` | Node.js dependencies |

## 🎯 Application Features

### Git Setup Tab
- ✅ Configure Git username/email
- ✅ Download `.gitconfig` file
- ✅ Enable/disable Git core settings
- ✅ Copy configuration to clipboard

### SSH Keys Tab
- ✅ Generate ED25519 or RSA keys
- ✅ Display public key
- ✅ Download key files
- ✅ View key fingerprint
- ✅ Activation status tracking

### Tasks Tab
- ✅ Create tasks with priority
- ✅ Mark tasks as complete
- ✅ Filter by status (All/Active/Completed)
- ✅ Delete tasks
- ✅ Task persistence in MongoDB

## 🔐 Security Notes

🔒 **Never commit to Git:**
- `.env` files with credentials
- Private SSH keys
- Passwords or API keys
- MongoDB credentials

✅ **Best Practices:**
- Use generated `.gitignore` files (already included)
- SSH keys stored locally, never transmitted
- Input validation on frontend and backend
- CORS configured for specific origins

## 📊 API Endpoints

### Git Configuration
- `POST /api/git-config/save` - Save configuration
- `GET /api/git-config/{userId}` - Get configuration
- `GET /api/git-config/{userId}/content` - Get .gitconfig content

### SSH Keys
- `POST /api/ssh-keys/generate` - Generate new key
- `GET /api/ssh-keys/{userId}` - List user's keys
- `DELETE /api/ssh-keys/{keyId}` - Delete key

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/{userId}` - Get all tasks
- `PUT /api/tasks/{taskId}/toggle` - Toggle completion

See `STACK_MIGRATION.md` for complete API documentation.

## 💡 Tips & Tricks

1. **Hot Reload**: Frontend auto-refreshes, backend requires restart
2. **Sample Data**: MongoDB initializes with sample data
3. **Logs**: Always check `docker-compose logs` for errors
4. **Clean Start**: `docker-compose down -v && docker-compose up --build`
5. **Development**: Use local setup for faster development iteration

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot GET /" | Frontend not compiled yet, wait 30 seconds |
| API returns 502 | Backend not ready, check `docker-compose logs` |
| Database empty | Init script not run, restart MongoDB container |
| Changes not showing | Clear browser cache (Ctrl+Shift+Delete) |
| Port 3000/8080 in use | Kill process or change docker-compose ports |

## 🚀 Next Steps

1. **Docker Compose**: `docker-compose up --build` ✅
2. **Access Frontend**: http://localhost:3000 ✅
3. **Configure Git**: Fill in your Git settings ✅
4. **Generate SSH Keys**: Create your SSH key ✅
5. **Manage Tasks**: Create and organize tasks ✅
6. **Production Deployment**: See `STACK_MIGRATION.md` ✅

---

## 📞 Support Resources

- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **React Docs**: https://react.dev
- **MongoDB Docs**: https://docs.mongodb.com
- **Docker Docs**: https://docs.docker.com
- **Axios Docs**: https://axios-http.com

---

🎉 **Ready to use!** Run `docker-compose up --build` to start your Git VSCode Integration Hub!
