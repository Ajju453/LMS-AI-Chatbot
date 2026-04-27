# Learning Path Dashboard - AI Chatbot
## Complete Project Setup & Integration Guide

---

## 📋 Project Overview

A comprehensive **AI-Powered Learning Path Dashboard** with an integrated chatbot system designed to help colleges manage student learning, track attendance, and provide intelligent tutoring assistance.

### Key Features:
- **🤖 AI Chatbot Assistant**: OpenAI-powered chatbot for instant academic help
- **📚 Learning Management System**: Curriculum planning and topic scheduling
- **✓ Attendance Tracking**: Automated attendance management per student
- **⚠️ Backlog Management**: Identify and remind students about failing subjects
- **📊 Monthly Reports**: Detailed performance analytics and insights
- **💡 Smart Tutoring**: Topic-wise learning guidance with time estimates
- **👥 Student Dashboard**: Personalized learning progress tracking

---

## 🏗️ Project Structure

```
project-root/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/learningpath/
│   │   ├── models/                   # Database Entities
│   │   │   ├── Student.java
│   │   │   ├── Subject.java
│   │   │   ├── Topic.java
│   │   │   ├── Attendance.java
│   │   │   ├── StudentSubject.java
│   │   │   ├── ChatMessage.java
│   │   │   └── StudentReport.java
│   │   ├── repositories/             # Data Access Layer
│   │   │   ├── StudentRepository.java
│   │   │   ├── SubjectRepository.java
│   │   │   ├── TopicRepository.java
│   │   │   ├── AttendanceRepository.java
│   │   │   ├── StudentSubjectRepository.java
│   │   │   ├── ChatMessageRepository.java
│   │   │   └── StudentReportRepository.java
│   │   ├── services/                 # Business Logic
│   │   │   ├── StudentService.java
│   │   │   ├── SubjectService.java
│   │   │   ├── AttendanceService.java
│   │   │   ├── ReportService.java
│   │   │   └── BacklogReminderService.java
│   │   ├── chatbot/                  # AI Chatbot Logic
│   │   │   └── ChatbotService.java
│   │   ├── controllers/              # REST API Endpoints
│   │   │   ├── ChatbotController.java
│   │   │   ├── StudentController.java
│   │   │   ├── SubjectController.java
│   │   │   ├── AttendanceController.java
│   │   │   └── ReportController.java
│   │   └── config/                   # Configuration
│   │       └── AppConfig.java
│   ├── src/main/resources/
│   │   └── application.yml           # Configuration File
│   ├── pom.xml                       # Maven Dependencies
│   └── Dockerfile                    # Docker Configuration
│
├── frontend-chatbot/                 # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable Components
│   │   │   ├── Chatbot.jsx
│   │   │   ├── Chatbot.css
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── StudentDashboard.css
│   │   ├── pages/                    # Page Components
│   │   │   ├── HomePage.jsx
│   │   │   └── HomePage.css
│   │   ├── services/                 # API Services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── .env
│   └── Dockerfile
│
└── documentation/
    ├── API_DOCUMENTATION.md
    ├── SETUP_GUIDE.md
    └── DATABASE_SCHEMA.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17+** (for Spring Boot backend)
- **Node.js 16+** (for React frontend)
- **MySQL 8.0+** (database)
- **OpenAI API Key** (for chatbot)

### Step 1: Backend Setup

#### 1.1 MySQL Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE learning_path_db;
CREATE USER 'lpuser'@'localhost' IDENTIFIED BY 'lppassword';
GRANT ALL PRIVILEGES ON learning_path_db.* TO 'lpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### 1.2 Update Backend Configuration
Edit `backend/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/learning_path_db
    username: lpuser
    password: lppassword
  
openai:
  api:
    key: your-openai-api-key-here
```

#### 1.3 Build and Run Backend
```bash
cd backend
mvn clean package
mvn spring-boot:run
```

Backend will run on: `http://localhost:8080/api`

### Step 2: Frontend Setup

#### 2.1 Install Dependencies
```bash
cd frontend-chatbot
npm install
```

#### 2.2 Configure Environment
Create `.env` file with:
```
REACT_APP_API_URL=http://localhost:8080/api
```

#### 2.3 Start React Development Server
```bash
npm start
```

Frontend will open at: `http://localhost:3000`

---

## 📡 API Endpoints

### Chatbot API
- **POST** `/api/chatbot/chat` - Send message to chatbot
- **GET** `/api/chatbot/history/{studentId}` - Get chat history
- **DELETE** `/api/chatbot/history/{studentId}` - Clear chat history
- **GET** `/api/chatbot/health` - Health check

### Student API
- **POST** `/api/students` - Create new student
- **GET** `/api/students/{id}` - Get student details
- **PUT** `/api/students/{id}` - Update student info
- **GET** `/api/students/{id}/backlogs` - Get student backlogs
- **GET** `/api/students/studentId/{studentId}` - Get by student ID

