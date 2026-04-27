package com.learningpath.controllers;

import com.learningpath.models.Student;
import com.learningpath.services.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createStudent(@RequestBody Student student) {
        Student created = studentService.createStudent(student);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", created);
        response.put("message", "Student created successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getStudent(@PathVariable Long id) {
        var student = studentService.getStudentById(id);
        
        Map<String, Object> response = new HashMap<>();
        if (student.isPresent()) {
            response.put("success", true);
            response.put("data", student.get());
        } else {
            response.put("success", false);
            response.put("message", "Student not found");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/studentId/{studentId}")
    public ResponseEntity<Map<String, Object>> getByStudentId(@PathVariable String studentId) {
        var student = studentService.getStudentByStudentId(studentId);
        
        Map<String, Object> response = new HashMap<>();
        if (student.isPresent()) {
            response.put("success", true);
            response.put("data", student.get());
        } else {
            response.put("success", false);
            response.put("message", "Student not found");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateStudent(
        @PathVariable Long id,
        @RequestBody Student student) {
        
        student.setId(id);
        Student updated = studentService.updateStudent(student);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", updated);
        response.put("message", "Student updated successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("success", "true");
        response.put("message", "Student deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}/backlogs")
    public ResponseEntity<Map<String, Object>> getBacklogs(@PathVariable Long id) {
        var backlogs = studentService.getStudentBacklogs(id);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", backlogs);
        response.put("count", backlogs.size());
        
        return ResponseEntity.ok(response);
    }
}
