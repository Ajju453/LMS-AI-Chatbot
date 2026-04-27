package com.learningpath.controllers;

import com.learningpath.models.*;
import com.learningpath.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/teacher")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TeacherController {
    
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    
    /**
     * Teacher authentication endpoint
     */
    @PostMapping("/authenticate")
    public ResponseEntity<Map<String, Object>> authenticateTeacher(
            @RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        
        String teacherName = credentials.get("name");
        String password = credentials.get("password");
        
        // Find teacher by name
        List<Teacher> teachers = teacherRepository.findAll();
        Optional<Teacher> teacher = teachers.stream()
                .filter(t -> t.getName().equalsIgnoreCase(teacherName))
                .findFirst();
        
        if (teacher.isEmpty()) {
            response.put("success", false);
            response.put("message", "Teacher not found");
            return ResponseEntity.ok(response);
        }
        
        // In production, use proper password hashing
        // For demo, accept any non-empty password after verifying teacher exists
        if (password == null || password.isEmpty()) {
            response.put("success", false);
            response.put("message", "Invalid password");
            return ResponseEntity.ok(response);
        }
        
        response.put("success", true);
        response.put("teacher", teacher.get().toMap());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all students with their current academic status
     */
    @GetMapping("/students")
    public ResponseEntity<Map<String, Object>> getAllStudents() {
        Map<String, Object> response = new HashMap<>();
        
        List<Student> students = studentRepository.findAll();
        
        List<Map<String, Object>> studentList = students.stream()
                .map(student -> {
                    Map<String, Object> studentData = new HashMap<>();
                    studentData.put("id", student.getId());
                    studentData.put("rollNumber", student.getStudentId());
                    studentData.put("name", student.getName());
                    studentData.put("email", student.getEmail());
                    studentData.put("semester", student.getSemester());
                    studentData.put("gpa", student.getGpa());
                    studentData.put("attendance", Math.round(student.getAttendancePercentage() * 100.0) / 100.0);
                    
                    // Get enrolled subjects
                    List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(student.getId());
                    List<Map<String, Object>> subjectList = subjects.stream()
                            .map(ss -> {
                                Map<String, Object> subData = new HashMap<>();
                                subData.put("code", ss.getSubject().getCode());
                                subData.put("name", ss.getSubject().getName());
                                subData.put("currentScore", ss.getCurrentScore());
                                subData.put("hasBacklog", ss.getHasBacklog());
                                return subData;
                            })
                            .collect(Collectors.toList());
                    
                    studentData.put("subjects", subjectList);
                    return studentData;
                })
                .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("students", studentList);
        response.put("total", studentList.size());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get attendance records for a specific student
     */
    @GetMapping("/student/{studentId}/attendance")
    public ResponseEntity<Map<String, Object>> getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "120") int days) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Student> student = studentRepository.findById(studentId);
        if (student.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.ok(response);
        }
        
        LocalDate fromDate = LocalDate.now().minusDays(days);
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateAfter(studentId, fromDate);
        
        long presentDays = records.stream().filter(Attendance::getIsPresent).count();
        double attendanceRate = records.isEmpty() ? 0 : (presentDays * 100.0) / records.size();
        
        Map<String, Object> data = new HashMap<>();
        data.put("studentId", student.get().getStudentId());
        data.put("studentName", student.get().getName());
        data.put("totalDays", records.size());
        data.put("presentDays", presentDays);
        data.put("absentDays", records.size() - presentDays);
        data.put("attendancePercentage", Math.round(attendanceRate * 100.0) / 100.0);
        data.put("monthlyBreakdown", getMonthlyAttendanceBreakdown(records));
        
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get student's grades/marks across all subjects
     */
    @GetMapping("/student/{studentId}/grades")
    public ResponseEntity<Map<String, Object>> getStudentGrades(@PathVariable Long studentId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Student> student = studentRepository.findById(studentId);
        if (student.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.ok(response);
        }
        
        List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(studentId);
        
        List<Map<String, Object>> gradeList = subjects.stream()
                .map(ss -> {
                    Map<String, Object> gradeData = new HashMap<>();
                    gradeData.put("subjectCode", ss.getSubject().getCode());
                    gradeData.put("subjectName", ss.getSubject().getName());
                    gradeData.put("currentScore", ss.getCurrentScore());
                    gradeData.put("hasBacklog", ss.getHasBacklog());
                    gradeData.put("status", ss.getHasBacklog() ? "BACKLOG" : 
                                  (ss.getCurrentScore() >= 40 ? "PASS" : "RISK"));
                    return gradeData;
                })
                .collect(Collectors.toList());
        
        double avgScore = subjects.isEmpty() ? 0 : 
                          subjects.stream().mapToDouble(StudentSubject::getCurrentScore).average().orElse(0);
        
        Map<String, Object> data = new HashMap<>();
        data.put("studentId", student.get().getStudentId());
        data.put("studentName", student.get().getName());
        data.put("gpa", student.get().getGpa());
        data.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
        data.put("totalSubjects", subjects.size());
        data.put("backlogCount", subjects.stream().filter(StudentSubject::getHasBacklog).count());
        data.put("grades", gradeList);
        
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get backlog reports for all students
     */
    @GetMapping("/backlog-reports")
    public ResponseEntity<Map<String, Object>> getBacklogReports() {
        Map<String, Object> response = new HashMap<>();
        
        List<Student> students = studentRepository.findAll();
        
        List<Map<String, Object>> backlogList = students.stream()
                .map(student -> {
                    List<StudentSubject> backlogs = studentSubjectRepository.findByStudentIdAndHasBacklogTrue(student.getId());
                    
                    return new AbstractMap.SimpleEntry<>(student, backlogs);
                })
                .filter(entry -> !entry.getValue().isEmpty())
                .map(entry -> {
                    Student student = entry.getKey();
                    List<StudentSubject> backlogs = entry.getValue();
                    
                    Map<String, Object> backlogData = new HashMap<>();
                    backlogData.put("studentId", student.getStudentId());
                    backlogData.put("studentName", student.getName());
                    backlogData.put("backlogCount", backlogs.size());
                    backlogData.put("backlogSubjects", backlogs.stream()
                            .map(ss -> {
                                Map<String, Object> subData = new HashMap<>();
                                subData.put("code", ss.getSubject().getCode());
                                subData.put("name", ss.getSubject().getName());
                                subData.put("score", ss.getCurrentScore());
                                return subData;
                            })
                            .collect(Collectors.toList()));
                    
                    return backlogData;
                })
                .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("totalStudentsWithBacklog", backlogList.size());
        response.put("backlogReports", backlogList);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get subject-wise enrollment statistics
     */
    @GetMapping("/subject-statistics")
    public ResponseEntity<Map<String, Object>> getSubjectStatistics() {
        Map<String, Object> response = new HashMap<>();
        
        List<Subject> subjects = subjectRepository.findAll();
        
        List<Map<String, Object>> subjectStats = subjects.stream()
                .map(subject -> {
                    List<StudentSubject> enrollments = studentSubjectRepository.findBySubjectId(subject.getId());
                    
                    double avgScore = enrollments.isEmpty() ? 0 : 
                                      enrollments.stream().mapToDouble(StudentSubject::getCurrentScore).average().orElse(0);
                    long backlogCount = enrollments.stream().filter(StudentSubject::getHasBacklog).count();
                    
                    Map<String, Object> statData = new HashMap<>();
                    statData.put("subjectCode", subject.getCode());
                    statData.put("subjectName", subject.getName());
                    statData.put("enrolledStudents", enrollments.size());
                    statData.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
                    statData.put("backlogCount", backlogCount);
                    statData.put("passRate", enrollments.isEmpty() ? 0 : 
                                 Math.round(((enrollments.size() - backlogCount) * 100.0 / enrollments.size()) * 100.0) / 100.0);
                    
                    return statData;
                })
                .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("totalSubjects", subjectStats.size());
        response.put("subjectStatistics", subjectStats);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Helper method to get monthly attendance breakdown
     */
    private Map<String, Object> getMonthlyAttendanceBreakdown(List<Attendance> records) {
        Map<String, Object> monthlyData = new HashMap<>();
        
        records.stream()
                .collect(Collectors.groupingBy(
                        a -> YearMonth.from(a.getDate()),
                        Collectors.toList()
                ))
                .forEach((month, monthRecords) -> {
                    long presentCount = monthRecords.stream().filter(Attendance::getIsPresent).count();
                    double attendanceRate = (presentCount * 100.0) / monthRecords.size();
                    
                    Map<String, Object> monthInfo = new HashMap<>();
                    monthInfo.put("present", presentCount);
                    monthInfo.put("absent", monthRecords.size() - presentCount);
                    monthInfo.put("percentage", Math.round(attendanceRate * 100.0) / 100.0);
                    
                    monthlyData.put(month.toString(), monthInfo);
                });
        
        return monthlyData;
    }
}
