# 🧪 Teacher Portal - Testing & Verification Guide

## Pre-Testing Checklist

### System Requirements
- ✅ Java 17+ installed
- ✅ Node.js 16+ installed  
- ✅ npm installed
- ✅ ~200 MB free disk space
- ✅ Ports 3000, 8080 available

### Files Verification
```powershell
# Run this to verify all files exist
Test-Path "c:\Users\Z00588XV\Desktop\New folder (2)\backend\target\git-vscode-hub-1.0.0.jar"
Test-Path "c:\Users\Z00588XV\Desktop\New folder (2)\frontend-chatbot\build\index.html"
Test-Path "c:\Users\Z00588XV\Desktop\New folder (2)\start-teacher-portal.bat"
```

Expected output: All `True`

## Quick Test (5 minutes)

### Step 1: Start Application
```bash
cd "c:\Users\Z00588XV\Desktop\New folder (2)"
.\start-teacher-portal.bat
```

Expected:
- Two new command windows open
- Backend window shows: "Started LearningPathApplication"
- Frontend window shows: "Compiled successfully"

### Step 2: Access Frontend
1. Open browser to: **http://localhost:3000**
2. You should see the student chatbot page with:
   - "📚 AI Learning Assistant" title
   - "Student Information & Academic Support Hub" subtitle
   - **Green "👨‍🏫 Teacher Portal" button** in top-right

### Step 3: Test Teacher Login
1. Click **"👨‍🏫 Teacher Portal"** button
2. You should see: "Select Your Profile" with 6 teacher cards
3. Click on **"Dr. Rajesh Kumar"**
4. A password field should appear
5. Enter: `teacher123`
6. Click **"🔓 Sign In"**

Expected: Dashboard loads smoothly with 4 tabs

### Step 4: Verify Dashboard Features

#### ✅ All Students Tab (Default)
- [ ] Table shows 80 students
- [ ] Columns: Roll No, Name, Subjects, Avg Score, Attendance, View
- [ ] No loading spinner (should load immediately)
- [ ] Clicking "View" shows modal with student details
- [ ] Closing modal works (X button)
- [ ] Colors are correct (green for good, red for bad scores)

#### ✅ Backlog Reports Tab
- [ ] Summary shows count of students with backlog
- [ ] Shows total backlog count
- [ ] Cards display for each student with backlog
- [ ] Each card shows:
  - Student name and roll number
  - Backlog count badge
  - List of failed subjects
  - Average backlog score
- [ ] Scrolling works for multiple backlogs

#### ✅ Subject Assignment Tab
- [ ] Three stat cards display (Students Assigned, Registrations, Avg per Student)
- [ ] Subject breakdown table loads
- [ ] Each row shows: Code, Name, Enrolled Students, Avg Score, Pass Rate
- [ ] Numbers are accurate
- [ ] Color coding works (green for good pass rate)

#### ✅ Semester Plan Tab
- [ ] Timeline shows semester start/end dates
- [ ] Lists all subjects with:
  - Subject name and code
  - Credit hours
  - Class schedule
  - Midterm exam date
  - Assignment and practical counts
- [ ] Exam schedule displays:
  - Midterm dates
  - End-term dates
- [ ] All text is readable and correctly formatted

### Step 5: Test Logout
1. Click **"Logout"** button in top-right
2. Should return to student login page
3. Should be able to click "Teacher Portal" again

## Detailed Test Cases

### Test Case 1: Multi-Teacher Login
```
Objective: Verify all teachers can login

Steps:
1. Return to student page
2. Click Teacher Portal
3. Select: Prof. Priya Sharma
4. Enter password: teacher123
5. Logout and repeat for each teacher

Teachers to test:
□ Dr. Rajesh Kumar
□ Prof. Priya Sharma
□ Dr. Arjun Gupta
□ Prof. Neha Patel
□ Dr. Vikram Singh
□ Prof. Snehal Patil

Expected: All 6 teachers should login successfully
```

### Test Case 2: Data Accuracy
```
Objective: Verify displayed data matches backend

Steps:
1. Login as Dr. Rajesh Kumar
2. Go to All Students
3. Count total students shown (should be 80)
4. Note the first student's:
   - Roll number
   - Name
   - Subject count
   - Average score
5. Click View to see detailed info
6. Compare with database

Expected: All data should match backend
```

### Test Case 3: Tab Navigation
```
Objective: Verify all tabs load and navigate smoothly

Steps:
1. Stay logged in
2. Click each tab in order:
   - All Students → Check data loads
   - Backlog Reports → Check count
   - Subject Assignment → Check stats
   - Semester Plan → Check dates
3. Navigate back and forth between tabs
4. Test tab switching speed

Expected:
- All tabs load instantly
- No data loss between tabs
- Smooth visual transitions
```

### Test Case 4: Responsive Design
```
Objective: Verify dashboard works on different sizes

Steps:
1. Start with normal window size
2. Press F11 for fullscreen
3. Resize window to smaller
4. Check mobile view (Ctrl+Shift+M in DevTools)
5. Test scrolling on small screens

Expected:
- Dashboard adapts to screen size
- Tables remain readable
- No horizontal scrolling issues
- Buttons remain clickable
```

### Test Case 5: Data Filtering
```
Objective: Verify data filtering in tables

Steps:
1. Go to All Students
2. Scroll through all 80 students
3. Verify semester, GPA, attendance vary
4. Go to Backlog Reports
5. Verify only students with backlog appear
6. Go to Subject Assignment
7. Verify all 6 subjects are listed

Expected:
- Data shows variety
- Filters work correctly
- No duplicate entries
```

