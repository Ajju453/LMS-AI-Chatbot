# Git-VSCode Integration Hub - React/Spring Boot/MongoDB Stack

## 🚀 New Technology Stack

Your application has been completely rebuilt with:

- **Backend**: Java Spring Boot 3.2.0
- **Frontend**: React 18.2
- **Database**: MongoDB 7.0
- **Build & Deployment**: Docker & Docker Compose

## 📁 Project Structure

```
project/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/gitvc/
│   │   ├── GitVscodeHubApplication.java
│   │   ├── controller/
│   │   │   ├── GitConfigController.java
│   │   │   ├── SshKeyController.java
│   │   │   ├── TaskController.java
│   │   │   └── HealthController.java
│   │   ├── service/
│   │   │   ├── GitConfigService.java
│   │   │   ├── SshKeyService.java
│   │   │   └── TaskService.java
│   │   ├── repository/
│   │   │   ├── GitConfigRepository.java
│   │   │   ├── SshKeyRepository.java
│   │   │   └── TaskRepository.java
│   │   ├── model/
│   │   │   ├── GitConfig.java
│   │   │   ├── SshKey.java
│   │   │   └── Task.java
│   │   └── dto/
│   │       ├── GitConfigDTO.java
│   │       ├── SshKeyDTO.java
│   │       └── ApiResponse.java
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── GitConfigComponent.js
│   │   │   ├── SshKeyGeneratorComponent.js
│   │   │   ├── TaskManagerComponent.js
│   │   │   ├── TaskForm.js
│   │   │   └── TaskItem.js
│   │   ├── context/
│   │   │   └── UserContext.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── public/
│   │   │   └── index.html
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env
│
├── docker-compose.yml                # Docker Compose Configuration
└── README.md
```

## 🚀 Quick Start

### Option 1: Docker Compose (Easiest)

```bash
# Navigate to project root
cd /path/to/project

# Start all services
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080/api
# MongoDB: mongodb://localhost:27017
```

### Option 2: Local Development

#### Setup Backend (Java Spring Boot)

```bash
# Navigate to backend
cd backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run

# Backend will run on http://localhost:8080
```

#### Setup MongoDB

```bash
# Using Docker (recommended)
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  mongo:7.0

# Or install MongoDB locally and start the service
```

#### Setup Frontend (React)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend will run on http://localhost:3000
```

## 📊 API Endpoints

### Git Configuration
- `POST /api/git-config/save?userId={userId}` - Save Git configuration
- `GET /api/git-config/{userId}` - Get Git configuration
- `GET /api/git-config/{userId}/content` - Get .gitconfig file content
- `DELETE /api/git-config/{userId}` - Delete Git configuration

### SSH Keys
- `POST /api/ssh-keys/generate?userId={userId}` - Generate SSH key
- `GET /api/ssh-keys/{userId}` - Get user's SSH keys
- `GET /api/ssh-keys/{userId}/{email}` - Get specific SSH key
- `PUT /api/ssh-keys/{keyId}/activate` - Activate SSH key
- `PUT /api/ssh-keys/{keyId}/deactivate` - Deactivate SSH key
- `DELETE /api/ssh-keys/{keyId}` - Delete SSH key

### Tasks
- `POST /api/tasks?userId={userId}` - Create task
- `GET /api/tasks/{userId}` - Get all user tasks
- `GET /api/tasks/{userId}/active` - Get active tasks
- `GET /api/tasks/{userId}/completed` - Get completed tasks
- `PUT /api/tasks/{taskId}` - Update task
- `PUT /api/tasks/{taskId}/toggle` - Toggle task completion
- `DELETE /api/tasks/{taskId}` - Delete task

### Health Check
- `GET /api/health` - Check server health

## 🗄️ MongoDB Collections

### git_configs
```json
{
  "_id": "ObjectId",
  "userId": "user123",
  "userName": "abcd",
  "userEmail": "ab.gf@siemens.com",
  "autoCrlf": true,
  "symlinks": true,
  "fscache": true,
  "longpaths": true,
  "gitServerUrl": "https://code.siemens.com",
  "createdAt": "ISODate",
  "updatedAt": "ISODate"
}
```

### ssh_keys
```json
{
  "_id": "ObjectId",
  "userId": "user123",
  "email": "ab.gf@siemens.com",
  "keyType": "ed25519",
  "publicKey": "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5...",
  "keyPath": "/home/username/.ssh/id_ed25519",
  "fingerprint": "SHA256:...",
  "isActive": true,
  "createdAt": "ISODate",
  "expiresAt": "ISODate",
  "lastUsed": "ISODate"
}
```

### tasks
```json
{
  "_id": "ObjectId",
  "userId": "user123",
  "title": "Configure Git",
  "description": "Set up Git config for development",
  "completed": false,
  "priority": "high",
  "createdAt": "ISODate",
  "completedAt": null,
  "dueDate": "ISODate"
}
```

## 🛠️ Development

### Backend Development

```bash
cd backend

