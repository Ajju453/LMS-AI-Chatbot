# 👨‍🏫 Teacher Portal - Quick Start Guide

## Overview
The Teacher Portal is a comprehensive dashboard that allows teachers to view and manage student information, including attendance, grades, backlog reports, and semester plans.

## How to Access the Teacher Portal

### Step 1: Start the Application
If you haven't started the application yet:

```bash
# In your workspace directory, run:
.\start-local.bat
```

This will:
- Start the Backend on `http://localhost:8080`
- Start the Frontend on `http://localhost:3000`

### Step 2: Open the Student Login Page
Navigate to: **http://localhost:3000**

### Step 3: Click "Teacher Portal" Button
- In the header, you'll see a green **👨‍🏫 Teacher Portal** button
- Click it to access the Teacher Login page

## Teacher Login Credentials

All teachers use the same demo password: **`teacher123`**

### Available Teachers:
1. **Dr. Rajesh Kumar** - Computer Science
2. **Prof. Priya Sharma** - Mathematics
3. **Dr. Arjun Gupta** - Data Science
4. **Prof. Neha Patel** - Web Development
5. **Dr. Vikram Singh** - Database Systems
6. **Prof. Snehal Patil** - Operating Systems

## Teacher Portal Features

### 1. 📊 All Students Tab
View a comprehensive table of all students with:
- **Roll Number**: Student identification
- **Name**: Student's full name
- **Subjects**: Number of enrolled subjects
- **Avg Score**: Average performance across all subjects
- **Attendance**: Overall attendance percentage
- **Action**: Click "View" to see detailed student information

### 2. ⚠️ Backlog Reports Tab
Track students who need academic intervention:
- **Total Students with Backlog**: Count of students with failed subjects
- **Total Backlog Count**: Total number of failed subject instances
- **Individual Backlog Cards** showing:
  - Student name and roll number
  - Count of backlog subjects
  - List of failed subjects with scores
  - Average backlog score

### 3. 📚 Subject Assignment Tab
Analyze subject enrollment and performance:
- **Statistics Summary**:
  - Total students assigned
  - Total subject registrations
  - Average subjects per student
- **Subject Breakdown Table** with:
  - Subject code and name
  - Number of enrolled students
  - Average class score
  - Pass rate percentage

### 4. 📅 Semester Plan Tab
View the current semester curriculum and schedule:
- **Semester Timeline**: Start and end dates
- **Scheduled Subjects** with:
  - Subject name and code
  - Credit hours
  - Class schedule (day/time)
  - Midterm exam date
  - Number of assignments and practicals
- **Exam Schedule**:
  - Midterm exam dates
  - End-term exam dates

## Understanding the Dashboard Data

### Attendance
- Calculated as percentage of days present over total class days
- Color coding:
  - **Green (≥75%)**: Good attendance
  - **Orange (<75%)**: Needs improvement

### Grades/Scores
- Shown as percentages (0-100)
- Color coding:
  - **Green (≥40%)**: Pass
  - **Red (<40%)**: Fail/Backlog

### Backlog Subjects
- Subjects with score below 40% are automatically flagged
- Shows the current score for failed subjects
- Teachers can use this to identify students needing intervention

## Quick Actions

### View Student Details
1. Go to "All Students" tab
2. Click the **View** button on any student row
3. A modal will appear showing:
   - Student's roll number
   - Total subjects enrolled
   - Average score
   - Attendance percentage
   - List of all enrolled subjects

### Logout
- Click the **Logout** button in the top-right corner
- You'll be returned to the Student Login page

## API Endpoints (Backend)

The Teacher Portal uses these REST API endpoints:

### 1. Authentication
```
POST /api/teacher/authenticate
Body: { "name": "Dr. Rajesh Kumar", "password": "teacher123" }
```

### 2. Get All Students
```
GET /api/teacher/students
Returns: List of all students with their subjects and scores
```

### 3. Get Student Attendance
```
GET /api/teacher/student/{studentId}/attendance?days=120
Returns: Attendance records and monthly breakdown
```

### 4. Get Student Grades
```
GET /api/teacher/student/{studentId}/grades
Returns: All subject grades and GPA
```

### 5. Get Backlog Reports
```
GET /api/teacher/backlog-reports
Returns: All students with backlog subjects
```

### 6. Get Subject Statistics
```
GET /api/teacher/subject-statistics
Returns: Enrollment and performance data by subject
```

## Troubleshooting

### Issue: "Teacher not found" error
- **Solution**: Make sure you've selected a teacher from the list before entering password
- **Verify**: Try again with a different teacher

### Issue: Password not working
- **Solution**: For demo mode, use password: `teacher123`
- **Note**: All teachers use the same password in this version

### Issue: Students data not loading
- **Solution**: Make sure the backend is running on port 8080
- **Check**: Verify that `http://localhost:8080/api/teacher/students` is accessible

### Issue: Page shows spinner but doesn't load
- **Solution**: 
  1. Check browser console for errors
  2. Verify backend is running
  3. Try refreshing the page
  4. Clear browser cache and try again

## Tips for Teachers

1. **Monitor Attendance**: Use the Attendance column to identify poorly attending students
2. **Identify At-Risk Students**: Look at Avg Score column for students below 40%
3. **Track Backlogs**: Use backlog reports to plan intervention sessions
4. **Understand Enrollment**: Check subject-wise statistics to see class size and performance patterns
5. **Plan Sessions**: Use semester plan to schedule additional classes or review sessions

## What's Next?

The Teacher Portal currently shows:
- ✅ All students and their academic status
- ✅ Detailed attendance records per student
- ✅ Student grades and backlog information
- ✅ Subject-wise enrollment statistics
- ✅ Semester curriculum and schedule

Future enhancements might include:
- 📝 Grade input and update interface
- 📧 Email notifications for backlog students
- 📊 Advanced analytics and charts
- 🔔 Automated alerts for attendance issues
- 💬 Messaging system with students

## Support

For any issues or questions about the Teacher Portal:
1. Check the troubleshooting section above
2. Review backend logs at: `backend/target/git-vscode-hub-1.0.0.jar.original`
3. Verify all services are running on expected ports

---

**Happy Teaching!** 👨‍🏫📚