### Attendance API
- **POST** `/api/attendance` - Record attendance
- **GET** `/api/attendance/student/{studentId}` - Get all attendance
- **GET** `/api/attendance/student/{studentId}/month/{year}/{month}` - Monthly attendance
- **GET** `/api/attendance/student/{studentId}/percentage` - Attendance percentage

### Report API
- **POST** `/api/reports/generate/{studentId}` - Generate monthly report
- **GET** `/api/reports/{studentId}` - Get all reports
- **GET** `/api/reports/{studentId}/month/{year}/{month}` - Get specific month report

### Subject API
- **POST** `/api/subjects` - Create subject
- **GET** `/api/subjects/{id}` - Get subject details
- **GET** `/api/subjects/semester/{semester}` - Get subjects by semester
- **GET** `/api/subjects/{id}/topics` - Get topics for subject
- **GET** `/api/subjects/{id}/curriculum-plan` - Get curriculum plan

---

## 🗄️ Database Schema

### Student Table
```
Columns: id, studentId (unique), name, email, phone, semester, gpa, 
         attendancePercentage, createdAt, updatedAt
```

### Subject Table
```
Columns: id, name, code (unique), semester, credits, description
```

### Topic Table
```
Columns: id, name, description, estimatedHours, difficultyLevel,
         learningObjectives, resources, sequenceOrder, subject_id
```

### Attendance Table
```
Columns: id, student_id (FK), subject_id (FK), date, isPresent, remarks
```

### StudentSubject Table
```
Columns: id, student_id (FK), subject_id (FK), currentScore,
         hasBacklog, backlogCount, lastReminderSent, topicProgress
```

### ChatMessage Table
```
Columns: id, student_id (FK), userMessage, botResponse, messageType,
         timestamp, subjectContext, topicContext
```

### StudentReport Table
```
Columns: id, student_id (FK), reportMonth, overallPerformance,
         attendanceSummary, subjectScores, backlogSubjects,
         recommendations, averageGpa
```

---

## 🤖 Chatbot Capabilities

### Intelligent Intent Detection
The chatbot automatically recognizes:
1. **Backlog Queries** - "I have backlog", "Failed subjects"
2. **Attendance Questions** - "How is my attendance?"
3. **Performance Reports** - "Show my monthly report"
4. **Study Plans** - "Create a study plan"
5. **Topic Help** - "Explain Newton's Law"
6. **General Assistance** - Anything else

### Response Types
- **Backlog Reminders** - Lists failing subjects with action items
- **Attendance Summary** - Monthly attendance percentage and status
- **Performance Reports** - GPA, scores, recommendations
- **Study Plans** - Personalized learning schedules
- **Tutoring Help** - OpenAI-powered explanations
- **Smart Guidance** - Context-aware academic advice

---

## 🔧 Docker Deployment

### Build Docker Images
```bash
# Backend
cd backend
docker build -t learning-chatbot-backend .

# Frontend
cd frontend-chatbot
docker build -t learning-chatbot-frontend .
```

### Run with Docker Compose
```bash
docker-compose up
```

---

## 🔐 Environment Variables

### Backend (`application.yml`)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/learning_path_db
    username: root
    password: root

openai:
  api:
    key: sk-your-openai-key-here
    url: https://api.openai.com/v1/chat/completions
```

### Frontend (`.env`)
```
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 📝 Sample Data & Testing

### Create Sample Student
```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "semester": "4"
  }'
```

### Send Chatbot Message
```bash
curl -X POST "http://localhost:8080/api/chatbot/chat?studentId=1" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have backlog in Mathematics"}'
```

---

## 💡 Integration with Existing Project

### Merging with Your Task Manager Project:

1. **Use the same Spring Boot backend** - Both projects can share the same backend
2. **Create separate React apps** - Or merge into a single multi-page app
3. **Unified database** - Use same MySQL instance
4. **Shared API gateway** - Proxy requests through a single server

### Example Merged Structure:
```
project/
├── backend/
│   └── com/learning/
│       ├── chatbot/        (NEW)
│       ├── tasks/          (EXISTING)
│       └── core/
├── frontend/               (MERGED ANGULAR)
│   └── src/
│       ├── app/chatbot/    (NEW)
│       └── app/tasks/      (EXISTING)
└── docker-compose.yml
```

---

## 🐛 Troubleshooting

### MySQL Connection Error
```
Error: Connection refused
Solution: Ensure MySQL is running and credentials are correct
```

### OpenAI API Error
```
Error: Invalid API Key
Solution: Check OPENAI_API_KEY environment variable
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS
Solution: Check allowed-origins in application.yml
```

### Port Already in Use
```
Error: Port 8080/3000 already in use
Solution: Change port in application.yml or kill process using that port
```

---

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [React Documentation](https://react.dev)
- [OpenAI API Guide](https://platform.openai.com/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

## 📄 License

This project is proprietary and meant for educational purposes.

---

## 👨‍💻 Support & Maintenance

For issues or enhancements, contact the development team.

**Created:** March 2024  
**Version:** 1.0.0
