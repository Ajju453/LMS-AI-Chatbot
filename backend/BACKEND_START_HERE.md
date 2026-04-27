# 🔧 Spring Boot Backend - Complete Setup & Organization

## ✅ Backend Folder Status

The `backend/` folder contains a **Spring Boot Java backend** for the Learning Path LMS.

---

## 📂 Complete Backend Structure

```
backend/                                   ← Spring Boot Backend
│
├── 📄 BACKEND_START_HERE.md              ← START HERE for backend
├── 📄 pom.xml                            ← Maven dependencies & build config
├── 📄 .env (environment)                 ← Configuration files
├── 📄 .env.staging
├── 📄 .env.production
│
├── 🚀 Logs
│   ├── backend.log
│   ├── startup.log
│   └── startup_log.txt
│
├── 📦 src/main/java/com/learningpath/   ← Java Source Code
│   │
│   ├── LearningPathApplication.java      ✨ Main Spring Boot app
│   │
│   ├── chatbot/                          ← AI Chatbot integrations
│   │   ├── ChatbotController.java
│   │   ├── ChatbotService.java
│   │   └── OpenAIClient.java
│   │
│   ├── controllers/                      ← REST API endpoints
│   │   ├── CourseController.java
│   │   ├── UserController.java
│   │   ├── LearningPathController.java
│   │   └── ProgressController.java
│   │
│   ├── models/                          ← Data models/entities
│   │   ├── User.java
│   │   ├── Course.java
│   │   ├── LearningPath.java
│   │   ├── Progress.java
│   │   └── Task.java
│   │
│   ├── repositories/                    ← Database access (JPA)
│   │   ├── UserRepository.java
│   │   ├── CourseRepository.java
│   │   └── ProgressRepository.java
│   │
│   ├── services/                        ← Business logic
│   │   ├── UserService.java
│   │   ├── CourseService.java
│   │   ├── LearningPathService.java
│   │   └── ProgressService.java
│   │
│   └── config/                          ← Spring configurations
│       ├── SecurityConfig.java
│       ├── CorsConfig.java
│       └── DatabaseConfig.java
│
├── 📦 src/main/resources/               ← Configuration files
│   └── application.yml                  ← Spring Boot config
│
├── 📦 src/test/                        ← Unit tests
│   ├── java/com/learningpath/
│   └── resources/
│
├── 🐳 Dockerfile                        ← Docker configuration
├── 📊 target/                           ← Build artifacts (Maven)
│   ├── classes/
│   ├── generated-sources/
│   └── test-classes/
│
└── .github/                             ← GitHub workflows
```

---

## 🎯 Quick Start - Backend

### **Option 1: Using Maven (Recommended)**
```powershell
cd "C:\Users\Z00588XV\Desktop\New folder (2)\backend"

# Clean and build
mvn clean install

# Run Spring Boot app
mvn spring-boot:run
```

✅ Backend runs at **http://localhost:8080**

### **Option 2: Build and Run JAR**
```powershell
cd "C:\Users\Z00588XV\Desktop\New folder (2)\backend"

# Build JAR
mvn clean package

# Run
java -jar target/learning-path-0.0.1-SNAPSHOT.jar
```

### **Option 3: Docker**
```powershell
cd "C:\Users\Z00588XV\Desktop\New folder (2)\backend"

# Build Docker image
docker build -t learning-path-backend .

# Run container
docker run -p 8080:8080 learning-path-backend
```

---

## 📋 Backend Components

### **1. LearningPathApplication.java**
- Main Spring Boot application class
- Entry point for the backend
- Initializes database and services

### **2. Chatbot Module** (`chatbot/`)
- `ChatbotController.java` - REST endpoints for chat
- `ChatbotService.java` - Chat logic
- `OpenAIClient.java` - OpenAI API integration

### **3. Controllers** (`controllers/`)
Handles HTTP requests:
- `CourseController` - Course CRUD operations
- `UserController` - User management
- `LearningPathController` - Learning paths
- `ProgressController` - Progress tracking

### **4. Models** (`models/`)
Data entities mapped to database:
- `User` - Student/teacher info
- `Course` - Course details
- `LearningPath` - Path definition
- `Progress` - User progress tracking
- `Task` - Learning tasks

### **5. Repositories** (`repositories/`)
Database access using Spring Data JPA:
- Automatically generates SQL queries
- Handles CRUD operations

### **6. Services** (`services/`)
Business logic layer:
- Course management
- User management
- Progress calculation
- Learning path recommendations

### **7. Config** (`config/`)
Spring configurations:
- `SecurityConfig` - Authentication/authorization
- `CorsConfig` - Cross-origin requests
- `DatabaseConfig` - Database connections

---

## 🗄️ Database Configuration

### **application.yml** (in `src/main/resources/`)
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: create-drop  # Auto create/drop tables
  datasource:
    url: jdbc:mysql://localhost:3306/learning_path_db
    username: root
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

server:
  port: 8080
  servlet:
    context-path: /api
