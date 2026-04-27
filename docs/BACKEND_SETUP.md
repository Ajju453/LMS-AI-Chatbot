# AI Chatbot - Backend Setup Guide

## Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8.0+
- OpenAI API Key

## Installation Steps

### 1. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Execute these commands
CREATE DATABASE learning_path_db;
CREATE USER 'lpuser'@'localhost' IDENTIFIED BY 'lppassword';
GRANT ALL PRIVILEGES ON learning_path_db.* TO 'lpuser'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Configure Application Properties
Edit `backend/src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/learning_path_db
    username: lpuser
    password: lppassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect

openai:
  api:
    key: your-openai-api-key
    url: https://api.openai.com/v1/chat/completions
```

### 3. Build Backend
```bash
cd backend
mvn clean install
```

### 4. Run Backend
```bash
mvn spring-boot:run
```

Server runs at: `http://localhost:8080/api`

## API Testing

### Test Chatbot
```bash
curl -X POST "http://localhost:8080/api/chatbot/chat?studentId=1" \
  -H "Content-Type: application/json" \
  -d '{"message": "I have backlog in Math"}'
```

### Test Student Creation
```bash
curl -X POST "http://localhost:8080/api/students" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STU001",
    "name": "John",
    "email": "john@college.edu",
    "phone": "9876543210",
    "semester": "4"
  }'
```

## Common Issues

### MySQL Connection Failed
- Check MySQL service is running
- Verify credentials in application.yml
- Ensure database `learning_path_db` exists

### OpenAI API Error
- Verify API key is correct
- Check API key has available credits
- Ensure internet connection is available

### Port 8080 Already in Use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F
```

## Dependencies Added
- Spring Data JPA
- MySQL Connector Java
- Jackson (JSON processing)
- Lombok (for boilerplate reduction)
