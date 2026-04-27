# API Documentation - Learning Path Dashboard Chatbot

## Base URL
```
http://localhost:8080/api
```

---

## 🤖 Chatbot Endpoints

### 1. Send Chat Message
**POST** `/chatbot/chat`

**Parameters:**
- `studentId` (query, required) - Student ID

**Request Body:**
```json
{
  "message": "I have backlog in Mathematics"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Here is your backlog reminder...",
  "timestamp": 1710000000000
}
```

---

### 2. Get Chat History
**GET** `/chatbot/history/{studentId}`

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "userMessage": "Show my attendance",
      "botResponse": "Your attendance is 85%...",
      "timestamp": "2024-03-15T10:30:00",
      "messageType": "ATTENDANCE_QUERY"
    }
  ],
  "totalMessages": 5
}
```

---

### 3. Clear Chat History
**DELETE** `/chatbot/history/{studentId}`

**Response:**
```json
{
  "success": "true",
  "message": "Chat history cleared successfully"
}
```

---

### 4. Health Check
**GET** `/chatbot/health`

**Response:**
```json
{
  "status": "active",
  "service": "Learning Chatbot"
}
```

---

## 👥 Student Endpoints

### 1. Create Student
**POST** `/students`

**Request Body:**
```json
{
  "studentId": "STU001",
  "name": "John Doe",
  "email": "john@college.edu",
  "phone": "9876543210",
  "semester": "4"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": "STU001",
    "name": "John Doe",
    "email": "john@college.edu",
    "gpa": 0.0,
    "attendancePercentage": 0.0,
    "createdAt": "2024-03-15T10:30:00",
    "updatedAt": "2024-03-15T10:30:00"
  },
  "message": "Student created successfully"
}
```

---

### 2. Get Student by ID
**GET** `/students/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": "STU001",
    "name": "John Doe",
    "email": "john@college.edu",
    "phone": "9876543210",
    "semester": "4",
    "gpa": 7.5,
    "attendancePercentage": 85.0
  }
}
```

---

### 3. Get Student by Student ID
**GET** `/students/studentId/{studentId}`

---

### 4. Update Student
**PUT** `/students/{id}`

**Request Body:**
```json
{
  "name": "John Updated",
  "gpa": 8.5,
  "semester": "5"
}
```

---

### 5. Delete Student
**DELETE** `/students/{id}`

**Response:**
```json
{
  "success": "true",
  "message": "Student deleted successfully"
}
```

---

### 6. Get Student Backlogs
**GET** `/students/{id}/backlogs`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student": { "id": 1, "studentId": "STU001" },
      "subject": { "id": 2, "name": "Mathematics", "code": "MATH101" },
      "currentScore": 35.0,
      "hasBacklog": true,
      "backlogCount": 2,
      "topicProgress": 45
    }
  ],
  "count": 1
}
```

---

## ✓ Attendance Endpoints

### 1. Record Attendance
**POST** `/attendance`

**Request Body:**
```json
{
  "student": { "id": 1 },
  "subject": { "id": 1 },
  "date": "2024-03-15",
  "isPresent": true,
  "remarks": "Present"
}
```

---

### 2. Get Student Attendance
**GET** `/attendance/student/{studentId}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "date": "2024-03-15",
      "isPresent": true,
      "remarks": "Present"
    }
  ],
  "count": 25
}
```

---

### 3. Get Monthly Attendance
**GET** `/attendance/student/{studentId}/month/{year}/{month}`

**Example:** `/attendance/student/1/month/2024/3`

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 20,
  "summary": "Attendance Summary for 2024-03: 17/20 days present (85.0%)"
}
```

---

### 4. Get Attendance Percentage
**GET** `/attendance/student/{studentId}/percentage`

**Response:**
```json
{
  "success": true,
  "percentage": 85.5,
  "status": "GOOD"
}
```

---

## 📊 Report Endpoints

### 1. Generate Monthly Report
**POST** `/reports/generate/{studentId}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "studentId": 1,
    "reportMonth": "2024-03",
    "overallPerformance": "GOOD",
    "attendanceSummary": "Attendance Summary for 2024-03: 17/20 days present (85.0%)",
    "subjectScores": "Mathematics: 75.00 | Physics: 80.00 | ...",
    "backlogSubjects": "Chemistry",
    "recommendations": "Focus on Chemistry. Maintain consistent attendance...",
    "averageGpa": 7.75
  }
}
```

---

### 2. Get All Student Reports
**GET** `/reports/{studentId}`

**Response:**
```json
{
  "success": true,
  "data": [
    { "reportMonth": "2024-03", ... },
    { "reportMonth": "2024-02", ... }
  ],
  "count": 2
}
```

---

### 3. Get Monthly Report
**GET** `/reports/{studentId}/month/{year}/{month}`

---

## 📚 Subject Endpoints

### 1. Create Subject
**POST** `/subjects`

**Request Body:**
```json
{
  "name": "Mathematics",
  "code": "MATH101",
  "semester": "4",
  "credits": 4
}
```

---

### 2. Get Subject
**GET** `/subjects/{id}`

---

### 3. Get Subject by Code
**GET** `/subjects/code/{code}`

---

### 4. Get Subjects by Semester
**GET** `/subjects/semester/{semester}`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Mathematics",
      "code": "MATH101",
      "semester": "4",
      "credits": 4
    }
  ],
  "count": 5
}
```

---

### 5. Create Topic
**POST** `/subjects/{id}/topics`

**Request Body:**
```json
{
  "name": "Calculus Basics",
  "description": "Introduction to calculus",
  "estimatedHours": 10.0,
  "difficultyLevel": "MEDIUM",
  "sequenceOrder": 1
}
```

---

### 6. Get Topics
**GET** `/subjects/{id}/topics`

---

### 7. Get Curriculum Plan
**GET** `/subjects/{id}/curriculum-plan`

**Response:**
```
Curriculum Plan for Mathematics
Total Topics: 5

- 1. Calculus Basics (10.0 hours, MEDIUM)
- 2. Integration (12.0 hours, HARD)
...

Total Estimated Hours: 50.0
```

---

## Error Responses

### Common Error Codes

**400 Bad Request**
```json
{
  "success": false,
  "message": "Invalid request parameters"
}
```

**404 Not Found**
```json
{
  "success": false,
  "message": "Student not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Error generating report: Database connection failed"
}
```

---

## Rate Limiting

- Chatbot: 100 requests per 15 minutes per student
- API Requests: 1000 requests per hour

---

## Authentication

Currently, the API doesn't require authentication. For production, implement JWT tokens.

---

Created: March 2024
