package com.learningpath.controllers;

import com.learningpath.models.*;
import com.learningpath.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chatbot/data")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatbotDataController {
    
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private StudentSubjectRepository studentSubjectRepository;
    @Autowired
    private TopicRepository topicRepository;
    @Autowired
    private TeacherRepository teacherRepository;
    
    /**
     * Get a student's academic profile with attendance, subjects, and GPA
     */
    @GetMapping("/student/{studentId}/profile")
    public ResponseEntity<Map<String, Object>> getStudentProfile(@PathVariable String studentId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Student> student = studentRepository.findByStudentId(studentId);
        if (student.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.ok(response);
        }
        
        Student s = student.get();
        Map<String, Object> profile = new HashMap<>();
        profile.put("studentId", s.getStudentId());
        profile.put("name", s.getName());
        profile.put("email", s.getEmail());
        profile.put("semester", s.getSemester());
        profile.put("gpa", s.getGpa());
        profile.put("attendancePercentage", Math.round(s.getAttendancePercentage() * 100.0) / 100.0);
        
        // Get enrolled subjects
        List<StudentSubject> subjects = studentSubjectRepository.findByStudentId(s.getId());
        profile.put("enrolledSubjects", subjects.size());
        profile.put("subjectsWithBacklog", subjects.stream()
            .filter(StudentSubject::getHasBacklog)
            .count());
        
        response.put("success", true);
        response.put("data", profile);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get student's attendance details for last N days
     */
    @GetMapping("/student/{studentId}/attendance")
    public ResponseEntity<Map<String, Object>> getStudentAttendance(
        @PathVariable String studentId,
        @RequestParam(defaultValue = "30") int days) {
        
        Map<String, Object> response = new HashMap<>();
        
        Optional<Student> student = studentRepository.findByStudentId(studentId);
        if (student.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.ok(response);
        }
        
        LocalDate fromDate = LocalDate.now().minusDays(days);
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateAfter(student.get().getId(), fromDate);
        
        long presentDays = records.stream().filter(Attendance::getIsPresent).count();
        double attendanceRate = records.isEmpty() ? 0 : (presentDays * 100.0) / records.size();
        
        Map<String, Object> data = new HashMap<>();
        data.put("totalDays", records.size());
        data.put("presentDays", presentDays);
        data.put("absentDays", records.size() - presentDays);
        data.put("attendanceRate", Math.round(attendanceRate * 100.0) / 100.0);
        data.put("lastRecords", records.stream()
            .sorted(Comparator.comparing(Attendance::getDate).reversed())
            .limit(10)
            .map(a -> {
                Map<String, Object> record = new HashMap<>();
                record.put("date", a.getDate());
                record.put("present", a.getIsPresent());
                record.put("remarks", a.getRemarks());
                return record;
            })
            .collect(Collectors.toList()));
        
        response.put("success", true);
        response.put("data", data);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all subjects with details, teacher info, and topics
     */
    @GetMapping("/subjects/details")
    public ResponseEntity<Map<String, Object>> getSubjectsDetails() {
        Map<String, Object> response = new HashMap<>();
        
        List<Subject> subjects = subjectRepository.findAll();
        List<Map<String, Object>> subjectDetails = subjects.stream()
            .map(subject -> {
                Map<String, Object> detail = new HashMap<>();
                detail.put("id", subject.getId());
                detail.put("name", subject.getName());
                detail.put("code", subject.getCode());
                detail.put("semester", subject.getSemester());
                detail.put("credits", subject.getCredits());
                detail.put("description", subject.getDescription());
                
                // Teacher info
                if (subject.getTeacher() != null) {
                    Map<String, Object> teacherInfo = new HashMap<>();
                    teacherInfo.put("name", subject.getTeacher().getName());
                    teacherInfo.put("email", subject.getTeacher().getEmail());
                    teacherInfo.put("phone", subject.getTeacher().getPhone());
                    teacherInfo.put("specialization", subject.getTeacher().getSpecialization());
                    teacherInfo.put("experience", subject.getTeacher().getExperienceYears() + " years");
                    detail.put("teacher", teacherInfo);
                }
                
                // Topics with estimated hours
                List<Map<String, Object>> topics = subject.getTopics().stream()
                    .sorted(Comparator.comparing(Topic::getSequenceOrder))
                    .map(topic -> {
                        Map<String, Object> topicInfo = new HashMap<>();
                        topicInfo.put("name", topic.getName());
                        topicInfo.put("description", topic.getDescription());
                        topicInfo.put("estimatedHours", topic.getEstimatedHours());
                        topicInfo.put("difficulty", topic.getDifficultyLevel());
                        return topicInfo;
                    })
                    .collect(Collectors.toList());
                
                double totalHours = topics.stream()
                    .mapToDouble(t -> (double) t.getOrDefault("estimatedHours", 0.0))
                    .sum();
                
                detail.put("topics", topics);
                detail.put("totalEstimatedHours", totalHours);
                detail.put("topicCount", topics.size());
                
                return detail;
            })
            .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("data", subjectDetails);
        response.put("count", subjectDetails.size());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get student's enrolled subjects with progress and scores
     */
    @GetMapping("/student/{studentId}/subjects")
    public ResponseEntity<Map<String, Object>> getStudentSubjects(@PathVariable String studentId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Student> student = studentRepository.findByStudentId(studentId);
        if (student.isEmpty()) {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.ok(response);
        }
        
        List<StudentSubject> enrolledSubjects = studentSubjectRepository.findByStudentId(student.get().getId());
        
        List<Map<String, Object>> subjectList = enrolledSubjects.stream()
            .map(ss -> {
                Map<String, Object> subjectInfo = new HashMap<>();
                Subject subject = ss.getSubject();
                
                subjectInfo.put("name", subject.getName());
                subjectInfo.put("code", subject.getCode());
                subjectInfo.put("credits", subject.getCredits());
                subjectInfo.put("currentScore", ss.getCurrentScore());
                subjectInfo.put("topicProgress", ss.getTopicProgress() + "%");
                subjectInfo.put("hasBacklog", ss.getHasBacklog());
                if (ss.getHasBacklog()) {
                    subjectInfo.put("backlogCount", ss.getBacklogCount());
                }
                
                // Teacher info
                if (subject.getTeacher() != null) {
                    subjectInfo.put("teacher", subject.getTeacher().getName());
                    subjectInfo.put("teacherEmail", subject.getTeacher().getEmail());
                }
                
                // Topic count
                subjectInfo.put("topicCount", subject.getTopics().size());
                
                return subjectInfo;
            })
            .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("data", subjectList);
        response.put("count", subjectList.size());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get study plan for a specific subject
     */
    @GetMapping("/subject/{subjectId}/study-plan")
    public ResponseEntity<Map<String, Object>> getSubjectStudyPlan(@PathVariable Long subjectId) {
        Map<String, Object> response = new HashMap<>();
        
        Optional<Subject> subject = subjectRepository.findById(subjectId);
        if (subject.isEmpty()) {
            response.put("success", false);
            response.put("message", "Subject not found");
            return ResponseEntity.ok(response);
        }
        
        Subject s = subject.get();
        Map<String, Object> plan = new HashMap<>();
        plan.put("subjectName", s.getName());
        plan.put("description", s.getDescription());
        plan.put("credits", s.getCredits());
        
        if (s.getTeacher() != null) {
            plan.put("instructor", s.getTeacher().getName());
        }
        
        List<Map<String, Object>> topicPlan = s.getTopics().stream()
            .sorted(Comparator.comparing(Topic::getSequenceOrder))
            .map(topic -> {
                Map<String, Object> topicDetail = new HashMap<>();
                topicDetail.put("sequence", topic.getSequenceOrder());
                topicDetail.put("topic", topic.getName());
                topicDetail.put("description", topic.getDescription());
                topicDetail.put("estimatedHours", topic.getEstimatedHours());
                topicDetail.put("difficulty", topic.getDifficultyLevel());
                topicDetail.put("objectives", topic.getLearningObjectives());
                topicDetail.put("resources", topic.getResources());
                return topicDetail;
            })
            .collect(Collectors.toList());
        
        plan.put("curriculum", topicPlan);
        
        double totalHours = s.getTopics().stream()
            .mapToDouble(t -> t.getEstimatedHours() != null ? t.getEstimatedHours() : 0)
            .sum();
        plan.put("totalEstimatedHours", totalHours);
        
        response.put("success", true);
        response.put("data", plan);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get all teachers with their details and subjects
     */
    @GetMapping("/teachers")
    public ResponseEntity<Map<String, Object>> getAllTeachers() {
        Map<String, Object> response = new HashMap<>();
        
        List<Teacher> teachers = teacherRepository.findAll();
        List<Map<String, Object>> teacherList = teachers.stream()
            .map(teacher -> {
                Map<String, Object> teacherInfo = new HashMap<>();
                teacherInfo.put("name", teacher.getName());
                teacherInfo.put("email", teacher.getEmail());
                teacherInfo.put("phone", teacher.getPhone());
                teacherInfo.put("specialization", teacher.getSpecialization());
                teacherInfo.put("qualification", teacher.getQualification());
                teacherInfo.put("experience", teacher.getExperienceYears() + " years");
                
                // Subjects taught
                List<String> subjects = teacher.getSubjects().stream()
                    .map(Subject::getName)
                    .collect(Collectors.toList());
                teacherInfo.put("subjects", subjects);
                
                return teacherInfo;
            })
            .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("data", teacherList);
        response.put("count", teacherList.size());
        return ResponseEntity.ok(response);
    }
    
    /**
     * Search students by semester
     */
    @GetMapping("/students/semester/{semester}")
    public ResponseEntity<Map<String, Object>> getStudentsBySemester(@PathVariable String semester) {
        Map<String, Object> response = new HashMap<>();
        
        List<Student> students = studentRepository.findBySemester(semester);
        List<Map<String, Object>> studentList = students.stream()
            .map(student -> {
                Map<String, Object> info = new HashMap<>();
                info.put("studentId", student.getStudentId());
                info.put("name", student.getName());
                info.put("email", student.getEmail());
                info.put("gpa", student.getGpa());
                info.put("attendance", student.getAttendancePercentage());
                return info;
            })
            .collect(Collectors.toList());
        
        response.put("success", true);
        response.put("data", studentList);
        response.put("count", studentList.size());
        return ResponseEntity.ok(response);
    }
}