# Watch mode (auto-restart on changes)
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm start

# Run tests
npm test

# Build for production
npm run build
```

## 🔧 Configuration

### Backend (application.yml)

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/gitvc_db
      
server:
  port: 8080
  servlet:
    context-path: /api
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8080/api
```

## 📦 Dependencies

### Backend
- Spring Boot 3.2.0
- Spring Data MongoDB
- Lombok
- Validation API

### Frontend
- React 18.2
- React Bootstrap 5.3
- Axios 1.6
- FontAwesome 6.4
- React Router 6.20

### Database
- MongoDB 7.0

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild a specific service
docker-compose up --build backend

# Run a specific service
docker-compose up frontend
```

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Environment Variables

### Backend (application.yml)
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `SPRING_APPLICATION_NAME` - Application name
- `SERVER_PORT` - Server port

### Frontend (.env)
- `REACT_APP_API_URL` - Backend API URL

## 🔐 Security Notes

- Backend validates all inputs
- CORS configured for localhost (update for production)
- MongoDB authentication enabled
- SSH keys generated locally, never transmitted
- No credentials stored in code

## 📊 Monitoring & Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

## 🚀 Deployment

### Production Checklist

- [ ] Update MongoDB URI to production database
- [ ] Configure CORS for production domain
- [ ] Enable SSL/TLS
- [ ] Set environment variables properly
- [ ] Configure backup strategy for MongoDB
- [ ] Set up monitoring and alerting
- [ ] Use secrets manager for sensitive data
- [ ] Create deployment CI/CD pipeline

## ❓ Troubleshooting

### Backend won't start

```bash
# Check if port 8080 is in use
lsof -i :8080
# or
netstat -ano | findstr :8080

# Check logs
docker-compose logs backend
```

### MongoDB connection fails

```bash
# Check if MongoDB is running
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Frontend can't connect to backend

```bash
# Ensure backend is running
curl http://localhost:8080/api/health

# Check CORS configuration
# Verify REACT_APP_API_URL in .env
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Docker Documentation](https://docs.docker.com)
- [Bootstrap Documentation](https://getbootstrap.com/docs)

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs`
2. Verify all services are running: `docker-compose ps`
3. Test API health: `curl http://localhost:8080/api/health`
4. Clear and rebuild: `docker-compose down -v && docker-compose up --build`

## ✅ What's Ready

- ✅ Spring Boot REST API - Fully functional
- ✅ MongoDB Integration - Collections and schemas
- ✅ React Frontend - All components built
- ✅ Docker Setup - Ready to deploy
- ✅ CORS Configuration - Frontend-Backend communication
- ✅ Input Validation - Server-side validation
- ✅ Error Handling - Comprehensive error responses

## 🎯 Next Steps

1. Start with Docker Compose: `docker-compose up --build`
2. Access frontend: `http://localhost:3000`
3. Configure your Git settings
4. Generate SSH keys
5. Manage your tasks

**Happy coding!** 🚀