### Test Case 6: Error Handling
```
Objective: Test error scenarios

Test 1: Wrong password
- Enter: "wrongpassword"
- Expected: Error message "Invalid password"

Test 2: No password
- Leave blank and click Sign In
- Expected: Error message "Please enter password"

Test 3: Change teacher without entering password
- Select teacher
- Click "Change Profile"
- Select different teacher
- Expected: Form resets, no errors

Test 4: Network issue simulation
- Close backend
- Refresh dashboard
- Expected: Graceful error handling (or pending state)
```

### Test Case 7: Performance
```
Objective: Verify dashboard performance

Measurements:
1. Time to load All Students:    _____ ms (target: <2 sec)
2. Tab switch time:              _____ ms (target: instant)
3. Student detail modal:         _____ ms (target: <500 ms)
4. Backlog report render:        _____ ms (target: <2 sec)

Use Chrome DevTools (F12) → Performance tab

Expected: All under target times
```

### Test Case 8: Accessibility
```
Objective: Verify basic accessibility

Steps:
1. Tab through all elements (press Tab repeatedly)
2. Verify focus indicators visible
3. Read page with screen reader (if available)
4. Check color contrast (DevTools → Lighthouse)
5. Test keyboard navigation

Expected:
- Can access all features with keyboard
- Focus indicators visible
- Good color contrast
- No blocked elements
```

## API Endpoint Testing

Use Postman or curl to test endpoints:

### Test 1: Teacher Authentication
```bash
curl -X POST http://localhost:8080/api/teacher/authenticate \
  -H "Content-Type: application/json" \
  -d '{"name":"Dr. Rajesh Kumar","password":"teacher123"}'
```

Expected Response:
```json
{
  "success": true,
  "teacher": {
    "id": 1,
    "name": "Dr. Rajesh Kumar",
    "email": "rajesh.kumar@university.edu",
    ...
  }
}
```

### Test 2: Get All Students
```bash
curl http://localhost:8080/api/teacher/students
```

Expected:
- Status: 200
- Returns array of 80 students
- Each has: id, rollNumber, name, email, semester, gpa, attendance, subjects array

### Test 3: Get Student Attendance
```bash
curl http://localhost:8080/api/teacher/student/1/attendance
```

Expected:
- Status: 200
- Returns attendance records for student
- Monthly breakdown included

### Test 4: Get Backlog Reports
```bash
curl http://localhost:8080/api/teacher/backlog-reports
```

Expected:
- Status: 200
- Returns list of students with backlog
- Shows backlog subjects for each

### Test 5: Get Subject Statistics
```bash
curl http://localhost:8080/api/teacher/subject-statistics
```

Expected:
- Status: 200
- Returns 6 subjects with enrollment stats
- Shows pass rate per subject

## Browser DevTools Testing

### Console (F12 → Console tab)
- [ ] No JavaScript errors
- [ ] No red warnings
- [ ] API calls successful (look for status 200)

### Network Tab (F12 → Network)
- [ ] Check GET requests to /api/teacher/*
- [ ] All requests returning 200 status
- [ ] Response times < 100ms
- [ ] No failed requests

### Performance Tab (F12 → Performance)
- [ ] Record 10 seconds of interaction
- [ ] Check for large gaps in frame rate
- [ ] Verify smooth rendering (60 FPS)
- [ ] No memory leaks

### Lighthouse (F12 → Lighthouse)
- [ ] Run Lighthouse audit
- [ ] Performance score: >80
- [ ] Accessibility score: >70
- [ ] Best Practices score: >80

## Cleanup & Stop Application

### Proper Shutdown
1. Click X on Backend window to close
2. Click X on Frontend window to close
3. Both services stop gracefully

### Verify Shutdown
```powershell
# Check ports are released
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
# Should return nothing
```

## Expected Test Results Summary

| Test Area | Status | Notes |
|-----------|--------|-------|
| Teacher Login | ✅ | All 6 teachers should work |
| All Students Tab | ✅ | 80 students displayed |
| Backlog Reports | ✅ | Shows at-risk students |
| Subject Assignment | ✅ | 6 subjects with stats |
| Semester Plan | ✅ | Complete curriculum shown |
| Navigation | ✅ | Smooth tab switching |
| Logout | ✅ | Returns to student page |
| API Endpoints | ✅ | All return correct data |
| Performance | ✅ | < 2 seconds load time |
| Responsive | ✅ | Works on all sizes |

## Troubleshooting During Testing

### Application Won't Start
```
Problem: "Port already in use"
Solution: Check what's running on port 3000/8080
  lsof -i :3000
  lsof -i :8080
  Kill process and retry
```

### Blank Dashboard
```
Problem: Dashboard shows spinner but doesn't load
Solution:
  1. Check backend is running (window still open)
  2. Check browser console for errors (F12)
  3. Refresh page
  4. Clear cache (Ctrl+Shift+Delete)
```

### API Calls Failing
```
Problem: 404 errors or connection refused
Solution:
  1. Verify backend jar is running
  2. Check localhost:8080 in browser
  3. Verify endpoint URLs in code
  4. Check CORS settings
```

### UI Not Responsive
```
Problem: Buttons not responding or lag
Solution:
  1. Check system CPU/memory usage
  2. Close other applications
  3. Restart browser
  4. Check JavaScript console for errors
```

## Sign-Off Checklist

After testing, verify:

- [ ] All 6 teachers can login
- [ ] All 4 dashboard tabs work
- [ ] 80 students display correctly
- [ ] Backlog students identified
- [ ] Subject stats are accurate
- [ ] Semester plan shows curriculum
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] API endpoints return correct data
- [ ] Logout works properly
- [ ] Performance meets targets

**Testing Status**: _______________
**Tested By**: _______________
**Date**: _______________
**Issues Found**: _______________

---

**Ready for Production Demo** ✅