```

### **Supported Databases:**
- MySQL (default)
- PostgreSQL
- MongoDB
- H2 (in-memory for testing)

---

## 📦 Dependencies (pom.xml)

Main libraries:
- **Spring Boot** - Web framework
- **Spring Data JPA** - Database ORM
- **Spring Security** - Authentication
- **MySQL Connector** - MySQL driver
- **Lombok** - Code generation
- **OpenAI SDK** - AI integration
- **JUnit 5** - Testing

---

## 🚀 API Endpoints

### **Chatbot Endpoints**
- `POST /api/chatbot/chat` - Send message to AI
- `GET /api/chatbot/history` - Get chat history
- `DELETE /api/chatbot/clear` - Clear conversation

### **Course Endpoints**
- `GET /api/courses` - List all courses
- `POST /api/courses` - Create course
- `GET /api/courses/{id}` - Get course details
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### **User Endpoints**
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile

### **Progress Endpoints**
- `GET /api/progress/{userId}` - Get user progress
- `POST /api/progress` - Record progress
- `GET /api/progress/{userId}/courses` - Course progress

### **Learning Path Endpoints**
- `GET /api/paths` - List learning paths
- `POST /api/paths` - Create path
- `GET /api/paths/{id}` - Get path details

---

## 🔧 Build & Test Commands

```powershell
# Install dependencies
mvn install

# Compile
mvn compile

# Run tests
mvn test

# Build JAR
mvn clean package

# Run development server
mvn spring-boot:run

# Clean build artifacts
mvn clean

# View dependencies
mvn dependency:tree
```

---

## 🐛 Troubleshooting Backend

### **Maven Not Found**
```powershell
# Check installation
mvn -version

# If not found, download from maven.apache.org
```

### **Port 8080 Already in Use**
```powershell
# Kill process using port 8080
Get-NetTCPConnection -LocalPort 8080 | Stop-Process -Force

# Or change port in application.yml
# server.port: 8081
```

### **Database Connection Error**
```
Error: Access denied for user 'root'@'localhost'

Solution:
1. Verify MySQL is running
2. Check username/password in application.yml
3. Create database: CREATE DATABASE learning_path_db;
```

### **Maven Build Fails**
```powershell
# Clear cache
mvn clean
rm -r .m2

# Reinstall
mvn install
```

---

## 📊 Project Structure (Java Standard)

```
backend/
└── src/
    ├── main/
    │   ├── java/com/learningpath/
    │   │   ├── controller/   ← HTTP handlers
    │   │   ├── service/      ← Business logic
    │   │   ├── repository/   ← Database queries
    │   │   ├── model/        ← Data classes
    │   │   └── config/       ← Spring config
    │   │
    │   └── resources/
    │       └── application.yml  ← Server config
    │
    └── test/
        ├── java/            ← Unit tests
        └── resources/       ← Test config
```

---

## ✅ Verification Checklist

- [x] Java JDK 11+ installed
- [x] Maven installed
- [x] MySQL running (or configured database)
- [x] `pom.xml` with all dependencies
- [x] `application.yml` configured
- [x] Controllers created
- [x] Models/Entities defined
- [x] Repositories implemented
- [x] Services written
- [x] Tests written
- [x] Dockerfile ready
- [x] API endpoints documented

---

## 🚀 Integration with Frontend

The **frontend-chatbot** connects to this backend:

### **Backend Running:**
```powershell
mvn spring-boot:run
# Runs on http://localhost:8080
```

### **Frontend Running:**
```powershell
npm start
# Runs on http://localhost:3000
```

### **API Calls from Frontend:**
```javascript
// Example: Call backend chatbot
const response = await fetch('http://localhost:8080/api/chatbot/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello' })
});
```

---

## 📚 Technology Stack

- **Language:** Java 11+
- **Framework:** Spring Boot 3.0+
- **Database:** MySQL 8.0+
- **ORM:** Spring Data JPA / Hibernate
- **API:** RESTful with Spring Web
- **Security:** Spring Security
- **Build:** Maven
- **Container:** Docker
- **Testing:** JUnit 5, Mockito

---

## 🎓 Learning Resources

1. **Spring Boot** - https://spring.io/projects/spring-boot
2. **Spring Data JPA** - https://spring.io/projects/spring-data-jpa
3. **Maven** - https://maven.apache.org/
4. **RESTful API Design** - https://restfulapi.net/

---

## 📁 Quick Navigation

- **Start Backend:** `mvn spring-boot:run` (port 8080)
- **Build Backend:** `mvn clean package`
- **Start Frontend:** `npm start` (port 3000)
- **Backend Docs:** This file
- **Frontend Docs:** `../frontend-chatbot/CHATBOT_START_HERE.md`

---

## 🎉 Ready to Go!

Both backend and frontend are fully set up:

1. **Start Backend:**
   ```powershell
   cd backend && mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend-chatbot && npm start
   ```

3. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api

---

**Complete LMS with AI Chatbot is ready!** 🚀
